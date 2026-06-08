import { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { ProModal } from "@/components/ProModal";
import { ProTable } from "@/components/ProTable";
import type { ProTableColumnType, ProTableProps } from "@/components/ProTable";
import { SelectedPanel } from "./components/SelectedPanel";
import type { SelectedItem } from "./components/SelectedPanel";
import { SelectorFooter } from "./components/SelectorFooter";
import type { TableSelectorNode } from "./types";

/** open() 可传入的参数 */
export interface TableSelectorModalOpenProps<T = Record<string, any>>
	extends Omit<
		ProTableProps<T>,
		"rowSelection" | "onSelectRows" | "dataSource" | "title"
	> {
	/** 弹窗标题 */
	title?: string;
	/** 已选数据（用于恢复选中状态） */
	checkedKeys?: TableSelectorNode[];
}

/** TableSelectorModal 实例方法 */
export interface TableSelectorModalRef<T = Record<string, any>> {
	open: (props: TableSelectorModalOpenProps<T>) => void;
	close: () => void;
}

/** TableSelectorModal Props */
export interface TableSelectorModalProps {
	/** 默认弹窗标题 */
	title?: string;
	/** 弹窗宽度 */
	width?: number;
	/** 选择模式 */
	selectionType?: "checkbox" | "radio";
	/** 确认回调 */
	onConfirm?: (selected: TableSelectorNode[]) => void;
}

/**
 * @description TableSelectorModal 表格选择弹窗（无触发器，编程式控制）
 * 通过 ref.open(props) 打开弹窗并渲染 ProTable，ref.close() 关闭。
 */
function TableSelectorModalInner<T extends Record<string, any> = Record<string, any>>(
	{
		title: defaultTitle = "选择数据",
		width = 1280,
		selectionType = "checkbox",
		onConfirm,
	}: TableSelectorModalProps,
	ref: React.ForwardedRef<TableSelectorModalRef<T>>,
) {
	const isRadio = selectionType === "radio";

	const [isOpen, setIsOpen] = useState(false);
	const [modalCheckedKeys, setModalCheckedKeys] = useState<React.Key[]>([]);
	const [modalItemCache, setModalItemCache] = useState<Record<string, TableSelectorNode>>({});

	// 当前表格配置（由 open 传入）
	const [tableConfig, setTableConfig] = useState<TableSelectorModalOpenProps<T>>({});

	const {
		title: modalTitle,
		columns = [],
		rowKey = "id",
		labelKey = "name",
		descKey = "desc",
		...restTableProps
	} = tableConfig;

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
		(props: TableSelectorModalOpenProps<T>) => {
			setTableConfig(props);
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
		[],
	);

	const close = useCallback(() => setIsOpen(false), []);

	useImperativeHandle(ref, () => ({ open, close }), [open, close]);

	const proTableProps: Record<string, any> = {
		...restTableProps,
		columns: columns as ProTableColumnType<T>[],
		rowKey,
		rowSelection,
		index: true,
		scroll: restTableProps.scroll ?? { y: 360 },
	};

	return (
		<ProModal
			open={isOpen}
			onCancel={handleCancel}
			title={modalTitle ?? defaultTitle}
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
								onRemove={removeSelectedItem as (item: SelectedItem) => void}
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
	props: TableSelectorModalProps & { ref?: React.Ref<TableSelectorModalRef<T>> },
) => React.ReactElement | null;
