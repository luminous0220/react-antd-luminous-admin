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

export interface AnalysisDataPoint {
  date: string;
  revenue: number;
  registeredUsers: number;
  payingUsers: number;
  conversionRate: number;
}

export type AnalysisTab = "revenue" | "userGrowth";

export type DateFilterPreset = "today" | "week" | "month" | "year";

export interface RankingItem {
  rank: number;
  label: string;
  value: number;
  secondaryValue?: number;
}
