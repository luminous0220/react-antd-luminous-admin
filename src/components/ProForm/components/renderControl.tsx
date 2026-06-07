import {
	Input,
	InputNumber,
	Select,
	TreeSelect,
	Switch,
	Radio,
	Checkbox,
	DatePicker,
	TimePicker,
} from "antd";
import type { ComponentType } from "../types.d";

/** 渲染单个表单控件 */
export function renderControl(
	type: ComponentType,
	fieldProps: object | undefined,
	disabled: boolean,
): React.ReactNode {
	const props = { ...fieldProps, disabled };

	switch (type) {
		case "input":
			return <Input {...props} />;
		case "input-password":
			return <Input.Password {...props} />;
		case "textarea":
			return <Input.TextArea {...props} />;
		case "input-number":
			return <InputNumber {...props} />;
		case "select":
			return <Select {...props} />;
		case "tree-select":
			return <TreeSelect {...props} />;
		case "switch":
			return <Switch {...props} />;
		case "radio":
			return <Radio.Group {...props} />;
		case "checkbox":
			return <Checkbox.Group {...props} />;
		case "date-picker":
			return <DatePicker {...props} />;
		case "time-picker":
			return <TimePicker {...props} />;
		default:
			return null;
	}
}
