import React, { useRef, useCallback, useMemo } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Dropdown, Tag } from "antd";
import type { MenuProps } from "antd";
import {
	BellOutlined,
	EditOutlined,
	CheckOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import { isToday, isOtherMonth, isOverdue } from "../utils";
import type { CalendarReminder } from "../types.d";

interface CalendarCellProps {
	date: Dayjs;
	currentMonth: Dayjs;
	colorPrimary: string;
	reminders: CalendarReminder[];
	onAddReminder: (dateStr: string) => void;
	onEditReminder: (reminder: CalendarReminder) => void;
	onCompleteReminder: (id: string) => void;
	onDeleteReminder: (id: string) => void;
}

const reminderMenuItems: MenuProps["items"] = [
	{
		key: "edit",
		label: "编辑",
		icon: <EditOutlined />,
	},
	{
		key: "complete",
		label: "完成",
		icon: <CheckOutlined />,
	},
	{
		key: "delete",
		label: "删除",
		icon: <DeleteOutlined />,
		danger: true,
	},
];

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(
	({
		date,
		currentMonth,
		colorPrimary,
		reminders,
		onAddReminder,
		onEditReminder,
		onCompleteReminder,
		onDeleteReminder,
	}) => {
		const today = isToday(date);
		const otherMonth = isOtherMonth(date, currentMonth);
		const dateStr = date.format("YYYY-MM-DD");
		const isPast = date.isBefore(dayjs(), "day");
		const skipClickRef = useRef(false);

		const handleCellClick = useCallback(() => {
			if (skipClickRef.current) {
				skipClickRef.current = false;
				return;
			}
			if (isPast) {
				window.$message.info("不能选择过去时间");
				return;
			}
			onAddReminder(dateStr);
		}, [isPast, dateStr, onAddReminder]);

		const handleReminderMenuClick = useCallback(
			(r: CalendarReminder) =>
				({ key }: { key: string }) => {
					skipClickRef.current = true;
					if (key === "edit") onEditReminder(r);
					else if (key === "complete") onCompleteReminder(r.id);
					else if (key === "delete") onDeleteReminder(r.id);
				},
			[onEditReminder, onCompleteReminder, onDeleteReminder],
		);

		const cellMenuItems: MenuProps["items"] = useMemo(() => {
			if (isPast) return [];
			return [
				{
					key: "add",
					label: "新增提醒",
					icon: <BellOutlined />,
				},
			];
		}, [isPast]);

		return (
			<Dropdown
				menu={{ items: cellMenuItems, onClick: () => onAddReminder(dateStr) }}
				trigger={["contextMenu"]}
			>
				<div
					data-date={dateStr}
					className="calendar-day-cell"
					style={
						{
							borderTop: "1px solid var(--ant-color-border)",
							borderLeft: "1px solid var(--ant-color-border)",
							"--cell-hover-border": colorPrimary,
						} as React.CSSProperties
					}
					onClick={handleCellClick}
				>
					<div
						className="calendar-day-number"
						style={{
							fontWeight: today ? 600 : 400,
							color: otherMonth
								? "var(--ant-color-text-quaternary)"
								: today
									? "#fff"
									: "var(--ant-color-text)",
							background: today ? colorPrimary : "transparent",
						}}
					>
						{date.date()}
					</div>

					<div className="calendar-reminders-container">
						{reminders.map((r, i) => (
							<Dropdown
								key={r.id}
								menu={{
									items: reminderMenuItems,
									onClick: handleReminderMenuClick(r),
								}}
								trigger={["contextMenu"]}
							>
								<Tag
									key={i + 1}
									color={r.color}
									variant="outlined"
									className={`calendar-reminder-item${r.completed ? " completed" : ""}${isOverdue(r) ? " overdue" : ""}`}
									onContextMenu={(e) => e.stopPropagation()}
									onClick={(e) => {
										e.stopPropagation();
										onEditReminder(r);
									}}
									onDoubleClick={(e) => {
										e.stopPropagation();
										onEditReminder(r);
									}}
								>
									{i + 1}. {r.title}
								</Tag>
							</Dropdown>
						))}
					</div>
				</div>
			</Dropdown>
		);
	},
);
