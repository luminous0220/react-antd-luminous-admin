// src/components/ThemePanel/ThemePanel.tsx
import { Button, ColorPicker, Divider, Switch, Tooltip, Typography } from "antd";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { PRESET_COLORS, PresetColorKey, useThemeStore } from "@/stores/theme";

const { Text } = Typography;

const ColorItem = ({
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
      className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive ? "outline-2! outline-offset-2" : ""
        }`}
      style={{ backgroundColor: color, outlineColor: isActive ? color : "transparent" }}
    />
  </Tooltip>
);

// 主题设置抽屉组件
export const ThemePanel = () => {
  const { colorPrimary, isDark, toggleDark, setPresetColor, setColorPrimary } = useThemeStore();

  return (
    <div>
      {/* 暗黑模式切换 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconSun size={18}  stroke={1}/>
          <Text strong>暗黑模式</Text>
        </div>
        <Switch
          checked={isDark}
          onChange={toggleDark}
          checkedChildren={<IconMoon size={18} stroke={1} />}
          unCheckedChildren={<IconSun size={18} stroke={1} />}
        />
      </div>

      <Divider className="!my-4" />

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