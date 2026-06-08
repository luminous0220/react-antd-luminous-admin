import { useCallback, useRef, useState } from "react";
import { SelectorTrigger } from "./components/SelectorTrigger";
import { TreeSelectorModal, type TreeSelectorModalRef } from "./TreeSelectorModal";
import type { TreeSelectorNode, TreeSelectorProps } from "./types";
import { findNode, getDescendantKeys } from "./utils";

export type { TreeNodeData, TreeSelectorNode, TreeSelectorProps } from "./types";

/**
 * @description TreeSelector 树形选择器（触发器 + 弹窗）
 * 适合作为表单项使用，自带触发器，点击打开弹窗进行选择。
 * 支持 treeData 静态数据或 api 动态获取数据。
 * checkedKeys 不传时为非受控模式，内部维护选中状态。
 * 如需编程式控制弹窗，请使用 TreeSelectorModal。
 */
export const TreeSelector: React.FC<TreeSelectorProps> = ({
	title,
	checkedKeys: controlledCheckedKeys,
	onChange,
	treeData = [],
	api,
	placeholder = "请选择",
	disabled = false,
	width,
	renderTrigger,
}) => {
	const isControlled = controlledCheckedKeys !== undefined;
	const [internalCheckedKeys, setInternalCheckedKeys] = useState<TreeSelectorNode[]>(
		controlledCheckedKeys ?? [],
	);
	const currentCheckedKeys = isControlled ? controlledCheckedKeys : internalCheckedKeys;

	const modalRef = useRef<TreeSelectorModalRef>(null);

	const handleOpen = useCallback(() => {
		if (disabled) return;
		modalRef.current?.open({
			title,
			treeData,
			checkedKeys: currentCheckedKeys,
		});
	}, [disabled, currentCheckedKeys, title, treeData]);

	const handleConfirm = useCallback(
		(selected: TreeSelectorNode[]) => {
			if (!isControlled) setInternalCheckedKeys(selected);
			onChange?.(selected);
		},
		[isControlled, onChange],
	);

	const removeTag = useCallback(
		(item: TreeSelectorNode) => {
			let newSelected = currentCheckedKeys.filter((s) => s.value !== item.value);
			const nodeData = findNode(treeData, item.value);
			if (nodeData?.children?.length) {
				const descendantKeys = getDescendantKeys(treeData, item.value);
				newSelected = newSelected.filter((s) => !descendantKeys.includes(s.value));
			}
			if (item.type === "child" && item.pid) {
				newSelected = newSelected.filter((s) => s.value !== item.pid);
			}
			if (!isControlled) setInternalCheckedKeys(newSelected);
			onChange?.(newSelected);
		},
		[currentCheckedKeys, isControlled, treeData, onChange],
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
			<TreeSelectorModal
				ref={modalRef}
				title={title}
				treeData={treeData}
				api={api}
				width={width}
				onConfirm={handleConfirm}
			/>
		</>
	);
};
