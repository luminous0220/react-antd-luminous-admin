import type { FormProps, FormInstance, FormItemProps, Rule } from "antd";
import type { InputProps, TextAreaProps } from "antd/es/input";
import type { InputNumberProps } from "antd/es/input-number";
import type { SelectProps } from "antd/es/select";
import type { TreeSelectProps } from "antd/es/tree-select";
import type { SwitchProps } from "antd/es/switch";
import type { RadioGroupProps } from "antd/es/radio";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import type { DatePickerProps } from "antd/es/date-picker";
import type { TimePickerProps } from "antd/es/time-picker";
import type { DividerProps } from "antd/es/divider";
import type { ButtonProps } from "antd/es/button";
import type { ReactNode } from "react";
import type { Dayjs } from "dayjs";
import { ProUploadProps } from "../ProUpload";

/** 表单值类型 */
type FormValues = Record<string, unknown>;

/** ProForm 显示模式 */
type ProFormMode = "modal" | "drawer" | "pure";

export type TimeFieldType = "date-picker" | "time-picker";

/** 组件类型枚举 */
type ComponentType =
	| "input"
	| "textarea"
	| "input-number"
	| "input-password"
	| "select"
	| "tree-select"
	| "upload"
	| "switch"
	| "radio"
	| "checkbox"
	| "date-picker"
	| "time-picker"
	| "divider";

/** 各类型对应的 fieldProps 映射 */
type FieldPropsMap = {
	input: InputProps;
	textarea: TextAreaProps;
	"input-number": InputNumberProps;
	"input-password": InputProps;
	select: SelectProps;
	"tree-select": TreeSelectProps;
	upload: ProUploadProps;
	switch: SwitchProps;
	radio: RadioGroupProps;
	checkbox: CheckboxGroupProps;
	"date-picker": DatePickerProps;
	"time-picker": TimePickerProps;
	divider: DividerProps;
	undefined: null;
};

/** 基础字段配置（不含 fieldProps） */
type BaseFieldConfig = {
	label?: string;
	name?: string | string[];
	rules?: Rule[];
	disabled?: boolean | ((values: FormValues) => boolean);
	visible?: boolean | ((values: FormValues) => boolean);
	shouldUpdate?: boolean | ((prev: FormValues, curr: FormValues) => boolean);
	render?: (value: unknown, form: FormInstance) => ReactNode;
	/** Form.Item 的额外配置 */
	formItemProps?: FormItemProps;
};

/** 埦 type 的字段配置 - 判别联合实现 fieldProps 类型关联 */
type TypedFieldConfig<T extends ComponentType> = BaseFieldConfig & {
	type?: T;
	fieldProps?: FieldPropsMap[T];
};

/** 无 type 的自定义渲染字段配置 */
type CustomFieldConfig = BaseFieldConfig & {
	type?: undefined;
	render: (value: unknown, form: FormInstance) => ReactNode;
};

/** 完整字段配置类型 */
type FormFieldItem<T extends ComponentType = ComponentType> =
	| TypedFieldConfig<T>
	| CustomFieldConfig;

/** 字段配置数组 */
type ProFormFields = FormFieldItem[];

/** Footer 按钮配置 */
type ProFormFooter = {
	confirmText?: string;
	resetText?: string;
	hideConfirm?: boolean;
	hideReset?: boolean;
	confirmStyle?: ButtonProps;
};

/** 折叠配置 */
type ProFormCollapseConfig = {
	/** 默认显示字段数量（超出后折叠），默认 3 */
	defaultShowCount?: number;
};

/** ProForm 组件 Props */

type ProFormProps = Omit<FormProps, "fields" | "title" | "onFinish"> & {
	title?: React.ReactNode;
	className?: string;
	/** 字段配置数组 */
	fields: ProFormFields;
	/** Footer 按钮配置 */
	footer?: ProFormFooter | null;
	/** 提交回调，extraParams 为 open() 传入的额外参数 */
	onConfirm?: (
		title: string,
		values: FormValues,
		extraParams?: Record<string, any>,
	) => Promise<void> | void;
	/** 折叠配置，传入后启用折叠功能，配合 layout="inline" 使用 */
	collapsible?: ProFormCollapseConfig;
	/** 显示模式：modal（弹窗，默认）、drawer（抽屉）、pure（纯表单） */
	type?: ProFormMode;
	/** Modal/Drawer 宽度，默认 520 */
	width?: number;
	/** 关闭时销毁表单内容 */
	destroyOnHidden?: boolean;
	/** 弹窗/抽屉关闭回调 */
	onClose?: () => void;
	/** 自定义内容，渲染在表单字段与 footer 之间 */
	children?: React.ReactNode;
	/** 顶部内容，渲染在表单字段上方 */
	topContent?: React.ReactNode;
	/**
	 * 默认值通过 initialValues 传递
	 * <ProForm initialValues={{ key:value }} />
	 * **/
};

/** ProForm 组件实例类型（暴露 Form 实例所有方法 + 增强方法） */
type ProFormInstance = FormInstance & {
	/** 提交表单（验证 + 过滤 + 格式化） */
	validate: () => Promise<FormValues>;
	/**
	 * 打开弹窗/抽屉（仅在 type !== 'pure' 时有效）
	 * @param params.title - 弹窗标题
	 * @param params.initialValues - 表单默认值
	 * @param params.extraParams - 额外参数，会透传到 onConfirm 回调
	 */
	open: (params: {
		title: React.ReactNode;
		initialValues?: FormValues;
		extraParams?: Record<string, any>;
	}) => void;
	/** 关闭弹窗/抽屉（仅在 type !== 'pure' 时有效） */
	close: () => void;
	setLoading: (loading: boolean) => void;
};

/** 时间字段初始化值转换函数参数 */
type TimeFieldValue = string | number | Date | Dayjs | null | undefined;

export type {
	ComponentType,
	FieldPropsMap,
	BaseFieldConfig,
	TypedFieldConfig,
	CustomFieldConfig,
	FormFieldItem,
	ProFormFields,
	ProFormFooter,
	ProFormCollapseConfig,
	ProFormProps,
	ProFormInstance,
	ProFormMode,
	FormValues,
	TimeFieldValue,
};
