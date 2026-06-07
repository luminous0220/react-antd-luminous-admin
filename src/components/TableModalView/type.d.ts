import type { ProTableProps } from "@/components/ProTable";

/** open() 传入的表格参数 */
export interface TableModalOpenProps<T = Record<string, any>>
	extends Omit<
		ProTableProps<T>,
		"rowSelection" | "onSelectRows" | "dataSource" | "title"
	> {
	/** 弹窗标题（覆盖默认 title） */
	title?: string;
}

/** TableModalView 组件 Props */
export interface TableModalViewProps {
	/** 默认弹窗标题 */
	title?: string;
	/** 弹窗宽度，默认 1280 */
	width?: number;
}

/** TableModalView 暴露给父组件的方法 */
export interface TableModalViewRef<T = Record<string, any>> {
	/**
	 * 打开弹窗并渲染 ProTable
	 * @param props 表格参数（api、columns、search 等）
	 */
	open: (props: TableModalOpenProps<T>) => void;
	/** 关闭弹窗 */
	close: () => void;
}
