import { Button, Tooltip } from "antd";

/**
 * @description 主题色块按钮，用于预设颜色选择
 */
export const ColorItem = ({
	color,
	label,
	isActive,
	onClick,
}: {
	color: string;
	label: string;
	isActive: boolean;
	onClick: () => void;
}) => (
	<Tooltip title={label} placement="top">
		<Button
			onClick={onClick}
			className={`flex items-center justify-center w-8 h-8 rounded-full ${
				isActive ? "outline-2! outline-offset-2" : ""
			}`}
			style={{
				backgroundColor: color,
				outlineColor: isActive ? color : "transparent",
			}}
		/>
	</Tooltip>
);
