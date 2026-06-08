import { useCallback, useRef } from "react";
import { SelectorTrigger } from "./components/SelectorTrigger";
import { ListSelectorModal, type ListSelectorModalRef } from "./ListSelectorModal";
import type { ListSelectorNode, ListSelectorProps } from "./types";

export type { ListItemData, ListSelectorNode, ListSelectorProps } from "./types";

/**
 * @description ListSelector 列表选择器（触发器 + 弹窗）
 * 适合作为表单项使用，自带触发器，点击打开弹窗进行选择。
 * 数据通过 api 分页获取，不支持 dataSource。
 * 如需编程式控制弹窗，请使用 ListSelectorModal。
 */
export const ListSelector: React.FC<ListSelectorProps> = ({
	title,
	checkedKeys: controlledCheckedKeys = [],
	onChange,
	api,
	placeholder = "请选择",
	disabled = false,
	width,
	renderTrigger,
}) => {
	const modalRef = useRef<ListSelectorModalRef>(null);

	const handleOpen = useCallback(() => {
		if (disabled) return;
		modalRef.current?.open({
			title,
			api,
			checkedKeys: controlledCheckedKeys,
		});
	}, [disabled, controlledCheckedKeys, title, api]);

	const handleConfirm = useCallback(
		(selected: ListSelectorNode[]) => onChange?.(selected),
		[onChange],
	);

	const removeTag = useCallback(
		(item: ListSelectorNode) => {
			const newSelected = controlledCheckedKeys.filter((s) => s.value !== item.value);
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
			<ListSelectorModal
				ref={modalRef}
				title={title}
				width={width}
				onConfirm={handleConfirm}
			/>
		</>
	);
};
