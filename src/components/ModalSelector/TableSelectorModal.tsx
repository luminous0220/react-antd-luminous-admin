import { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { ProModal } from "@/components/ProModal";
import { ProTable } from "@/components/ProTable";
import type { ProTableColumnType } from "@/components/ProTable";
import { SelectedPanel } from "./components/SelectedPanel";
import { SelectorFooter } from "./components/SelectorFooter";
import type {
	TableSelectorNode,
	TableSelectorModalOpenProps,
	TableSelectorModalRef,
	TableSelectorModalProps,
} from "./types";

export type {
	TableSelectorModalOpenProps,
	TableSelectorModalRef,
	TableSelectorModalProps,
} from "./types";

/**
 * @description TableSelectorModal 表格选择弹窗（无触发器，编程式控制）
 * ProTable 配置通过组件 props 传入，checkedKeys 通过 open() 传入。
 * 通过 ref.open(props) 打开弹窗，ref.close() 关闭。
 */
function TableSelectorModalInner<T extends Record<string, any> = Record<string, any>>(
	{
		title: defaultTitle = "选择数据",
		width = 1280,
		selectionType = "checkbox",
		onConfirm,
		// ProTable 相关 props
		columns = [],
		rowKey = "id",
		labelKey = "name",
		descKey = "desc",
		...restTableProps
	}: TableSelectorModalProps<T>,
	ref: React.ForwardedRef<TableSelectorModalRef>,
) {
	const isRadio = selectionType === "radio";

	const [isOpen, setIsOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState(defaultTitle);
	const [modalCheckedKeys, setModalCheckedKeys] = useState<React.Key[]>([]);
	const [modalItemCache, setModalItemCache] = useState<Record<string, TableSelectorNode>>({});

	const modalSelected = useMemo<TableSelectorNode[]>(() => {
		return modalCheckedKeys.map((k) => modalItemCache[String(k)]).filter(Boolean);
	}, [modalCheckedKeys, modalItemCache]);

	const handleCancel = useCallback(() => setIsOpen(false), []);

	const handleConfirm = useCallback(() => {
		const selected = modalCheckedKeys
			.map((k) => modalItemCache[String(k)])
			.filter(Boolean);
		onConfirm?.(selected);
		setIsOpen(false);
	}, [modalCheckedKeys, modalItemCache, onConfirm]);

	const handleClearAll = useCallback(() => {
		setModalCheckedKeys([]);
		setModalItemCache({});
	}, []);

	const removeSelectedItem = useCallback((item: TableSelectorNode) => {
		setModalCheckedKeys((prev) => prev.filter((k) => k !== item.value));
		setModalItemCache((prev) => {
			const next = { ...prev };
			delete next[String(item.value)];
			return next;
		});
	}, []);

	// 点击行切换勾选：checkbox 模式点击切换，radio 模式点击直接选中该行
	const toggleRow = useCallback(
		(record: T) => {
			const value = (record as any)[rowKey];
			const nextKeys = isRadio
				? [value]
				: modalCheckedKeys.includes(value)
					? modalCheckedKeys.filter((k) => k !== value)
					: [...modalCheckedKeys, value];

			setModalCheckedKeys(nextKeys);
			setModalItemCache((prev) => {
				const next = { ...prev };
				const keySet = new Set(nextKeys.map(String));
				// 移除不再选中的行
				for (const k of Object.keys(next)) {
					if (!keySet.has(String(k))) delete next[k];
				}
				// 写入点击行的缓存
				next[String(value)] = {
					value,
					title: (record as any)[labelKey] ?? String(value),
					desc: (record as any)[descKey],
				};
				return next;
			});
		},
		[isRadio, modalCheckedKeys, rowKey, labelKey, descKey],
	);

	// 行点击事件：跳过勾选列/按钮/链接等交互元素，避免与复选框点击或单元格内交互冲突
	const onRow = useCallback(
		(record: T) => ({
			className: "cursor-pointer",
			onClick: (event: React.MouseEvent) => {
				const target = event.target as HTMLElement;
				if (
					target.closest(
						".ant-table-selection-column, .ant-checkbox, .ant-radio, button, a, input, .ant-table-row-expand-icon",
					)
				) {
					return;
				}
				toggleRow(record);
			},
		}),
		[toggleRow],
	);

	const rowSelection = useMemo(() => {
		const radio = selectionType === "radio";
		return {
			selectedRowKeys: radio ? modalCheckedKeys.slice(-1) : modalCheckedKeys,
			onChange: (keys: React.Key[], rows: T[]) => {
				const finalKeys = radio ? keys.slice(-1) : keys;
				setModalCheckedKeys(finalKeys);
				setModalItemCache((prev) => {
					const next = { ...prev };
					for (const row of rows) {
						const val = (row as any)[rowKey];
						next[val] = {
							value: val,
							title: (row as any)[labelKey] ?? String(val),
							desc: (row as any)[descKey],
						};
					}
					const keySet = new Set(finalKeys.map(String));
					for (const k of Object.keys(next)) {
						if (!keySet.has(String(k))) delete next[k];
					}
					return next;
				});
			},
			type: selectionType,
		};
	}, [modalCheckedKeys, selectionType, rowKey, labelKey, descKey]);

	const open = useCallback(
		(props: TableSelectorModalOpenProps) => {
			setModalTitle(props.title ?? defaultTitle);
			// 恢复已选状态
			if (props.checkedKeys?.length) {
				const keys = props.checkedKeys.map((item) => item.value);
				setModalCheckedKeys(keys);
				const cache: Record<string, TableSelectorNode> = {};
				for (const item of props.checkedKeys) cache[String(item.value)] = item;
				setModalItemCache(cache);
			} else {
				setModalCheckedKeys([]);
				setModalItemCache({});
			}
			setIsOpen(true);
		},
		[defaultTitle],
	);

	const close = useCallback(() => setIsOpen(false), []);

	useImperativeHandle(ref, () => ({ open, close }), [open, close]);

	const proTableProps: Record<string, any> = {
		...restTableProps,
		columns: columns as ProTableColumnType<T>[],
		rowKey,
		rowSelection,
		onRow,
		index: true,
		scroll: restTableProps.scroll ?? { y: 360 },
	};

	return (
		<ProModal
			open={isOpen}
			onCancel={handleCancel}
			title={modalTitle}
			width={width}
			footer={null}
			destroyOnHidden
		>
			<div className="flex flex-col">
				<div className="gap-5 min-h-0 grid grid-cols-10 max-md:grid-cols-1">
					<div className={isRadio ? "col-span-10" : "col-span-7"}>
						<ProTable<T> title="列表选择区域" {...proTableProps} />
					</div>
					{!isRadio && (
						<div className="col-span-3">
							<SelectedPanel
								bodyClassName="!max-h-[600px]"
								selectedItems={modalSelected}
								onRemove={removeSelectedItem}
								onClearAll={handleClearAll}
							/>
						</div>
					)}
				</div>
				<SelectorFooter
					selectedCount={modalSelected.length}
					onCancel={handleCancel}
					onConfirm={handleConfirm}
				/>
			</div>
		</ProModal>
	);
}

export const TableSelectorModal = forwardRef(TableSelectorModalInner) as <
	T extends Record<string, any> = Record<string, any>,
>(
	props: TableSelectorModalProps<T> & { ref?: React.Ref<TableSelectorModalRef> },
) => React.ReactElement | null;
