// src/components/ThemePanel/ThemePanel.tsx
import { ColorPicker, Typography } from "antd";
import { PRESET_COLORS, PresetColorKey, useThemeStore } from "@/stores/theme";
import { ColorItem } from "./components/ColorItem";

const { Text } = Typography;

// 主题设置抽屉组件
export const ThemePanel = () => {
	const { colorPrimary, setPresetColor, setColorPrimary } = useThemeStore();

	return (
		<div>
			{/* 主题色选择 */}
			<Text strong>主题色</Text>
			<div className="mt-2 flex flex-wrap gap-2">
				{(Object.keys(PRESET_COLORS) as PresetColorKey[]).map((key) => (
					<ColorItem
						key={key}
						color={PRESET_COLORS[key]}
						label={key}
						isActive={colorPrimary === PRESET_COLORS[key]}
						onClick={() => setPresetColor(key)}
					/>
				))}
			</div>

			<div className="mt-3">
				<Text type="secondary">自定义</Text>
				<ColorPicker
					value={colorPrimary}
					onChange={(color) => setColorPrimary(color.toHexString())}
					showText
					className="w-full mt-1"
				/>
			</div>
		</div>
	);
};
