import type { ReactNode } from "react";
import { Tag, Space } from "antd";
import { IconChevronDown } from "@tabler/icons-react";

/** 触发器已选项（基础约束） */
export interface SelectorTriggerItem {
	value: number | string;
	title: string;
}

/** 自定义触发器渲染参数 */
export interface SelectorTriggerRenderProps<
	T extends SelectorTriggerItem = SelectorTriggerItem,
> {
	selectedItems: T[];
	placeholder: string;
	disabled: boolean;
	onClick: () => void;
}

/** SelectorTrigger Props */
export interface SelectorTriggerProps<
	T extends SelectorTriggerItem = SelectorTriggerItem,
> {
	/** 已选数据 */
	selectedItems: T[];
	/** 占位文本 */
	placeholder: string;
	/** 是否禁用 */
	disabled: boolean;
	/** 点击打开弹窗 */
	onOpen: () => void;
	/** Tag 删除回调，接收原始 item */
	onRemoveTag: (item: T) => void;
	/**
	 * 自定义触发器，传入后替换默认 Tag 触发器
	 * 典型用法：renderTrigger={(props) => <Button onClick={props.onClick}>选择</Button>}
	 */
	renderTrigger?: (props: SelectorTriggerRenderProps<T>) => ReactNode;
}

/**
 * @description 选择器触发器 — 默认展示 Tag + 计数 + 下拉图标，支持自定义触发器
 */
export function SelectorTrigger<T extends SelectorTriggerItem = SelectorTriggerItem>({
	selectedItems,
	placeholder,
	disabled,
	onOpen,
	onRemoveTag,
	renderTrigger,
}: SelectorTriggerProps<T>) {
	// 自定义触发器
	if (renderTrigger) {
		return (
			<>
				{renderTrigger({
					selectedItems,
					placeholder,
					disabled,
					onClick: onOpen,
				})}
			</>
		);
	}

	// 默认触发器
	return (
		<div
			className={`border border-[var(--ant-color-border)] rounded-lg px-3 py-1.5 flex items-center gap-2
				bg-white dark:bg-[var(--ant-color-bg-container)]
				hover:border-[var(--ant-color-primary)] transition-colors
				min-h-[40px] select-none
				${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
			onClick={onOpen}
		>
			{/* Tag 标签区域 */}
			<div className="flex gap-1 flex-1 overflow-hidden flex-nowrap items-center">
				{selectedItems.map((item) => (
					<Tag
						key={item.value}
						closable={!disabled}
						onClose={(e) => {
							e.stopPropagation();
							onRemoveTag(item);
						}}
						className="shrink-0 text-sm"
					>
						{item.title}
					</Tag>
				))}
				<span className="text-gray-500 text-sm shrink-0 ml-0.5">
					共 {selectedItems.length} 项
				</span>
				{!selectedItems.length && (
					<span className="text-gray-400 text-sm">{placeholder}</span>
				)}
			</div>

			{/* 右侧：数量徽标 + 下拉图标 */}
			<Space size={4} className="shrink-0 ml-auto">
				{!!selectedItems.length && (
					<span
						className="inline-flex items-center justify-center min-w-[20px] h-5
							px-1.5 rounded-full text-xs font-medium
							bg-[var(--ant-color-primary)] text-white"
					>
						{selectedItems.length > 999
							? "999+"
							: selectedItems.length}
					</span>
				)}
				<IconChevronDown size={16} className="text-gray-400" />
			</Space>
		</div>
	);
}
