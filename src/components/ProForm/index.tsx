import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { Form, Button, Drawer } from "antd";
import type {
	ProFormProps,
	TypedFieldConfig,
	ComponentType,
	ProFormInstance,
} from "./types.d";
import {
	getFieldKey,
	formatTimeFields,
	filterHiddenFields,
	normalizeTimeFields,
	isDividerField,
	isCustomField,
} from "./utils";
import { ProModal } from "../ProModal";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { DividerField } from "./components/DividerField";
import { StandardField } from "./components/StandardField";
import { FormFooter } from "./components/FormFooter";
import { useGlobalStore } from "@/stores";

/**
 * ProForm 配置化表单组件
 *
 * 优化特性：
 * - 字段组件独立，避免级联重渲染
 * - 只有需要联动的字段才监听表单值
 * - 使用 React.memo 包装子组件
 * - 静态字段不触发 shouldUpdate
 */
export const ProForm = forwardRef<ProFormInstance, ProFormProps>(
	(props, ref) => {
		const {
			title,
			fields,
			topContent,
			defaultButtons,
			onConfirm,
			onReset,
			initialValues,
			collapsible,
			form: externalForm,
			type = "modal",
			width,
			destroyOnHidden = false,
			onClose,
			footer,
			children,
			...formProps
		} = props;
		const isMobile = useGlobalStore((s) => s.isMobile);
		const [internalForm] = Form.useForm();
		const form = externalForm ?? internalForm;
		const [loading, setLoading] = useState(false);

		// 弹窗/抽屉状态
		const [isOpen, setIsOpen] = useState(false);
		const [modalTitle, setModalTitle] = useState("");
		const [extraParams, setExtraParams] = useState<Record<string, any>>();

		// 缓存基线值：mount 时为 initialValues，后续 setFieldsValue 调用会同步更新基线
		const baselineRef = useRef<Record<string, unknown>>(initialValues ?? {});

		// 折叠展开状态
		const [collapsed, setCollapsed] = useState(true);

		// Inline mode detection（仅由 layout 决定，不与 collapsible 绑定）
		const isInlineMode = formProps.layout === "inline" && !isMobile;

		// 标准字段（非 divider、非 upload、非自定义渲染），用于 inline 展示和折叠逻辑
		const standardFilteredFields = useMemo(() => {
			return fields.filter(
				(f) =>
					f.type &&
					f.type !== "divider" &&
					f.type !== "upload" &&
					!isCustomField(f),
			) as TypedFieldConfig<ComponentType>[];
		}, [fields]);

		// 折叠配置与逻辑（独立于 inline 模式）
		const showCount = collapsible?.defaultShowCount ?? 6;
		const needsCollapse =
			collapsible != null && standardFilteredFields.length > showCount;

		// 折叠状态下可见的标准字段
		const visibleCollapsedFields = useMemo(() => {
			if (!needsCollapse || !collapsed) return standardFilteredFields;
			return standardFilteredFields.slice(0, showCount);
		}, [standardFilteredFields, needsCollapse, collapsed, showCount]);

		// 折叠可见字段 key 集合（用于快速查找）
		const visibleCollapsedKeys = useMemo(() => {
			if (!collapsible) return null;
			return new Set(
				visibleCollapsedFields.map((f) => getFieldKey(f, fields.indexOf(f))),
			);
		}, [collapsible, visibleCollapsedFields, fields]);

		// inline 模式下仅展示标准字段（配合折叠）
		const visibleInlineFields = useMemo(() => {
			if (!isInlineMode) return [];
			return visibleCollapsedFields;
		}, [isInlineMode, visibleCollapsedFields]);

		// Toggle collapse
		const handleToggleCollapse = useCallback(() => {
			setCollapsed((prev) => !prev);
		}, []);

		// 打开弹窗/抽屉
		const open = useCallback(
			(params: {
				title: string;
				initialValues?: Record<string, unknown>;
				extraParams?: Record<string, any>;
			}) => {
				if (type === "pure") return;
				setModalTitle(params.title);
				setExtraParams(params.extraParams);
				setIsOpen(true);
				// 应用初始值
				if (params.initialValues) {
					const normalized = normalizeTimeFields(params.initialValues, fields);
					form.resetFields();
					form.setFieldsValue(normalized);
					baselineRef.current = params.initialValues;
				}
			},
			[type, fields, form],
		);

		// 关闭弹窗/抽屉
		const close = useCallback(() => {
			if (type === "pure") return;
			setIsOpen(false);
			onClose?.();
			requestAnimationFrame(() => {
				form.resetFields();
			});
		}, [type, onClose, form]);

		// 处理初始值中的时间字段转换
		const normalizedInitialValues = useMemo(
			() => normalizeTimeFields(initialValues, fields),
			[initialValues, fields],
		);

		// 验证并获取格式化值（不触发 onConfirm）
		const validateAndGetFormattedValues = useCallback(async () => {
			const validated = await form.validateFields();
			const filtered = filterHiddenFields(validated, fields);
			return formatTimeFields(filtered, fields);
		}, [form, fields]);

		// 提交表单（可由外部调用）
		const submit = useCallback(async () => {
			try {
				const validated = await form.validateFields();
				const filtered = filterHiddenFields(validated, fields);
				const formatted = formatTimeFields(filtered, fields);
				setLoading(true);
				await onConfirm?.(modalTitle, formatted, extraParams);
				// 非 pure 模式下确认成功后自动关闭弹窗
				if (type !== "pure") {
					setIsOpen(false);
					onClose?.();
				}
			} finally {
				setLoading(false);
			}
		}, [form, fields, onConfirm, extraParams, type, onClose, modalTitle]);

		// 暴露 Form 实例所有方法 + 增强方法
		// setFieldsValue 被代理以同步更新基线，确保重置可回到调用方设定的初始值
		useImperativeHandle(ref, () => {
			const originalSetFieldsValue = form.setFieldsValue.bind(form);
			return Object.assign(form, {
				validate: validateAndGetFormattedValues,
				setFieldsValue: (values: Record<string, unknown>) => {
					baselineRef.current = { ...baselineRef.current, ...values };
					originalSetFieldsValue(values);
				},
				open,
				close,
				setLoading,
			}) as ProFormInstance;
		}, [form, validateAndGetFormattedValues, open, close]);

		// 内部提交处理（点击确认按钮时调用）
		const handleConfirm = useCallback(async () => {
			await submit();
		}, [submit]);

		// 重置处理：恢复到基线值（initialValues + 后续 setFieldsValue 的合并值），不触发任何关闭弹窗逻辑
		const handleReset = useCallback(() => {
			form.resetFields();
			form.setFieldsValue(baselineRef.current);
			onReset?.(baselineRef.current);
		}, [form, onReset]);

		// 渲染字段列表
		const renderedFields = useMemo(() => {
			// inline 模式：仅渲染标准字段（可能折叠）
			const sourceFields = isInlineMode ? visibleInlineFields : fields;

			return sourceFields
				.map((field, index) => {
					// 非 inline 模式下的折叠：隐藏超出 showCount 的标准字段
					if (
						!isInlineMode &&
						collapsible &&
						visibleCollapsedKeys &&
						!visibleCollapsedKeys.has(getFieldKey(field, index))
					) {
						return null;
					}

					const key = getFieldKey(field, index);
					// Divider 分割线
					if (isDividerField(field)) {
						return <DividerField key={key} field={field} index={index} />;
					}

					return (
						<StandardField
							key={key}
							field={field}
							form={form}
							isInlineMode={isInlineMode}
						/>
					);
				})
				.filter(Boolean);
		}, [
			visibleInlineFields,
			fields,
			isInlineMode,
			form,
			collapsible,
			visibleCollapsedKeys,
		]);

		// 渲染 footer
		const renderedFooter = useMemo(() => {
			if (defaultButtons === null) return null;

			const _defaultButtons = defaultButtons ?? {
				confirmText: "确认",
				resetText: "重置",
				confirmIcon: null,
				resetIcon: null,
				hideConfirm: false,
				hideReset: false,
				confirmStyle: {},
				resetStyle: {},
			};

			// 折叠切换按钮（独立于 inline 模式）
			const collapseToggle = needsCollapse ? (
				<Button
					type="link"
					onClick={handleToggleCollapse}
					disabled={loading}
					icon={
						collapsed ? (
							<IconChevronDown size={16} />
						) : (
							<IconChevronUp size={16} />
						)
					}
				>
					{collapsed ? "展开" : "收起"}
				</Button>
			) : null;

			// Inline 模式 footer：包含折叠切换
			if (isInlineMode) {
				return (
					<div className="flex items-center gap-2 shrink-0 mt-2 ml-4 md:mt-0">
						<div className="flex items-center justify-end w-full gap-4">
							{!_defaultButtons.hideReset && (
								<Button
									{..._defaultButtons.resetStyle}
									loading={loading}
									icon={_defaultButtons.resetIcon}
									onClick={handleReset}
									disabled={loading}
								>
									{_defaultButtons.resetText ?? "重置"}
								</Button>
							)}
							{!_defaultButtons.hideConfirm && (
								<Button
									type="primary"
									{..._defaultButtons.confirmStyle}
									icon={_defaultButtons.confirmIcon}
									loading={loading}
									onClick={handleConfirm}
									disabled={loading}
								>
									{_defaultButtons.confirmText ?? "确认"}
								</Button>
							)}
							{collapseToggle}
						</div>
					</div>
				);
			}

			return (
				<>
					<FormFooter
						footer={_defaultButtons}
						loading={loading}
						onConfirm={handleConfirm}
						onReset={handleReset}
					/>
					{collapseToggle && (
						<div className="flex justify-center mt-2">{collapseToggle}</div>
					)}
				</>
			);
		}, [
			defaultButtons,
			loading,
			handleConfirm,
			handleReset,
			isInlineMode,
			needsCollapse,
			collapsed,
			handleToggleCollapse,
		]);

		// 移动端模式强制垂直布局，inline 模式使用 inline，否则使用传入布局或默认 horizontal
		const layout = isMobile
			? "vertical"
			: isInlineMode
				? "inline"
				: (formProps.layout ?? "vertical");

		// 表单内容（纯表单部分，可能被 Modal/Drawer 包裹）
		// topContent 渲染在 Form 上方，可通过外部 form 实例手动同步字段值
		const formContent = (
			<>
				{topContent}
				<Form
					form={form}
					initialValues={normalizedInitialValues}
					size="large"
					className={isInlineMode ? "flex gap-x-2 gap-y-3" : ""}
					{...formProps}
					layout={layout}
				>
					{renderedFields}
					{children}
					{type === "pure" && renderedFooter}
				</Form>
			</>
		);

		// pure 模式：直接渲染表单
		if (type === "pure") {
			return formContent;
		}

		// drawer 模式：包裹 Drawer
		if (type === "drawer") {
			return (
				<Drawer
					open={isOpen}
					onClose={close}
					title={title ? title : modalTitle}
					size={width ?? 520}
					destroyOnHidden={destroyOnHidden}
					footer={
						footer ? (
							footer
						) : (
							<div className="grid grid-cols-2 gap-4">
								<Button
									loading={loading}
									disabled={loading}
									size="large"
									onClick={handleReset}
								>
									重置
								</Button>
								<Button
									loading={loading}
									disabled={loading}
									size="large"
									type="primary"
									onClick={handleConfirm}
								>
									提交
								</Button>
							</div>
						)
					}
				>
					{formContent}
				</Drawer>
			);
		}

		// modal 模式（默认）：包裹 ProModal
		return (
			<ProModal
				open={isOpen}
				onCancel={close}
				title={title ? title : modalTitle}
				width={width}
				destroyOnHidden={destroyOnHidden}
				footer={
					footer ? (
						footer
					) : (
						<div className="grid grid-cols-2 gap-4">
							<Button
								loading={loading}
								disabled={loading}
								size="large"
								onClick={handleReset}
							>
								重置
							</Button>
							<Button
								loading={loading}
								disabled={loading}
								size="large"
								type="primary"
								onClick={handleConfirm}
							>
								提交
							</Button>
						</div>
					)
				}
			>
				{formContent}
			</ProModal>
		);
	},
);

// 导出类型供外部使用
export type {
	ProFormProps,
	ProFormFields,
	FormFieldItem,
	ProFormInstance,
	ProFormMode,
	FormValues,
} from "./types.d";
