import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "antd";
import type { ChartProps } from "./type.d";
import { useChartColors } from "@/hooks/useChartColors";
import { mergeOptions } from "./utils";

export const Chart: React.FC<ChartProps> = ({
	type = "chart",
	title,
	extra,
	option,
	height = 300,
	loading = false,
	onReady,
}) => {
	const colors = useChartColors();

	const mergedOption = useMemo(
		() => mergeOptions(option, colors),
		[option, colors],
	);

	const chartElement = (
		<ReactECharts
			option={mergedOption}
			notMerge={true}
			lazyUpdate={true}
			autoResize={true}
			showLoading={loading}
			onChartReady={onReady}
			style={{ height, width: "100%" }}
		/>
	);

	if (type === "card") {
		return (
			<Card title={title} extra={extra} styles={{ body: { padding: "16px" } }}>
				{chartElement}
			</Card>
		);
	}

	return chartElement;
};

export * from "./utils.ts";
export type { ChartProps, ChartColorSet, ChartType } from "./type.d";
