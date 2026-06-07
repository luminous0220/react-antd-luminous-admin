import { memo } from "react";
import { Divider } from "antd";
import type { DividerProps } from "antd/es/divider";
import type { TypedFieldConfig } from "../types.d";
import { getFieldKey } from "../utils";

/** Divider 字段组件 - 无状态，无需监听表单值 */
export const DividerField = memo(function DividerField({
	field,
	index,
}: {
	field: TypedFieldConfig<"divider">;
	index: number;
}) {
	const key = getFieldKey(field, index);
	const dividerProps = (field.fieldProps ?? {}) as DividerProps;
	return <Divider key={key} {...dividerProps} />;
});
