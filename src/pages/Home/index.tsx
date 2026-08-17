import { Row, Col } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import * as echarts from "echarts";
import { Api } from "@/apis";
import { useChartColors } from "@/hooks/useChartColors";
import { StatCard } from "@/components/Card";
import { Chart } from "@/components/Chart";
import DeepAnalysis from "./components/DeepAnalysis";

const Home: React.FC = () => {
	const colors = useChartColors();

	const { data: dashboard } = useQuery({
		queryKey: ["homeDashboard"],
		queryFn: () => Api.getHomeDashboard(),
	});

	const statCards = dashboard?.statCards ?? [];
	const horizontalBarData = useMemo(
		() => dashboard?.horizontalBar ?? [],
		[dashboard],
	);
	const donutData = useMemo(() => dashboard?.donut ?? [], [dashboard]);
	const lineData = useMemo(() => dashboard?.lineData ?? [], [dashboard]);

	const horizontalBarOption = useMemo(
		() => ({
			tooltip: { trigger: "axis" as const },
			grid: { top: 10, bottom: 10, left: 10, right: 30 },
			xAxis: {
				type: "value" as const,
				axisLabel: {
					color: colors.textSecondary,
					fontSize: 11,
					formatter: (v: number) =>
						v >= 10000 ? `${(v / 10000).toFixed(1)}万` : String(v),
				},
				splitLine: { lineStyle: { color: colors.borderLight } },
			},
			yAxis: {
				type: "category" as const,
				data: horizontalBarData.map((d) => d.name),
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: colors.textPrimary, fontSize: 12 },
			},
			series: [
				{
					type: "bar" as const,
					data: horizontalBarData.map((d) => ({
						value: d.value,
						itemStyle: {
							borderRadius: [0, 4, 4, 0],
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{ offset: 0, color: colors.primary },
								{ offset: 1, color: colors.primaryLight },
							]),
						},
					})),
					barWidth: "50%",
				},
			],
		}),
		[horizontalBarData, colors],
	);

	const donutOption = useMemo(() => {
		const total = donutData.reduce((sum, item) => sum + item.value, 0);

		const colorsList = [
			"#FFF6DE",
			"#8BDFDD",
			"#F48F68",
			"#FFE394",
			"#59B292",
			"#FFC94D",
			"#FAE7CB",
			"#FA6781",
		];

		const dataWithColor = donutData.map((item, index) => ({
			...item,
			itemStyle: {
				color: colorsList[index] ?? colorsList[0], // fallback to first if out of range
			},
		}));

		return {
			tooltip: {
				trigger: "item" as const,
				formatter: (params: any) => {
					const percent = ((params.value / total) * 100).toFixed(1);
					return `${params.name}<br/>${params.value} (${percent}%)`;
				},
			},
			legend: {
				bottom: 0,
				textStyle: { color: colors.textSecondary, fontSize: 11 },
				itemWidth: 10,
				itemHeight: 10,
				itemGap: 12,
			},
			series: [
				{
					type: "pie" as const,
					radius: ["40%", "80%"],
					center: ["50%", "45%"],
					data: dataWithColor,
					label: {
						show: true,
						position: "outside" as const,
						fontSize: 10,
						color: colors.textPrimary,
						formatter: (params: any) => {
							const percent = ((params.value / total) * 100).toFixed(1);
							return `{name|${params.name}}\n{percent|${percent}%}`;
						},
						rich: {
							name: { color: colors.textPrimary, fontSize: 10, lineHeight: 16 },
							percent: {
								color: colors.textSecondary,
								fontSize: 9,
								fontWeight: "bold" as const,
							},
						},
					},
					labelLine: {
						show: true,
						length: 10,
						length2: 8,
						smooth: true,
						lineStyle: { width: 1, color: colors.textSecondary },
					},
					emphasis: {
						scale: true,
						label: {
							show: true,
							fontSize: 12,
							fontWeight: "bold" as const,
							color: colors.textPrimary,
						},
					},
					avoidLabelOverlap: true,
				},
			],
		};
	}, [donutData, colors]);

	const areaLineOption = useMemo(
		() => ({
			tooltip: {
				trigger: "axis" as const,
				backgroundColor: "transparent",
				formatter: (params: any) => {
					const p = params[0];
					return `<div style="color:${colors.textPrimary}">${p.axisValue}<br/>¥${p.data.value.toLocaleString()}</div>`;
				},
			},
			grid: { top: 20, bottom: 20, left: 20, right: 20 },
			xAxis: {
				type: "category" as const,
				data: lineData.map((d) => d.time),
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: colors.textSecondary, fontSize: 10 },
			},
			yAxis: {
				type: "value" as const,
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: colors.textSecondary, fontSize: 10 },
				splitLine: { lineStyle: { color: colors.borderLight } },
			},
			series: [
				{
					type: "line" as const,
					data: lineData.map((d) => d.value),
					smooth: true,
					symbol: "none",
					lineStyle: { color: colors.primary, width: 2 },
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: colors.primary + "60" },
							{ offset: 1, color: colors.primary + "10" },
						]),
					},
				},
			],
		}),
		[lineData, colors],
	);

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-2xl  bg-gradient-to-r from-[#E6F0FF] to-[#f8fafe] shadow-soft dark:from-[rgb(37,119,245,0.3)] dark:to-[rgb(37,119,245,0.1)]">
				<div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="text-lg font-semibold text-[#1f2a44] dark:text-white">
							欢迎回来，超级管理员 👋
						</h2>
						<p className="mt-1 text-sm text-[#7c8aa5]">
							今天又是充满效率的一天，祝你工作顺利。
						</p>
					</div>
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-soft">
						🐼
					</div>
				</div>
			</div>
			<Row gutter={[16, 16]}>
				{statCards.map((item) => (
					<Col xs={24} sm={12} md={8} lg={6} key={item.id}>
						<StatCard data={item} colors={colors} />
					</Col>
				))}
			</Row>

			<DeepAnalysis colors={colors} />

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Chart type="card" title="分类销售额" option={horizontalBarOption} />
				</Col>
				<Col xs={24} lg={12}>
					<Chart type="card" title="流量来源占比" option={donutOption} />
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={24}>
					<Chart
						type="card"
						title="实时销售额趋势"
						option={areaLineOption}
						height={280}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default Home;
