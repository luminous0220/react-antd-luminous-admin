import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type {
	FormFieldItem,
	FormValues,
	ProFormFields,
	TimeFieldType,
	TimeFieldValue,
	TypedFieldConfig,
} from "./type";

/** antd Form.Item name 类型（支持嵌套路径） */
type FieldName = string | string[];

/** 将字段名标准化为字符串数组 */
function toPath(name: FieldName | undefined): string[] {
	if (!name) return [];
	return Array.isArray(name) ? [...name] : [name];
}

/** 读取嵌套对象中的值，path 为 ['user', 'name'] 形式的路径数组 */
function getNestedValue(
	obj: Record<string, unknown>,
	name: FieldName,
): unknown {
	const path = toPath(name);
	let current: unknown = obj;
	for (const key of path) {
		if (current == null || typeof current !== "object") return undefined;
		current = (current as Record<string, unknown>)[key];
	}
	return current;
}

/** 设置嵌套对象中的值，path 为 ['user', 'name'] 形式的路径数组 */
function setNestedValue(
	obj: Record<string, unknown>,
	name: FieldName,
	value: unknown,
): void {
	const path = toPath(name);
	if (path.length === 0) return;
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];
		if (!(key in current) || typeof current[key] !== "object") {
			current[key] = {} as Record<string, unknown>;
		}
		current = current[key] as Record<string, unknown>;
	}
	current[path[path.length - 1]] = value;
}

/** 删除嵌套对象中的值 */
function unsetNestedValue(
	obj: Record<string, unknown>,
	name: FieldName,
): void {
	const path = toPath(name);
	if (path.length === 0) return;
	let current: Record<string, unknown> | undefined = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const next = current[path[i]];
		if (next == null || typeof next !== "object") return;
		current = next as Record<string, unknown>;
	}
	delete current[path[path.length - 1]];
}

/** 判断是否为时间类型字段 */
function isTimeField(
	field: FormFieldItem,
): field is TypedFieldConfig<TimeFieldType> {
	return field.type === "date-picker" || field.type === "time-picker";
}

/** 获取时间字段的 format 配置 */
function getTimeFieldFormat(
	field: TypedFieldConfig<TimeFieldType>,
): string | undefined {
	const props = field.fieldProps;
	if (props && "format" in props) {
		return props.format as string | undefined;
	}
	return undefined;
}

/**
 * 输入转换：外部值 → dayjs
 * 支持字符串、时间戳、Date 对象、已有的 dayjs 对象
 */
export function toDayjs(value: TimeFieldValue, format?: string): Dayjs | null {
	if (!value) {
		return null;
	}

	// 已经是 dayjs 对象
	if (dayjs.isDayjs(value)) {
		return value.isValid() ? value : null;
	}

	// 字符串或数字转换
	const d = dayjs(value, format);

	// 如果指定格式解析失败，尝试默认解析
	if (!d.isValid() && format) {
		const fallback = dayjs(value);
		return fallback.isValid() ? fallback : null;
	}

	return d.isValid() ? d : null;
}

/**
 * 输出转换：dayjs → 字符串
 * DatePicker 默认格式：YYYY-MM-DD
 * TimePicker 默认格式：HH:mm:ss
 */
export function fromDayjs(
	value: Dayjs | null,
	type: "date-picker" | "time-picker",
	format?: string,
): string | null {
	if (!value || !value.isValid()) {
		return null;
	}

	const defaultFormat = type === "date-picker" ? "YYYY-MM-DD" : "HH:mm:ss";

	return value.format(format ?? defaultFormat);
}

/**
 * 批量处理表单值中的时间字段
 * 将 dayjs 对象转换为标准字符串格式
 */
export function formatTimeFields(
	values: FormValues,
	fields: ProFormFields,
): FormValues {
	const result = { ...values };

	for (const field of fields) {
		if (isTimeField(field)) {
			const name = field.name;
			if (!name) continue;
			const fieldValue = getNestedValue(result, name) as Dayjs | null;
			if (fieldValue != null) {
				const format = getTimeFieldFormat(field);
				setNestedValue(result, name, fromDayjs(fieldValue, field.type!, format));
			}
		}
	}

	return result;
}

/**
 * 过滤隐藏字段的值
 * 当字段 visible 为 false 时，清除该字段的值
 */
export function filterHiddenFields(
	values: FormValues,
	fields: ProFormFields,
): FormValues {
	const result = { ...values };

	for (const field of fields) {
		if (field.type && field.type !== "divider" && field.name) {
			// 检查字段是否可见
			if (!isVisible(field, values)) {
				// 隐藏字段，清除其值
				unsetNestedValue(result, field.name);
			}
		}
	}

	return result;
}

/**
 * 批量处理初始值中的时间字段
 * 将外部字符串/时间戳转换为 dayjs 对象
 */
export function normalizeTimeFields(
	initialValues: FormValues | undefined,
	fields: ProFormFields,
): FormValues {
	if (!initialValues) {
		return {};
	}

	const result = { ...initialValues };

	for (const field of fields) {
		if (isTimeField(field)) {
			const name = field.name;
			if (!name) continue;
			const rawValue = getNestedValue(result, name) as TimeFieldValue;
			if (rawValue != null) {
				const format = getTimeFieldFormat(field);
				setNestedValue(result, name, toDayjs(rawValue, format));
			}
		}
	}

	return result;
}

/**
 * 判断字段是否可见
 * 支持 boolean 或函数形式
 */
export function isVisible(field: FormFieldItem, values: FormValues): boolean {
	if (field.visible === undefined) {
		return true;
	}

	if (typeof field.visible === "boolean") {
		return field.visible;
	}

	return field.visible(values);
}

/**
 * 判断字段是否禁用
 * 支持 boolean 或函数形式
 */
export function isDisabled(field: FormFieldItem, values: FormValues): boolean {
	if (field.disabled === undefined) {
		return false;
	}

	if (typeof field.disabled === "boolean") {
		return field.disabled;
	}

	return field.disabled(values);
}

/**
 * 生成字段的唯一 key
 * 用于列表渲染时的 key 属性
 */
export function getFieldKey(field: FormFieldItem, index: number): string {
	const name = field.name;
	if (!name) return `field-${index}`;
	return Array.isArray(name) ? name.join("_") : name;
}
