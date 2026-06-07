import { memo } from "react";
import { Form } from "antd";
import type { FormInstance } from "antd";
import type { TypedFieldConfig, ComponentType, FormValues } from "../types";
import { isVisible, isDisabled, normFile, isCustomField } from "../utils";
import { ProUpload, type ProUploadProps } from "../../ProUpload";
import { renderControl } from "./renderControl";



/** 标准表单字段组件 */
export const StandardField = memo(function StandardField({
	field,
	form,
	isInlineMode,
}: {
	field: TypedFieldConfig<ComponentType>;
	form: FormInstance;
	isInlineMode: boolean;
}) {
	const { name, label, rules } = field;

	const needsWatch =
		typeof field.visible === "function" || typeof field.disabled === "function";

	const initialValue = form.getFieldValue(field.name);
	const hidden = field.visible === false;
	const disabled = field.disabled === true;
	const className = isInlineMode ? "min-w-[160px]" : "";
	const commonProps = {
		name,
		label,
		rules,
		hidden,
		className,
	};

	if (field.type === "upload") {
		return (
			<Form.Item
				{...commonProps}
				{...field.formItemProps}
				valuePropName="fileList"
				getValueFromEvent={normFile}
			>
				<ProUpload
					{...(field.fieldProps as ProUploadProps)}
					defaultFileList={Array.isArray(initialValue) ? initialValue : []}
				/>
			</Form.Item>
		);
	}

	if (isCustomField(field) && field.render) {
		return (
			<Form.Item {...commonProps} {...field.formItemProps}>
				<Form.Item noStyle shouldUpdate={true}>
					{() => field.render!(form.getFieldValue(field.name), form)}
				</Form.Item>
			</Form.Item>
		);
	}

	if (needsWatch) {
		return (
			<Form.Item noStyle shouldUpdate>
				{() => {
					const values = form.getFieldsValue() as FormValues;
					const hidden = !isVisible(field, values);
					const disabled = isDisabled(field, values);

					if (hidden) {
						return (
							<Form.Item
								name={field.name}
								label={field.label}
								rules={field.rules}
								hidden
								{...field.formItemProps}
							>
								{renderControl(
									field.type!,
									field.fieldProps as object,
									disabled,
								)}
							</Form.Item>
						);
					}

					return (
						<Form.Item
							name={field.name}
							label={field.label}
							rules={field.rules}
							{...field.formItemProps}
						>
							{renderControl(field.type!, field.fieldProps as object, disabled)}
						</Form.Item>
					);
				}}
			</Form.Item>
		);
	}

	return (
		<Form.Item {...commonProps} {...field.formItemProps}>
			{renderControl(field.type!, field.fieldProps as object, disabled)}
		</Form.Item>
	);
});
