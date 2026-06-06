import React, {
	useState,
	useCallback,
	useMemo,
	useEffect,
	useRef,
} from "react";
import dayjs, { type Dayjs } from "dayjs";
import {
	Card,
	DatePicker,
	Avatar,
	Badge,
	Popover,
	Button,
	ColorPicker,
} from "antd";
import type { FormInstance } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useCalendarStore } from "@/stores";
import { useAuthStore } from "@/stores";
import { useThemeStore } from "@/stores";
import { DEFAULT_REMINDER_COLOR, WEEKDAYS, COLOR_OPTIONS } from "./utils";
import { buildCalendarDays } from "./utils";
import type { CalendarReminder } from "./types";
import { ProForm } from "@/components/ProForm";
import type { ProFormInstance } from "@/components/ProForm";
import "./index.scss";
import { CalendarCell } from "./components/CalendarCell";
import NotificationList from "./components/NotificationList";

export const Calendar: React.FC = () => {
	const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
	const [formDate, setFormDate] = useState("");
	const [editingReminder, setEditingReminder] =
		useState<CalendarReminder | null>(null);
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [pendingEditId, setPendingEditId] = useState<string | null>(null);

	const calendarBodyRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<ProFormInstance>(null);
	const colorPrimary = useThemeStore((s) => s.colorPrimary);
	const userInfo = useAuthStore((s) => s.userInfo);

	const reminders = useCalendarStore((s) => s.reminders);
	const addReminder = useCalendarStore((s) => s.addReminder);
	const updateReminder = useCalendarStore((s) => s.updateReminder);
	const deleteReminder = useCalendarStore((s) => s.deleteReminder);
	const completeReminder = useCalendarStore((s) => s.completeReminder);

	// ── Calendar grid ──────────────────────────────────────────────

	const calendarDays = useMemo(
		() => buildCalendarDays(currentMonth),
		[currentMonth],
	);

	// ── Reminders by date map ──────────────────────────────────────

	const remindersByDate = useMemo(() => {
		const map = new Map<string, CalendarReminder[]>();
		for (const r of reminders) {
			const dateStr = r.dateTime.slice(0, 10);
			const list = map.get(dateStr);
			if (list) {
				list.push(r);
			} else {
				map.set(dateStr, [r]);
			}
		}
		for (const [, list] of map) {
			list.sort(
				(a, b) => a.sort - b.sort || a.dateTime.localeCompare(b.dateTime),
			);
		}
		return map;
	}, [reminders]);

	// ── Form open helpers ──────────────────────────────────────────

	const openAddForm = useCallback((dateStr: string) => {
		setFormDate(dateStr);
		setEditingReminder(null);
		const now = dayjs();
		formRef.current?.open({
			title: (
				<span>
					<span>新增提醒：</span>
					<span className="text-red-400">
						{dayjs(dateStr).format("YYYY年MM月DD日")}
					</span>
				</span>
			),
			initialValues: {
				title: "",
				note: "",
				dateTime: dayjs(dateStr).hour(now.hour()).minute(now.minute()),
				color: DEFAULT_REMINDER_COLOR,
				sort: reminders.length + 1,
			},
		});
	}, [reminders.length]);

	const openEditForm = useCallback((reminder: CalendarReminder) => {
		const dateStr = dayjs(reminder.dateTime).format("YYYY-MM-DD");
		setFormDate(dateStr);
		setEditingReminder(reminder);
		formRef.current?.open({
			title: (
				<span>
					<span>编辑提醒：</span>
					<span className="text-red-400">
						{dayjs(dateStr).format("YYYY年MM月DD日")}
					</span>
				</span>
			),
			initialValues: {
				title: reminder.title,
				note: reminder.note,
				dateTime: dayjs(reminder.dateTime),
				color: reminder.color,
				sort: reminder.sort ?? 1,
			},
		});
	}, []);

	const closeForm = useCallback(() => {
		formRef.current?.close();
		setEditingReminder(null);
	}, []);

	// ── Cell action callbacks ──────────────────────────────────────

	const handleEditReminder = useCallback(
		(reminder: CalendarReminder) => openEditForm(reminder),
		[openEditForm],
	);

	const handleCompleteReminder = useCallback(
		(id: string) => {
			completeReminder(id);
		},
		[completeReminder],
	);

	const handleDeleteReminder = useCallback(
		(id: string) => {
			deleteReminder(id);
		},
		[deleteReminder],
	);

	// ── Form submit ─────────────────────────────────────────────────

	const handleFormSubmit = useCallback(async () => {
		const values = await formRef.current?.validate();
		if (!values) return;
		const timeStr = values.dateTime as string;
		const [hours, minutes] = timeStr.split(":");
		const dateTimeStr = dayjs(formDate)
			.hour(Number(hours))
			.minute(Number(minutes))
			.toISOString();
		if (editingReminder) {
			updateReminder(editingReminder.id, {
				title: values.title as string,
				note: (values.note as string) || "",
				dateTime: dateTimeStr,
				color: values.color as string,
				sort: Number(values.sort),
			});
		} else {
			addReminder({
				title: values.title as string,
				note: (values.note as string) || "",
				dateTime: dateTimeStr,
				color: values.color as string,
			});
		}
		closeForm();
	}, [editingReminder, formDate, addReminder, updateReminder, closeForm]);

	const handleFormDelete = useCallback(() => {
		if (editingReminder) {
			deleteReminder(editingReminder.id);
		}
		closeForm();
	}, [editingReminder, deleteReminder, closeForm]);

	// ── Notification polling ──────────────────────────────────────

	useEffect(() => {
		const checkReminders = () => {
			const now = dayjs();
			const store = useCalendarStore.getState();
			store.reminders.forEach((r) => {
				if (!r.notified && !r.completed && dayjs(r.dateTime).isBefore(now)) {
					window.$notification?.warning?.({
						message: `提醒: ${r.title}`,
						description:
							r.note ||
							`到期时间: ${dayjs(r.dateTime).format("YYYY-MM-DD HH:mm")}`,
						duration: 86400,
					});
					store.updateReminder(r.id, { notified: true });
				}
			});
		};

		checkReminders();
		const timer = setInterval(checkReminders, 30000);
		return () => clearInterval(timer);
	}, []);

	// ── Notification center edit → navigate to date ───────────────

	const handleNotificationEdit = useCallback((reminder: CalendarReminder) => {
		const reminderMonth = dayjs(reminder.dateTime);
		setCurrentMonth(reminderMonth);
		setPendingEditId(reminder.id);
	}, []);

	useEffect(() => {
		if (!pendingEditId) return;
		const reminder = reminders.find((r) => r.id === pendingEditId);
		if (!reminder) {
			setPendingEditId(null);
			return;
		}
		const dateStr = dayjs(reminder.dateTime).format("YYYY-MM-DD");
		const raf = requestAnimationFrame(() => {
			setFormDate(dateStr);
			setEditingReminder(reminder);
			formRef.current?.open({
				title: (
					<span>
						<span>编辑提醒：</span>
						<span className="text-red-400">
							{dayjs(dateStr).format("YYYY年MM月DD日")}
						</span>
					</span>
				),
				initialValues: {
					title: reminder.title,
					note: reminder.note,
					dateTime: dayjs(reminder.dateTime),
					color: reminder.color,
					sort: reminder.sort ?? 1,
				},
			});
			setPendingEditId(null);
		});
		return () => cancelAnimationFrame(raf);
	}, [pendingEditId, currentMonth, reminders]);

	// ── Derived data ──────────────────────────────────────────────

	const allCount = reminders.length;

	const formFields = useMemo(() => {
		return [
			{
				name: "title",
				label: "标题",
				type: "input" as const,
				rules: [{ required: true, message: "请输入标题" }],
			},
			{
				name: "note",
				label: "备注",
				type: "textarea" as const,
				fieldProps: { rows: 2, placeholder: "备注（选填）" },
			},
			{
				name: "dateTime",
				label: "提醒时间",
				type: "time-picker" as const,
				rules: [{ required: true, message: "请选择时间" }],
				fieldProps: {
					format: "HH:mm",
					style: { width: "100%" },
				},
			},
			{
				name: "sort",
				label: "排序",
				type: "input-number" as const,
				rules: [{ required: true, message: "请输入序号" }],
				fieldProps: {
					min: 1,
					style: { width: "100%" },
				},
			},
			{
				name: "color",
				label: "颜色标识",
				rules: [{ required: true, message: "请选择颜色" }],
				render: (_value: unknown, form: FormInstance) => (
					<ColorPicker
						value={form.getFieldValue("color")}
						presets={[
							{
								label: "预设",
								colors: COLOR_OPTIONS.map((c) => c.value),
							},
						]}
						showText
						onChange={(_, hex) => form.setFieldValue("color", hex)}
					/>
				),
			},
		];
	}, []);

	// ── Render ────────────────────────────────────────────────────

	return (
		<Card>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<DatePicker
					picker="month"
					value={currentMonth}
					onChange={(v) => v && setCurrentMonth(v)}
					allowClear={false}
				/>
				<div className="flex items-center gap-3">
					<Avatar
						src={userInfo?.avatar}
						size="small"
						style={{
							backgroundColor: userInfo?.avatar ? undefined : colorPrimary,
						}}
					>
						{userInfo?.name?.charAt(0) || "U"}
					</Avatar>
					<Popover
						open={notificationOpen}
						onOpenChange={setNotificationOpen}
						trigger="click"
						placement="bottomRight"
						content={
							<NotificationList
								onEditReminder={handleNotificationEdit}
								onClose={() => setNotificationOpen(false)}
							/>
						}
					>
						<Badge count={allCount} overflowCount={999}>
							<Button
								shape="circle"
								icon={<BellOutlined style={{ fontSize: 16 }} />}
							/>
						</Badge>
					</Popover>
				</div>
			</div>

			{/* Weekday header */}
			<div className="grid grid-cols-7 border-b border-[var(--ant-color-border)]">
				{WEEKDAYS.map((day) => (
					<div key={day} className="calendar-weekday">
						{day}
					</div>
				))}
			</div>

			{/* Date grid */}
			<div
				ref={calendarBodyRef}
				className="grid grid-cols-7"
				style={{
					borderRight: "1px solid var(--ant-color-border)",
					borderBottom: "1px solid var(--ant-color-border)",
				}}
			>
				{calendarDays.map((date) => {
					const dateStr = date.format("YYYY-MM-DD");
					return (
						<CalendarCell
							key={dateStr}
							date={date}
							currentMonth={currentMonth}
							colorPrimary={colorPrimary}
							reminders={remindersByDate.get(dateStr) || []}
							onAddReminder={openAddForm}
							onEditReminder={handleEditReminder}
							onCompleteReminder={handleCompleteReminder}
							onDeleteReminder={handleDeleteReminder}
						/>
					);
				})}
			</div>

			{/* Form modal */}
			<ProForm
				ref={formRef}
				type="modal"
				fields={formFields}
				footer={null}
				destroyOnHidden
				onClose={closeForm}
				labelCol={{ span: 4 }}
				className="mt-4"
			>
				<div style={{ marginTop: 8, textAlign: "right" }}>
					{editingReminder && (
						<Button
							size="large"
							danger
							onClick={handleFormDelete}
							style={{ marginRight: 8 }}
						>
							删除
						</Button>
					)}
					<Button
						size="large"
						variant="solid"
						color={editingReminder ? "pink" : "primary"}
						onClick={handleFormSubmit}
					>
						{editingReminder ? "编辑" : "新增"}
					</Button>
				</div>
			</ProForm>
		</Card>
	);
};
