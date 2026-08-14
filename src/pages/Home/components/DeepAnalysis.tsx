import { useState, useMemo } from "react";
import { Card, Row, Col, Segmented, Radio, DatePicker, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as echarts from "echarts";
import type { AnalysisTab, DateFilterPreset } from "../types.d";
import { Api } from "@/apis";
import { Chart, ChartColorSet } from "@/components/Chart";
import RankingList from "./RankingList";

const { RangePicker } = DatePicker;

interface DeepAnalysisProps {
	colors: ChartColorSet;
}

const DeepAnalysis: React.FC<DeepAnalysisProps> = ({ colors }) => {
	const [activeTab, setActiveTab] = useState<AnalysisTab>("revenue");
	const [preset, setPreset] = useState<DateFilterPreset>("week");
	const [customRange, setCustomRange] = useState<
		[dayjs.Dayjs, dayjs.Dayjs] | null
	>(null);

	const { data: analysis } = useQuery({
		queryKey: ["homeAnalysis", preset],
		queryFn: () => Api.getHomeAnalysis(preset),
	});

	const analysisData = useMemo(() => analysis?.analysisData ?? [], [analysis]);
	const rankingData = analysis?.rankingData ?? [];

	const revenueOption = useMemo(
		() => ({
			tooltip: {
				trigger: "axis" as const,
				backgroundColor: "#fff",
				formatter: (params: any) => {
					const p = params[0];
					return `<div style="color:${colors.textPrimary}">${p.axisValue}<br/>¥${p.data.toLocaleString()}</div>`;
				},
			},
			grid: { top: 20, bottom: 10, left: 10, right: 20 },
			xAxis: {
				type: "category" as const,
				data: analysisData.map((d) => d.date),
				axisLine: { lineStyle: { color: colors.border } },
				axisLabel: { color: colors.textSecondary, fontSize: 11 },
				axisTick: { show: false },
			},
			yAxis: {
				type: "value" as const,
				axisLabel: {
					color: colors.textSecondary,
					fontSize: 11,
					formatter: (v: number) =>
						v >= 10000 ? `${(v / 10000).toFixed(1)}万` : String(v),
				},
				splitLine: { show: false },
			},
			series: [
				{
					type: "bar" as const,
					data: analysisData.map((d) => d.revenue),
					barWidth: "60%",
					itemStyle: {
						borderRadius: [12, 12, 0, 0],
						// bg-gradient-to-t from-[#2577F5]/30 to-[#2577F5]/70 transition-all
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: "rgb(37 119 245 / 0.7)" },
							{ offset: 1, color: "rgb(37 119 245 / 0.3)" },
						]),
					},
				},
			],
		}),
		[analysisData, colors],
	);

	const userGrowthOption = useMemo(
		() => ({
			tooltip: { trigger: "axis" as const },
			legend: {
				data: ["注册用户", "付费用户", "转化率"],
				bottom: 0,
				textStyle: { color: colors.textSecondary, fontSize: 11 },
				itemWidth: 12,
				itemHeight: 8,
			},
			grid: { top: 20, bottom: 40, left: 10, right: 20 },
			xAxis: {
				type: "category" as const,
				data: analysisData.map((d) => d.date),
				axisLine: { lineStyle: { color: colors.border } },
				axisLabel: { color: colors.textSecondary, fontSize: 11 },
				axisTick: { show: false },
			},
			yAxis: [
				{
					type: "value" as const,
					name: "人数",
					nameTextStyle: { color: colors.textSecondary, fontSize: 11 },
					axisLabel: { color: colors.textSecondary, fontSize: 11 },
					splitLine: { show: false },
				},
				{
					type: "value" as const,
					name: "%",
					max: 100,
					axisLabel: { color: colors.textSecondary, fontSize: 11 },
					splitLine: { show: false },
				},
			],
			series: [
				{
					name: "注册用户",
					type: "bar" as const,
					data: analysisData.map((d) => d.registeredUsers),
					barWidth: "50%",
					itemStyle: {
						borderRadius: [4, 4, 0, 0],
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: colors.primary },
							{ offset: 1, color: colors.primaryLighter },
						]),
					},
				},
				{
					name: "付费用户",
					type: "bar" as const,
					data: analysisData.map((d) => d.payingUsers),
					barWidth: "50%",
					itemStyle: {
						borderRadius: [4, 4, 0, 0],
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: colors.accentOrange },
							{ offset: 1, color: colors.accentOrange + "40" },
						]),
					},
				},
				{
					name: "转化率",
					type: "line" as const,
					yAxisIndex: 1,
					data: analysisData.map((d) => d.conversionRate),
					smooth: true,
					symbol: "circle",
					symbolSize: 4,
					lineStyle: { color: colors.accentGreen, width: 2 },
					itemStyle: { color: colors.accentGreen },
				},
			],
		}),
		[analysisData, colors],
	);

	const chartOption =
		activeTab === "revenue" ? revenueOption : userGrowthOption;

	return (
		<Card>
			<Row
				justify="space-between"
				align="middle"
				className="mb-4"
				gutter={[16, 12]}
			>
				<Segmented<string>
					value={activeTab}
					onChange={(val) => setActiveTab(val as AnalysisTab)}
					options={[
						{ label: "收益分析", value: "revenue" },
						{ label: "用户增长", value: "userGrowth" },
					]}
				/>
				<Space wrap size={8}>
					<Radio.Group
						value={preset}
						optionType="button"
						buttonStyle="solid"
						onChange={(e) => {
							setPreset(e.target.value);
							setCustomRange(null);
						}}
					>
						<Radio.Button value="today">今日</Radio.Button>
						<Radio.Button value="week">本周</Radio.Button>
						<Radio.Button value="month">本月</Radio.Button>
						<Radio.Button value="year">本年</Radio.Button>
					</Radio.Group>
					<RangePicker
						value={customRange as any}
						onChange={(dates) => {
							if (dates?.length === 2) {
								setPreset("month");
							}
							setCustomRange(
								dates as unknown as [dayjs.Dayjs, dayjs.Dayjs] | null,
							);
						}}
					/>
				</Space>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={14}>
					<Chart option={chartOption} height={360} />
				</Col>
				<Col xs={24} lg={10}>
					<RankingList data={rankingData} mode={activeTab} colors={colors} />
				</Col>
			</Row>
		</Card>
	);
};

export default DeepAnalysis;
