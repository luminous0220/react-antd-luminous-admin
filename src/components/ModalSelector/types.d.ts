import type { ReactNode } from "react";
import type { ProTableProps } from "@/components/ProTable";

// ==================== 触发器类型 ====================

/** 触发器已选项基础约束 */
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
	/** 自定义触发器 */
	renderTrigger?: (props: SelectorTriggerRenderProps<T>) => ReactNode;
}

// ==================== 已选面板类型 ====================

/** 已选项 */
export interface SelectedItem {
	value: number | string;
	title: string;
	desc?: string;
}

/** SelectedPanel Props */
export interface SelectedPanelProps {
	className?: string;
	bodyClassName?: string;
	/** 已选数据 */
	selectedItems: SelectedItem[];
	/** 单项删除回调 */
	onRemove: (item: SelectedItem) => void;
	/** 清空全部 */
	onClearAll: () => void;
}

// ==================== 底部操作栏类型 ====================

/** SelectorFooter Props */
export interface SelectorFooterProps {
	/** 当前已选数量 */
	selectedCount: number;
	/** 取消回调 */
	onCancel: () => void;
	/** 确认回调 */
	onConfirm: () => void;
}

// ==================== 树选择器类型 ====================

/** 树节点原始数据 */
export interface TreeNodeData {
	value: number | string;
	title: string;
	/** 额外信息（如区域经理、负责人），展示在已选列表及树节点旁 */
	info?: string;
	children?: TreeNodeData[];
	[key: string]: any;
}

/** TreeSelector api 参数 */
export interface TreeSelectorApiParams {
	keyword?: string;
}

/** TreeSelector api 函数签名 */
export type TreeSelectorApi = (
	params?: TreeSelectorApiParams,
) => Promise<TreeNodeData[] | undefined>;

/** 已选节点 */
export interface TreeSelectorNode {
	value: number | string;
	title: string;
	desc?: string;
	type: "parent" | "child";
	pid?: number | string;
}

/** TreeSelector Props */
export interface TreeSelectorProps {
	/** 弹窗标题，默认 "选择经营区域" */
	title?: string;
	/** 已选数据（受控） */
	checkedKeys?: TreeSelectorNode[];
	/** 选择变化回调 */
	onChange?: (selected: TreeSelectorNode[]) => void;
	/** 树形数据源（静态数据，与 api 二选一） */
	treeData?: TreeNodeData[];
	/**
	 * 数据请求函数，传入后自动从 API 获取树形数据
	 * 优先级高于 treeData
	 */
	api?: TreeSelectorApi;
	/** 占位文本，默认 "请选择" */
	placeholder?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 弹窗宽度，默认 1220 */
	width?: number;
	/** 自定义触发器 */
	renderTrigger?: (props: SelectorTriggerRenderProps<TreeSelectorNode>) => ReactNode;
}

/** TreeSelectorModal open() 可传入的参数 */
export interface TreeSelectorModalOpenProps {
	title?: string;
	treeData?: TreeNodeData[];
	checkedKeys?: TreeSelectorNode[];
}

/** TreeSelectorModal 实例方法 */
export interface TreeSelectorModalRef {
	open: (props: TreeSelectorModalOpenProps) => void;
	close: () => void;
}

/** TreeSelectorModal Props */
export interface TreeSelectorModalProps {
	title?: string;
	treeData?: TreeNodeData[];
	/** 数据请求函数（默认值） */
	api?: TreeSelectorApi;
	width?: number;
	onConfirm?: (selected: TreeSelectorNode[]) => void;
}

// ==================== 表格选择器类型 ====================

/** 表格已选行 */
export interface TableSelectorNode {
	value: number | string;
	title: string;
	desc?: string;
}

/** TableSelector Props — 继承 ProTable 全部能力，增加选择器专属 props */
export interface TableSelectorProps<T = Record<string, any>> extends Omit<
	ProTableProps<T>,
	"rowSelection" | "onSelectRows" | "dataSource" | "title"
> {
	/** 弹窗标题，默认 "选择数据" */
	title?: string;
	/** 已选数据（受控） */
	checkedKeys?: TableSelectorNode[];
	/** 选择变化回调 */
	onChange?: (selected: TableSelectorNode[]) => void;
	/** 占位文本，默认 "请选择" */
	placeholder?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 弹窗宽度，默认 1280 */
	width?: number;
	/**
	 * 选择模式，默认 "checkbox"（多选）
	 * - "checkbox"：多选
	 * - "radio"：单选
	 */
	selectionType?: "checkbox" | "radio";
	/** 行数据中标题字段名，默认 "name" */
	labelKey?: string;
	/** 行数据中描述字段名，默认 "desc" */
	descKey?: string;
	/** 自定义触发器 */
	renderTrigger?: (props: SelectorTriggerRenderProps<TableSelectorNode>) => ReactNode;
}

/** TableSelectorModal open() 可传入的参数 */
export interface TableSelectorModalOpenProps {
	/** 弹窗标题（覆盖默认值） */
	title?: string;
	/** 已选数据（用于恢复选中状态） */
	checkedKeys?: TableSelectorNode[];
}

/** TableSelectorModal 实例方法 */
export interface TableSelectorModalRef {
	open: (props: TableSelectorModalOpenProps) => void;
	close: () => void;
}

/** TableSelectorModal Props — 继承 ProTable 全部能力，增加选择器专属 props */
export interface TableSelectorModalProps<T = Record<string, any>>
	extends Omit<
		ProTableProps<T>,
		"rowSelection" | "onSelectRows" | "dataSource" | "title"
	> {
	/** 弹窗标题，默认 "选择数据" */
	title?: string;
	/** 弹窗宽度，默认 1280 */
	width?: number;
	/**
	 * 选择模式，默认 "checkbox"（多选）
	 * - "checkbox"：多选
	 * - "radio"：单选
	 */
	selectionType?: "checkbox" | "radio";
	/** 确认回调 */
	onConfirm?: (selected: TableSelectorNode[]) => void;
	/** 行数据中标题字段名，默认 "name" */
	labelKey?: string;
	/** 行数据中描述字段名，默认 "desc" */
	descKey?: string;
}

// ==================== 列表选择器类型 ====================

/** 列表项原始数据 */
export interface ListItemData {
	value: number | string;
	title: string;
	desc?: string;
	[key: string]: any;
}

/** 列表已选项 */
export type ListSelectorNode = TableSelectorNode;

/** ListSelector api 参数 */
export interface ListSelectorApiParams {
	pageNumber: number;
	pageSize: number;
	keyword?: string;
}

/** ListSelector api 函数签名 */
export type ListSelectorApi = (
	params: ListSelectorApiParams,
) => Promise<{ data: ListItemData[]; total: number } | undefined>;

/** ListSelector Props */
export interface ListSelectorProps {
	/** 弹窗标题，默认 "选择数据" */
	title?: string;
	/** 已选数据（受控） */
	checkedKeys?: ListSelectorNode[];
	/** 选择变化回调 */
	onChange?: (selected: ListSelectorNode[]) => void;
	/** 数据请求函数（必填） */
	api: ListSelectorApi;
	/** 占位文本，默认 "请选择" */
	placeholder?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 弹窗宽度，默认 820 */
	width?: number;
	/** 自定义触发器 */
	renderTrigger?: (props: SelectorTriggerRenderProps<ListSelectorNode>) => ReactNode;
}

/** ListSelectorModal open() 可传入的参数 */
export interface ListSelectorModalOpenProps {
	/** 弹窗标题（覆盖默认值） */
	title?: string;
	/** 静态数据源（直接传入，跳过 api 请求） */
	data?: ListItemData[];
	/** 已选数据（恢复选中状态） */
	checkedKeys?: ListSelectorNode[];
}

/** ListSelectorModal 实例方法 */
export interface ListSelectorModalRef {
	open: (props: ListSelectorModalOpenProps) => void;
	close: () => void;
}

/** ListSelectorModal Props */
export interface ListSelectorModalProps {
	/** 弹窗标题，默认 "选择数据" */
	title?: string;
	/** 弹窗宽度，默认 820 */
	width?: number;
	/** 数据请求函数 */
	api?: ListSelectorApi;
	/** 确认回调 */
	onConfirm?: (selected: ListSelectorNode[]) => void;
}
