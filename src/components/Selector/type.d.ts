/** 树节点原始数据 */
export interface TreeNodeData {
	value: number | string;
	title: string;
	/** 额外信息（如区域经理、负责人），展示在已选列表及树节点旁 */
	info?: string;
	children?: TreeNodeData[];
	[key: string]: any;
}

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
	/** 树形数据源 */
	treeData?: TreeNodeData[];
	/** 占位文本，默认 "请选择" */
	placeholder?: string;
	/** 是否禁用 */
	disabled?: boolean;
	/** 弹窗宽度，默认 1220 */
	width?: number;
}

/** 表格已选行 */
export interface TableSelectorNode {
	value: number | string;
	title: string;
	desc?: string;
}

import type { ProTableProps } from "@/components/ProTable";

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
}
