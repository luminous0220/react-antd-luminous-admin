import React, { useMemo } from "react";
import { AutoComplete, Input } from "antd";
import type { AutoCompleteProps } from "antd";
import { IconMap } from "@/libs/iconMap";

interface IconSelectProps extends Omit<
	AutoCompleteProps,
	"options" | "onChange" | "children" | "value" | "showSearch"
> {
	iconMap?: Record<string, React.ReactNode>;
	/** 当前图标名称，支持任意自定义值（无需在 iconMap 中存在） */
	value?: string;
	/** 图标名称变化回调 */
	onChange?: (value: string) => void;
}

export const IconSelect: React.FC<IconSelectProps> = ({
	iconMap = IconMap,
	value,
	onChange,
	...props
}) => {
	const options = useMemo(
		() =>
			Object.entries(iconMap).map(([key, node]) => ({
				value: key,
				label: (
					<div className="flex items-center gap-2">
						<span className="flex items-center text-base">{node}</span>
						<span className="text-xs text-gray-500">{key}</span>
					</div>
				),
			})),
		[iconMap],
	);

	// 当前值命中 iconMap 时，作为输入框前缀图标展示；自定义值（如 "Library"）则无前缀
	const prefixIcon = value ? iconMap[value] : undefined;

	return (
		<AutoComplete
			placeholder="搜索或直接输入图标名称"
			{...props}
			value={value}
			options={options}
			showSearch={{
				filterOption: (input, option) =>
					(option?.value as string)
						?.toLowerCase()
						.includes(input.toLowerCase()),
			}}
			onChange={(v) => onChange?.(v)}
		>
			<Input
				allowClear
				prefix={
					prefixIcon ? (
						<span className="flex items-center text-base">{prefixIcon}</span>
					) : null
				}
			/>
		</AutoComplete>
	);
};

export default IconSelect;
