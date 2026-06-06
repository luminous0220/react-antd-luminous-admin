import React, { useMemo } from "react";
import { Select, type SelectProps } from "antd";
import { IconMap } from "@/libs/iconMap";

interface IconSelectProps extends Omit<
	SelectProps,
	"options" | "showSearch" | "filterOption" | "optionRender"
> {
	iconMap?: Record<string, React.ReactNode>;
}

export const IconSelect: React.FC<IconSelectProps> = ({
	iconMap = IconMap,
	...props
}) => {
	const options = useMemo(
		() =>
			Object.entries(iconMap).map(([key, node]) => ({
				label: key,
				value: key,
				icon: node,
			})),
		[iconMap],
	);

	return (
		<Select
			placeholder="搜索并选择图标"
			{...props}
			options={options}
			showSearch={{
				filterOption: (input, option) =>
					(option?.label as string).toLowerCase().includes(input.toLowerCase()),
			}}
			optionRender={({ label, data }) => (
				<div className="flex items-center gap-2">
					<span className="flex items-center text-base">{data.icon}</span>
					<span className="text-xs text-gray-500">{label}</span>
				</div>
			)}
		/>
	);
};

export default IconSelect;
