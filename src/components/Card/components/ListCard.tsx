import { Card, Typography } from "antd";
import type { ListCardProps, ListItemProps } from "../type";

const CARD_STYLE = { borderRadius: 12 };
const ICON_SIZE = 36;

export const ListItem: React.FC<ListItemProps> = ({
  icon,
  iconBgColor = "#e6f7ff",
  children,
}) => {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--ant-color-border-secondary)]">
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: 8,
          backgroundColor: iconBgColor,
        }}
      >
        <span style={{ color: "#fff", fontSize: 16, display: "flex" }}>
          {icon}
        </span>
      </div>
      {children}
    </div>
  );
};

export const ListCard: React.FC<ListCardProps> = ({
  title,
  subtitle,
  footer,
  children,
}) => {
  return (
    <Card styles={{ body: {} }} style={CARD_STYLE} className="h-full">
      <div className="flex items-center gap-4 mb-6">
        <Typography.Title level={5} className="!mb-0">
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary">{subtitle}</Typography.Text>
        )}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
      {footer && <div className="mt-3">{footer}</div>}
    </Card>
  );
};

