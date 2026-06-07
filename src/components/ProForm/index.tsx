import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
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
			footer,
			onConfirm,
			initialValues,
			collapsible,
			form: externalForm,
			type = "modal",
			width,
			destroyOnHidden = false,
			onClose,
			children,
			...formProps
		} = props;

		const [internalForm] = Form.useForm();
		const form = externalForm ?? internalForm;
		const [loading, setLoading] = useState(false);

		// 弹窗/抽屉状态
		const [isOpen, setIsOpen] = useState(false);
		const [modalTitle, setModalTitle] = useState("");
		const [extraParams, setExtraParams] = useState<Record<string, any>>();

		// 缓存基线值：mount 时为 initialValues，后续 setFieldsValue 调用会同步更新基线
		const baselineRef = useRef<Record<string, unknown>>(initialValues ?? {});

		// Collapse state for inline search mode
		const [collapsed, setCollapsed] = useState(true);

		// Inline mode detection
		const isInlineMode = formProps.layout === "inline" || !!collapsible;

		// Fields filtered for inline mode (standard fields only)
		const inlineFields = useMemo(() => {
			if (!isInlineMode) return [];
			const standard = fields.filter(
				(f) =>
					f.type &&
					f.type !== "divider" &&
					f.type !== "upload" &&
					!isCustomField(f),
			) as TypedFieldConfig<ComponentType>[];
			return standard;
		}, [fields, isInlineMode]);

		// Collapse logic for inline fields
		const showCount = collapsible?.defaultShowCount ?? 6;
		const needsCollapse =
			collapsible != null && inlineFields.length > showCount;
		const visibleInlineFields = useMemo(() => {
			if (!isInlineMode) return [];
			if (collapsed && needsCollapse) {
				return inlineFields.slice(0, showCount);
			}
			return inlineFields;
		}, [isInlineMode, inlineFields, collapsed, needsCollapse, showCount]);

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
		}, [form]);

		// 渲染字段列表
		const renderedFields = useMemo(() => {
			return (isInlineMode ? visibleInlineFields : fields).map(
				(field, index) => {
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
				},
			);
		}, [visibleInlineFields, fields, isInlineMode, form]);

		// 渲染 footer
		const renderedFooter = useMemo(() => {
			if (footer === null) return null;

			const _footer = footer ?? {
				confirmText: "确认",
				resetText: "重置",
				hideConfirm: false,
				hideReset: false,
				confirmStyle: {},
			};

			// Inline mode footer includes collapse toggle
			if (isInlineMode) {
				return (
					<div className="flex items-center gap-2 shrink-0 mt-2 ml-4 md:mt-0">
						<div className="flex items-center justify-end w-full gap-4">
							{!_footer.hideReset && (
								<Button onClick={handleReset} disabled={loading}>
									{_footer.resetText ?? "重置"}
								</Button>
							)}
							{!_footer.hideConfirm && (
								<Button
									type="primary"
									{..._footer.confirmStyle}
									loading={loading}
									onClick={handleConfirm}
									disabled={loading}
								>
									{_footer.confirmText ?? "确认"}
								</Button>
							)}
							{needsCollapse && (
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
							)}
						</div>
					</div>
				);
			}

			return (
				<FormFooter
					footer={_footer}
					loading={loading}
					onConfirm={handleConfirm}
					onReset={handleReset}
				/>
			);
		}, [
			footer,
			loading,
			handleConfirm,
			handleReset,
			isInlineMode,
			needsCollapse,
			collapsed,
			handleToggleCollapse,
		]);

		// 表单内容（纯表单部分，可能被 Modal/Drawer 包裹）
		const formContent = (
			<>
				{topContent}
				<Form
					size="large"
					form={form}
					initialValues={normalizedInitialValues}
					layout={isInlineMode ? "inline" : formProps.layout}
					labelCol={{ style: { width: 120 } }}
					className={isInlineMode ? "flex gap-x-2 gap-y-3" : ""}
					{...formProps}
				>
					{renderedFields}
					{children}
					{renderedFooter}
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
				footer={null}
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
