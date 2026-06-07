import type { ECharts } from "echarts";
import type { EChartsOption } from "echarts";

export interface ChartColorSet {
	primary: string;
	primaryLight: string;
	primaryLighter: string;
	primaryLightest: string;
	textPrimary: string;
	textSecondary: string;
	border: string;
	borderLight: string;
	accentGreen: string;
	accentOrange: string;
	accentRed: string;
	accentGold: string;
}

export type ChartType = "chart" | "card";

export interface ChartProps {
	type?: ChartType;
	title?: string;
	extra?: React.ReactNode;
	option: EChartsOption;
	height?: number;
	loading?: boolean;
	onReady?: (instance: ECharts) => void;
}
