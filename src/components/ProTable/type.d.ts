import type { TableProps, TableColumnType } from "antd";
import type { ReactNode } from "react";
import type { ProFormFields, FormValues } from "@/components/ProForm/type";

/** API 返回数据结构 */
export interface ProTableApiResult<T> {
	data?: T[];
	total?: number;
}

/** 分页参数 */
export interface ProTablePagination {
	pageNumber: number;
	pageSize: number;
}

/** 表格密度 */
export type ProTableDensity = "small" | "middle" | "large";

/** 列固定位置 */
export type ProTableColumnFixed = "left" | "right" | undefined;

/** 增强的列配置类型 */
export interface ProTableColumnType<T>
	extends Omit<TableColumnType<T>, "fixed"> {
	/** 列标识，用于列配置持久化 */
	key?: string;
	/** 是否可隐藏，默认 true */
	hideable?: boolean;
	/** 是否可固定，默认 true */
	fixable?: boolean;
	/** 默认是否显示，默认 true */
	show?: boolean;
	/** 默认固定位置 */
	fixed?: ProTableColumnFixed;
}

/** 列配置状态 */
export interface ProTableColumnConfig {
	key: string;
	show: boolean;
	fixed: ProTableColumnFixed;
	order: number;
}

/** 筛选表单配置 */
export interface ProTableSearchConfig {
	/** 表单字段配置 */
	fields: ProFormFields;
	/** 默认显示字段数量（超出后折叠），默认 3 */
	defaultShowCount?: number;
	/** 表单初始值 */
	initialValues?: FormValues;
}

/** ProTable Props */
export interface ProTableProps<T>
	extends Omit<
		TableProps<T>,
		"dataSource" | "pagination" | "loading" | "columns" | "size"
	> {
		/** API 函数，传入后自动请求 */
		api?: (
			params: ProTablePagination & Record<string, unknown>,
		) => Promise<ProTableApiResult<T> | undefined>;
		/** 是否自动请求，默认 true */
		auto?: boolean;
		/** 表格标题 */
		title?: ReactNode;
		/** 工具栏左侧自定义内容 */
		toolbarExtra?: ReactNode;
		/** 是否显示序号列，默认 false */
		index?: boolean;
		/** 序号列宽度，默认 60 */
		indexWidth?: number;
		/** 行选择回调，存在时开启选择功能 */
		onSelectRows?: (selectedRows: T[]) => void;
		/** 分页变化回调 */
		onPageChange?: (pagination: ProTablePagination) => void;
		/** 列配置 */
		columns?: ProTableColumnType<T>[];
		/** 外部传入的数据源（不使用 api 时） */
		dataSource?: T[];
		/** 外部传入的总数（不使用 api 时，用于分页） */
		total?: number;
		/** 默认分页参数 */
		defaultPagination?: ProTablePagination;
		/** 筛选表单配置，undefined时不显示筛选表单 */
		search?: ProTableSearchConfig;
		/** 是否显示导出按钮，默认 false */
		exportable?: boolean;
		/** 导出文件名（不含扩展名），默认使用 title 或当前日期 */
		exportFileName?: string;
		/** 是否开启行拖拽排序，默认 false */
		dragSort?: boolean;
		/** 拖拽排序结束回调，传入重新排序后的完整数据 */
		onDragSortEnd?: (dataSource: T[]) => void;
	}

/**
 * ProTable 暴露给父组件的实例方法（通过 ref 访问）
 */
export interface ProTableInstance<T = any> {
	/** 手动刷新表格数据 */
	refresh: () => Promise<void>;
	/** 获取当前表格数据源 */
	getDataSource: () => T[];
	/** 清空已选行 */
	clearSelected: () => void;
	/** 设置搜索表单值 */
	setSearchValues: (values: Record<string, unknown>) => void;
	/** 重置搜索表单并刷新 */
	reset: () => void;
	/** 设置表格 loading 状态 */
	setLoading: (loading: boolean) => void;
}


	export interface ProTableToolbarProps {
		title?: React.ReactNode;
		toolbarExtra?: React.ReactNode;
		density: ProTableDensity;
		onDensityChange: (density: ProTableDensity) => void;
		onRefresh: () => void;
		columns: ProTableColumnType<unknown>[];
		columnConfigs: ProTableColumnConfig[];
		onColumnConfigsChange: (configs: ProTableColumnConfig[]) => void;
		isMobile: boolean;
		exportable?: boolean;
		onExport?: () => void;
		selectedCount?: number;
	}