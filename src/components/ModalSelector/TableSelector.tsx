import { useCallback, useRef } from "react";
import { SelectorTrigger } from "./components/SelectorTrigger";
import {
	TableSelectorModal,
	type TableSelectorModalRef,
} from "./TableSelectorModal";
import type { TableSelectorNode, TableSelectorProps } from "./types";

export type { TableSelectorNode, TableSelectorProps } from "./types";

/**
 * @description TableSelector 表格选择器（触发器 + 弹窗）
 * 适合作为表单项使用，自带触发器，点击打开弹窗进行选择。
 * 如需编程式控制弹窗，请使用 TableSelectorModal。
 */
export function TableSelector<
	T extends Record<string, any> = Record<string, any>,
>({
	title,
	checkedKeys: controlledCheckedKeys = [],
	onChange,
	placeholder = "请选择",
	disabled = false,
	width,
	selectionType,
	renderTrigger,
	...restProps
}: TableSelectorProps<T>) {
	const modalRef = useRef<TableSelectorModalRef<T>>(null);

	const handleOpen = useCallback(() => {
		if (disabled) return;
		modalRef.current?.open({
			title,
			checkedKeys: controlledCheckedKeys,
			...restProps,
		} as any);
	}, [disabled, controlledCheckedKeys, title, restProps]);

	const handleConfirm = useCallback(
		(selected: TableSelectorNode[]) => {
			onChange?.(selected);
		},
		[onChange],
	);

	const removeTag = useCallback(
		(item: TableSelectorNode) => {
			const newSelected = controlledCheckedKeys.filter(
				(s) => s.value !== item.value,
			);
			onChange?.(newSelected);
		},
		[controlledCheckedKeys, onChange],
	);

	return (
		<>
			<SelectorTrigger
				selectedItems={controlledCheckedKeys}
				placeholder={placeholder}
				disabled={disabled}
				onOpen={handleOpen}
				onRemoveTag={removeTag}
				renderTrigger={renderTrigger}
			/>
			<TableSelectorModal<T>
				ref={modalRef}
				title={title}
				width={width}
				selectionType={selectionType}
				onConfirm={handleConfirm}
			/>
		</>
	);
}
