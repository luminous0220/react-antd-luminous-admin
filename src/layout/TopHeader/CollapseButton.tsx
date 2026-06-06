import {
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";
import { Button } from "antd";
import { useThemeStore } from "@/stores/theme";

export interface CollapseProps {
  className?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export const CollapseButton = ({
  collapsed,
  setCollapsed,
  className = "",
}: CollapseProps) => {
  const { colorVariants } = useThemeStore();

  const toggleCollapsed = () => {
    const newCollapsed = !collapsed;
    setCollapsed?.(newCollapsed);
  };

  return (
    <Button
      className={className}
      type="text"
      icon={
        collapsed ? (
          <IconLayoutSidebarLeftExpand stroke={1} />
        ) : (
          <IconLayoutSidebarRightExpand stroke={1} />
        )
      }
      onClick={toggleCollapsed}
      aria-label={collapsed ? "展开菜单" : "收起菜单"}
      style={{
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colorVariants.lightest;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    />
  );
};
