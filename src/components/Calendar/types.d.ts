export interface CalendarReminder {
  id: string;
  title: string;
  note: string;
  dateTime: string;
  color: string;
  sort: number;
  completed: boolean;
  notified: boolean;
}
