import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Button, Space, Tag, Typography } from 'antd';
import {
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ListCard, ListItem } from '@/components/Card';
import { useCalendarStore } from '@/stores';
import type { CalendarReminder } from './types';

const { Text } = Typography;

interface NotificationListProps {
  onEditReminder: (reminder: CalendarReminder) => void;
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  onEditReminder,
  onClose,
}) => {
  const reminders = useCalendarStore((s) => s.reminders);
  const completeReminder = useCalendarStore((s) => s.completeReminder);
  const deleteReminder = useCalendarStore((s) => s.deleteReminder);

  const sorted = useMemo(() => {
    return [...reminders]
      .filter((r) => !r.completed)
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }, [reminders]);

  if (sorted.length === 0) {
    return (
      <div style={{ width: 360, padding: 16, textAlign: 'center' }}>
        <Text type="secondary">暂无提醒</Text>
      </div>
    );
  }

  return (
    <div style={{ width: 420, maxHeight: 480, overflow: 'auto' }}>
      <ListCard title="提醒中心" subtitle={`共 ${sorted.length} 项`}>
        {sorted.map((r) => (
          <ListItem
            key={r.id}
            icon={
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: r.color,
                }}
              />
            }
            iconBgColor="transparent"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Text
                  strong
                  style={{
                    textDecoration: r.completed ? 'line-through' : undefined,
                  }}
                >
                  {r.title}
                </Text>
              </div>
              {r.note && (
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                    {r.note}
                  </Text>
                </div>
              )}
              <div className="flex items-center gap-2">
                {dayjs(r.dateTime).isBefore(dayjs()) ? (
                  <>
                    <Text type="secondary" style={{ fontSize: 12, color: '#ff4d4f' }}>
                      {dayjs(r.dateTime).format('YYYY-MM-DD HH:mm')}
                    </Text>
                    <Tag color="error" style={{ fontSize: 11, lineHeight: '18px' }}>已过期</Tag>
                  </>
                ) : (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(r.dateTime).format('YYYY-MM-DD HH:mm')}
                  </Text>
                )}
              </div>
            </div>
            <Space size="small">
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  completeReminder(r.id);
                }}
              />
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditReminder(r);
                  onClose();
                }}
              />
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteReminder(r.id);
                }}
              />
            </Space>
          </ListItem>
        ))}
      </ListCard>
    </div>
  );
};

export default NotificationList;
