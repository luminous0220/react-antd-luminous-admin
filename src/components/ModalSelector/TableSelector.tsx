import { useCallback, useRef, useState } from "react";
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
 * checkedKeys 不传时为非受控模式，内部维护选中状态。
 * 如需编程式控制弹窗，请使用 TableSelectorModal。
 */
export function TableSelector<
	T extends Record<string, any> = Record<string, any>,
>({
	title,
	checkedKeys: controlledCheckedKeys,
	onChange,
	placeholder = "请选择",
	disabled = false,
	width,
	selectionType,
	renderTrigger,
	...restProps
}: TableSelectorProps<T>) {
	const isControlled = controlledCheckedKeys !== undefined;
	const [internalCheckedKeys, setInternalCheckedKeys] = useState<TableSelectorNode[]>(
		controlledCheckedKeys ?? [],
	);
	const currentCheckedKeys = isControlled ? controlledCheckedKeys : internalCheckedKeys;

	const modalRef = useRef<TableSelectorModalRef>(null);

	const handleOpen = useCallback(() => {
		if (disabled) return;
		modalRef.current?.open({
			title,
			checkedKeys: currentCheckedKeys,
		});
	}, [disabled, currentCheckedKeys, title]);

	const handleConfirm = useCallback(
		(selected: TableSelectorNode[]) => {
			if (!isControlled) setInternalCheckedKeys(selected);
			onChange?.(selected);
		},
		[isControlled, onChange],
	);

	const removeTag = useCallback(
		(item: TableSelectorNode) => {
			const newSelected = currentCheckedKeys.filter((s) => s.value !== item.value);
			if (!isControlled) setInternalCheckedKeys(newSelected);
			onChange?.(newSelected);
		},
		[currentCheckedKeys, isControlled, onChange],
	);

	return (
		<>
			<SelectorTrigger
				selectedItems={currentCheckedKeys}
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
				{...restProps}
			/>
		</>
	);
}
