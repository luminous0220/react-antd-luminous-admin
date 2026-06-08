import { useCallback, useRef } from "react";
import { SelectorTrigger } from "./components/SelectorTrigger";
import { TreeSelectorModal, type TreeSelectorModalRef } from "./TreeSelectorModal";
import type { TreeSelectorNode, TreeSelectorProps } from "./types";
import { findNode, getDescendantKeys } from "./treeUtils";

export type { TreeNodeData, TreeSelectorNode, TreeSelectorProps } from "./types";

/**
 * @description TreeSelector 树形选择器（触发器 + 弹窗）
 * 适合作为表单项使用，自带触发器，点击打开弹窗进行选择。
 * 如需编程式控制弹窗，请使用 TreeSelectorModal。
 */
export const TreeSelector: React.FC<TreeSelectorProps> = ({
	title,
	checkedKeys: controlledCheckedKeys = [],
	onChange,
	treeData = [],
	placeholder = "请选择",
	disabled = false,
	width,
	renderTrigger,
}) => {
	const modalRef = useRef<TreeSelectorModalRef>(null);

	const handleOpen = useCallback(() => {
		if (disabled) return;
		modalRef.current?.open({
			title,
			treeData,
			checkedKeys: controlledCheckedKeys,
		});
	}, [disabled, controlledCheckedKeys, title, treeData]);

	const handleConfirm = useCallback(
		(selected: TreeSelectorNode[]) => onChange?.(selected),
		[onChange],
	);

	const removeTag = useCallback(
		(item: TreeSelectorNode) => {
			let newSelected = controlledCheckedKeys.filter((s) => s.value !== item.value);
			const nodeData = findNode(treeData, item.value);
			if (nodeData?.children?.length) {
				const descendantKeys = getDescendantKeys(treeData, item.value);
				newSelected = newSelected.filter((s) => !descendantKeys.includes(s.value));
			}
			if (item.type === "child" && item.pid) {
				newSelected = newSelected.filter((s) => s.value !== item.pid);
			}
			onChange?.(newSelected);
		},
		[controlledCheckedKeys, treeData, onChange],
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
			<TreeSelectorModal
				ref={modalRef}
				title={title}
				treeData={treeData}
				width={width}
				onConfirm={handleConfirm}
			/>
		</>
	);
};
