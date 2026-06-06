import dayjs, { type Dayjs } from "dayjs";
import type { CalendarReminder } from "./types";

export const COLOR_OPTIONS = [
	{ label: "红色", value: "#ff4d4f" },
	{ label: "橙色", value: "#fa8c16" },
	{ label: "金色", value: "#faad14" },
	{ label: "绿色", value: "#52c41a" },
	{ label: "青色", value: "#13c2c2" },
	{ label: "蓝色", value: "#1677ff" },
	{ label: "紫色", value: "#722ed1" },
	{ label: "粉色", value: "#eb2f96" },
];

export const DEFAULT_REMINDER_COLOR = "#1677ff";

export const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export const buildCalendarDays = (month: Dayjs): Dayjs[] => {
	const startOfMonth = month.startOf("month");
	const startDay = startOfMonth.day();
	const daysInMonth = month.daysInMonth();
	const days: Dayjs[] = [];

	for (let i = startDay - 1; i >= 0; i--) {
		days.push(startOfMonth.subtract(i + 1, "day"));
	}
	for (let i = 0; i < daysInMonth; i++) {
		days.push(startOfMonth.add(i, "day"));
	}
	const remaining = 42 - days.length;
	for (let i = 0; i < remaining; i++) {
		days.push(startOfMonth.add(daysInMonth + i, "day"));
	}

	return days;
};

export const isToday = (date: Dayjs): boolean =>
	date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

export const isOtherMonth = (date: Dayjs, currentMonth: Dayjs): boolean =>
	date.month() !== currentMonth.month() || date.year() !== currentMonth.year();

export const isOverdue = (reminder: CalendarReminder): boolean =>
	!reminder.completed && dayjs(reminder.dateTime).isBefore(dayjs());
