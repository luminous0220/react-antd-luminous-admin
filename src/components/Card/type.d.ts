export interface ListCardProps {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export interface MediaCardProps {
  cover?: string;
  avatar?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode[];
}

export interface ListItemProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  children?: React.ReactNode;
}

export interface TodoItem {
	icon: React.ReactNode;
	title: string;
	status: string;
	time: string;
	iconBgColor?: string;
}

export interface ActivityItem {
	icon: React.ReactNode;
	title: string;
	description: string;
	iconBgColor?: string;
}

export interface TransactionItem {
	color: string;
	time: string;
	description: string;
	highlightText?: string;
}

export interface TodoCardProps {
	title: string;
	subtitle?: string;
	items: TodoItem[];
}

export interface ActivityCardProps {
	title: string;
	subtitle?: string;
	items: ActivityItem[];
	onViewMore?: () => void;
}

export interface TransactionCardProps {
	title: string;
	subtitle?: string;
	items: TransactionItem[];
}

export interface DataCardProps {
	todoTitle: string;
	todoSubtitle?: string;
	todoItems: TodoItem[];
	activityTitle: string;
	activitySubtitle?: string;
	activityItems: ActivityItem[];
	onViewMore?: () => void;
	transactionTitle: string;
	transactionSubtitle?: string;
	transactionItems: TransactionItem[];
}

export interface ProgressCardProps {
	title: string;
	percent: number;
	subtitle?: React.ReactNode;
	strokeColor?: string;
}

export interface NormalCardProps {
	icon: React.ReactNode;
	title: React.ReactNode;
	subtitle: React.ReactNode;
	iconBgColor?: string;
}

export interface StatCardColors {
	primary: string;
	textSecondary?: string;
}

export type SparklineType = "line" | "bar" | "progress";

export interface StatCardData {
	id: string;
	title: string;
	value: number;
	prefix?: string;
	suffix?: string;
	tooltip: string;
	sparklineType: SparklineType;
	sparklineData: number[];
	sparklineColor?: string;
}

export interface StatCardProps {
	data: StatCardData;
	colors: StatCardColors;
}
