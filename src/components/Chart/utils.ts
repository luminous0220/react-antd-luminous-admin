// src/components/Chart/utils.ts
import merge from "lodash/merge";
import type { EChartsOption } from "echarts";
import { ChartColorSet } from "./type";

export const CHART_COLORS = [
	"#FFF6DE",
	"#8BDFDD",
	"#F48F68",
	"#FFE394",
	"#59B292",
	"#FFC94D",
	"#FAE7CB",
	"#FA6781",
];

export function mergeOptions(
	userOption: EChartsOption,
	colors: ChartColorSet,
): EChartsOption {
	const enhanced: EChartsOption = { ...userOption };

	if (Array.isArray(enhanced.series)) {
		enhanced.series = enhanced.series.map((s: any, seriesIndex: number) => {
			const colorForSeries = CHART_COLORS[seriesIndex % CHART_COLORS.length];

			// 类型判断
			const isPieLike = s.type === "pie" || s.type === "funnel";
			const isCartesian = ["bar", "line", "scatter"].includes(s.type);

			// 1. 处理 pie/funnel：逐项设置 data[i].itemStyle.color
			if (isPieLike && Array.isArray(s.data)) {
				const dataWithColor = s.data.map((item: any, dataIndex: number) => {
					if (item && typeof item === "object" && !item.itemStyle?.color) {
						return {
							...item,
							itemStyle: {
								...item.itemStyle,
								borderRadius: 12,
								color: CHART_COLORS[dataIndex % CHART_COLORS.length],
							},
						};
					}
					return item;
				});
				return { ...s, data: dataWithColor };
			}

			// 2. 处理 bar/line/scatter：设置 series.color（整体颜色）
			// 注意：不要覆盖用户已设置的 color 或 itemStyle
			if (isCartesian && !s.color) {
				return { ...s, color: colorForSeries };
			}

			// 其他类型（如 gauge, radar 等）暂不处理
			return s;
		});
	}

	// 判断是否需要笛卡尔坐标轴
	const cartesianTypes = ["bar", "line", "scatter", "candlestick", "heatmap"];
	const needsAxes = Array.isArray(enhanced.series)
		? enhanced.series.some((s: any) => cartesianTypes.includes(s.type))
		: false;

	const defaults: EChartsOption = {
		tooltip: { trigger: "axis" },
		grid: { top: 20, bottom: 60, left: 10, right: 20 },
		...(needsAxes
			? {
					xAxis: {
						axisLine: { lineStyle: { color: colors.border } },
						axisLabel: { color: colors.textSecondary, fontSize: 11 },
						axisTick: { show: false },
					},
					yAxis: {
						axisLabel: { color: colors.textSecondary, fontSize: 11 },
						splitLine: { show: false },
					},
				}
			: {}),
	};

	return merge({}, defaults, enhanced);
}
