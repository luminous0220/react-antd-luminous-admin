import { Typography, Button, Divider } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { ListCard, ListItem } from "@/components/Card";
import type {
  DataCardProps,
  TodoCardProps,
  ActivityCardProps,
  TransactionCardProps,
} from "@/components/Card/type.d";

// ---- Todo Card ----

const TodoCard: React.FC<TodoCardProps> = ({ title, subtitle, items }) => {
  
  return (
    <ListCard title={title} subtitle={subtitle}>
      {items.map((item, i) => (
        <ListItem key={i} icon={item.icon} iconBgColor={item.iconBgColor}>
          <div className="flex-1 min-w-0">
            <Typography.Text
              style={{ fontSize: 14, fontWeight: 500, display: "block" }}
              className="truncate"
            >
              {item.title}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {item.status}
            </Typography.Text>
          </div>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 12, whiteSpace: "nowrap" }}
          >
            {item.time}
          </Typography.Text>
        </ListItem>
      ))}
    </ListCard>
  );
};

// ---- Activity Card ----

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  subtitle,
  items,
  onViewMore,
}) => {
  const footer = (
    <>
      <Divider />
      <div className="flex-center">
        <Button
          className="w-full"
          type="default"
          icon={<RightOutlined />}
          iconPlacement="end"
          onClick={onViewMore}
        >
          查看更多
        </Button>
      </div>
    </>
  );

  return (
    <ListCard title={title} subtitle={subtitle} footer={footer}>
      {items.map((item, i) => (
        <ListItem key={i} icon={item.icon} iconBgColor={item.iconBgColor}>
          <div className="flex-1 min-w-0">
            <Typography.Text
              style={{ fontSize: 14, color: "#262626", display: "block" }}
              className="truncate"
            >
              {item.title}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12 }}
              className="truncate"
            >
              {item.description}
            </Typography.Text>
          </div>
        </ListItem>
      ))}
    </ListCard>
  );
};

// ---- Transaction Timeline Card ----

const TransactionCard: React.FC<TransactionCardProps> = ({
  title,
  subtitle,
  items,
}) => {
  return (
    <ListCard title={title} subtitle={subtitle}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} className="flex gap-3" style={{ minHeight: 52 }}>
            {/* Timeline column */}
            <div
              className="flex flex-col items-center flex-shrink-0"
              style={{ width: 16 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              {!isLast && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    backgroundColor: "#e8e8e8",
                    marginTop: 4,
                  }}
                />
              )}
            </div>
            {/* Content */}
            <div
              className="flex-1 min-w-0"
              style={{ paddingBottom: isLast ? 0 : 16 }}
            >
              <Typography.Text type="secondary" className="block font-bold">
                {item.time}
              </Typography.Text>
              <Typography.Text style={{ fontSize: 13, color: "#595959" }}>
                {renderHighlightedText(item.description, item.highlightText)}
              </Typography.Text>
            </div>
          </div>
        );
      })}
    </ListCard>
  );
};

function renderHighlightedText(
  text: string,
  highlight?: string,
): React.ReactNode {
  if (!highlight) return text;
  const parts = text.split(highlight);
  return parts.map((part, i) =>
    i === parts.length - 1 ? (
      part
    ) : (
      <span key={i}>
        {part}
        <span style={{ color: "#1890ff", fontWeight: 500 }}>{highlight}</span>
      </span>
    ),
  );
}

// ---- DataCard Container ----

const DataCard: React.FC<DataCardProps> = ({
  todoTitle,
  todoSubtitle,
  todoItems,
  activityTitle,
  activitySubtitle,
  activityItems,
  onViewMore,
  transactionTitle,
  transactionSubtitle,
  transactionItems,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TodoCard title={todoTitle} subtitle={todoSubtitle} items={todoItems} />
      <ActivityCard
        title={activityTitle}
        subtitle={activitySubtitle}
        items={activityItems}
        onViewMore={onViewMore}
      />
      <TransactionCard
        title={transactionTitle}
        subtitle={transactionSubtitle}
        items={transactionItems}
      />
    </div>
  );
};

export default DataCard;
