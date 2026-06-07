import { useState, useCallback, useMemo } from "react";
import { ProModal } from "@/components/ProModal";
import { ProTable } from "@/components/ProTable";
import type { ProTableColumnType } from "@/components/ProTable";
import { SelectorTrigger } from "./components/SelectorTrigger";
import { SelectedPanel } from "./components/SelectedPanel";
import type { SelectedItem } from "./components/SelectedPanel";
import { SelectorFooter } from "./components/SelectorFooter";
import type { TableSelectorNode, TableSelectorProps } from "./type";

export type { TableSelectorNode, TableSelectorProps } from "./type";

/**
* @description TableSelector 表格选择器（单选/多选）
 * - 默认模式：触发器 + ProModal（ProTable + 已选面板 + 底部操作栏）
 * 数据完全通过 api 请求获取，选中项跨分页保留。
 */
export function TableSelector<
	T extends Record<string, any> = Record<string, any>,
>({
	// ---- TableSelector 专属 props ----
	title: modalTitle = "选择数据",
	checkedKeys: controlledCheckedKeys = [],
	onChange,
	placeholder = "请选择",
	disabled = false,
	width = 1280,
	selectionType = "checkbox",
		renderTrigger,
	// ---- ProTable props ----
	columns = [],
	rowKey = "id",
	labelKey = "name",
	descKey = "desc",
	// ---- 其余全部透传给 ProTable（api、search 等） ----
	...restProps
}: TableSelectorProps<T>) {
	const isRadio = selectionType === "radio";

	// 弹窗状态
	const [isOpen, setIsOpen] = useState(false);
	// 已选 key 集合（跨分页保留）
	const [modalCheckedKeys, setModalCheckedKeys] = useState<React.Key[]>([]);
	// 已选项详情缓存（key → 行信息，解决跨页行数据丢失问题）
	const [modalItemCache, setModalItemCache] = useState<
		Record<string, TableSelectorNode>
	>({});

	// 弹窗内已选列表（从 keys + cache 派生）
	const modalSelected = useMemo<TableSelectorNode[]>(() => {
		return modalCheckedKeys
			.map((key) => modalItemCache[String(key)])
			.filter(Boolean);
	}, [modalCheckedKeys, modalItemCache]);

	// 打开弹窗 — 从外部 controlledCheckedKeys 恢复选中状态
	const handleOpen = useCallback(() => {
		if (disabled) return;
		const keys = controlledCheckedKeys.map((item) => item.value);
		setModalCheckedKeys(keys);
		const cache: Record<string, TableSelectorNode> = {};
		for (const item of controlledCheckedKeys) {
			cache[String(item.value)] = item;
		}
		setModalItemCache(cache);
		setIsOpen(true);
	}, [disabled, controlledCheckedKeys]);

	// 取消
	const handleCancel = useCallback(() => {
		setIsOpen(false);
	}, []);

	// 确认 — 从 keys + cache 构建最终列表
	const handleConfirm = useCallback(() => {
		const selected = modalCheckedKeys
			.map((key) => modalItemCache[String(key)])
			.filter(Boolean);
		onChange?.(selected);
		setIsOpen(false);
	}, [modalCheckedKeys, modalItemCache, onChange]);

	// 清空选择
	const handleClearAll = useCallback(() => {
		setModalCheckedKeys([]);
		setModalItemCache({});
	}, []);

	// 右侧已选列表单项删除
	const removeSelectedItem = useCallback(
		(item: TableSelectorNode) => {
			setModalCheckedKeys((prev) => prev.filter((k) => k !== item.value));
			setModalItemCache((prev) => {
				const next = { ...prev };
				delete next[String(item.value)];
				return next;
			});
		},
		[],
	);

	// 触发器 Tag 删除（直接提交 onChange）
	const removeTag = useCallback(
		(item: TableSelectorNode) => {
			const newSelected = controlledCheckedKeys.filter(
				(s) => s.value !== item.value,
			);
			onChange?.(newSelected);
		},
		[controlledCheckedKeys, onChange],
	);

	// 行选择配置（受控）
	const rowSelection = useMemo(() => {
		const radio = selectionType === "radio";
		return {
			selectedRowKeys: radio
				? modalCheckedKeys.slice(-1)
				: modalCheckedKeys,
			onChange: (keys: React.Key[], rows: T[]) => {
				const finalKeys = radio ? keys.slice(-1) : keys;
				setModalCheckedKeys(finalKeys);
				setModalItemCache((prev) => {
					const next = { ...prev };
					for (const row of rows) {
						const title = (row as any)[labelKey];
						const value = (row as any)[rowKey];
						const desc = (row as any)[descKey];
						next[value] = { title, value, desc };
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

	// ProTable 合并 props（选择器模式）
	const proTableProps: Record<string, any> = {
		...restProps,
		columns: columns as ProTableColumnType<T>[],
		rowKey,
		rowSelection,
		index: true,
		scroll: restProps.scroll ?? { y: 360 },
	};

	return (
		<>
			{/* 触发器 */}
			<SelectorTrigger
				selectedItems={controlledCheckedKeys}
				placeholder={placeholder}
				disabled={disabled}
				onOpen={handleOpen}
				onRemoveTag={removeTag}
				renderTrigger={renderTrigger}
			/>

			{/* 弹窗 */}
			<ProModal
				open={isOpen}
				onCancel={handleCancel}
				title={modalTitle}
				width={width}
				footer={null}
				destroyOnHidden
			>
				<div className="flex flex-col">
					{/* 左右布局 — 单选时表格占满宽度 */}
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

					{/* 底部操作栏 */}
					<SelectorFooter
						selectedCount={modalSelected.length}
						onCancel={handleCancel}
						onConfirm={handleConfirm}
					/>
				</div>
			</ProModal>
		</>
	);
}
