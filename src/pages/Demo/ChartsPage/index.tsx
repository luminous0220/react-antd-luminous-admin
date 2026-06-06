import { useMemo, useState, useEffect } from "react";
import { Row, Col } from "antd";
import * as echarts from "echarts";
import { Chart } from "@/components/Chart";

const MONTHS = [
	"1月",
	"2月",
	"3月",
	"4月",
	"5月",
	"6月",
	"7月",
	"8月",
	"9月",
	"10月",
	"11月",
	"12月",
];

const DAYS_7 = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const HOURS_6 = Array.from({ length: 6 }, (_, i) => `${i * 4}:00`);

const COLORS = {
	blue: "#5470C6",
	green: "#91CC75",
	orange: "#FAC858",
	red: "#EE6666",
	purple: "#9A60B4",
	cyan: "#73C0DE",
};

function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ChartsPage: React.FC = () => {
	// ======== Mock Data ========

	const barData = useMemo(() => MONTHS.map(() => rand(100, 800)), []);

	const multiBarData = useMemo(
		() => ({
			beijing: MONTHS.map(() => rand(200, 600)),
			shanghai: MONTHS.map(() => rand(150, 500)),
			guangzhou: MONTHS.map(() => rand(100, 400)),
		}),
		[],
	);

	const mixLineData = useMemo(
		() => ({
			sales: MONTHS.map(() => rand(200, 700)),
			rate: MONTHS.map(() => rand(5, 25)),
		}),
		[],
	);

	const lineData = useMemo(() => MONTHS.map(() => rand(100, 500)), []);

	const multiLineData = useMemo(
		() => ({
			newUsers: MONTHS.map(() => rand(200, 800)),
			active: MONTHS.map(() => rand(300, 900)),
			paid: MONTHS.map(() => rand(50, 300)),
		}),
		[],
	);

	const hBarData = useMemo(
		() =>
			[
				"云服务器",
				"数据库",
				"CDN",
				"对象存储",
				"消息队列",
				"函数计算",
				"API网关",
				"容器服务",
			]
				.map((name) => ({ name, value: rand(300, 1200) }))
				.sort((a, b) => b.value - a.value),
		[],
	);

	const multiHBarData = useMemo(
		() =>
			["电商", "社交", "视频", "游戏", "金融", "教育"].map((name) => ({
				name,
				q1: rand(200, 800),
				q2: rand(250, 900),
			})),
		[],
	);

	const donutData = useMemo(
		() => [
			{ name: "搜索引擎", value: rand(300, 500) },
			{ name: "社交媒体", value: rand(200, 400) },
			{ name: "直接访问", value: rand(150, 350) },
			{ name: "邮件营销", value: rand(100, 250) },
			{ name: "广告推广", value: rand(80, 200) },
		],
		[],
	);

	const pieData = useMemo(
		() => [
			{ name: "iOS", value: rand(300, 500) },
			{ name: "Android", value: rand(400, 600) },
			{ name: "Web", value: rand(200, 350) },
			{ name: "小程序", value: rand(100, 250) },
			{ name: "桌面端", value: rand(50, 150) },
		],
		[],
	);

	const scatterData = useMemo(
		() =>
			Array.from({ length: 50 }, () => [rand(10, 200), rand(50, 5000)]) as [
				number,
				number,
			][],
		[],
	);

	const radarData = useMemo(
		() => ({
			indicators: [
				{ name: "技术能力", max: 100 },
				{ name: "设计能力", max: 100 },
				{ name: "产品思维", max: 100 },
				{ name: "运营能力", max: 100 },
				{ name: "市场洞察", max: 100 },
				{ name: "管理能力", max: 100 },
			],
			self: [85, 72, 68, 60, 55, 78],
			team: [75, 80, 72, 65, 70, 68],
		}),
		[],
	);

	const candlestickData = useMemo(
		() =>
			Array.from({ length: 30 }, () => {
				const open = rand(50, 100);
				const close = rand(50, 100);
				const low = Math.min(open, close) - rand(5, 15);
				const high = Math.max(open, close) + rand(5, 15);
				return [open, close, low, high] as [number, number, number, number];
			}),
		[],
	);

	const funnelData = useMemo(
		() =>
			[
				// { name: "访问", value: rand(1000, 2000) },
				{ name: "注册", value: rand(2400, 3500) },
				{ name: "激活", value: rand(1200, 2600) },
				{ name: "付费", value: rand(600, 1800) },
				{ name: "复购", value: rand(300, 800) },
			].map((d, i, arr) => ({
				...d,
				value: i === 0 ? d.value : Math.min(d.value, arr[i - 1].value),
			})),
		[],
	);

	const gaugeValue = useMemo(() => rand(60, 95), []);

	const heatmapData = useMemo(
		() =>
			HOURS_6.flatMap((_, h) =>
				DAYS_7.map((_, d) => [d, h, rand(10, 100)] as [number, number, number]),
			),
		[],
	);

	// 动态排序柱状图：定时刷新数据
	const RANK_LABELS = [
		"云服务器", "数据库", "CDN", "对象存储",
		"消息队列", "函数计算", "API网关", "容器服务",
	];
	const [rankData, setRankData] = useState(() =>
		RANK_LABELS.map((name) => ({ name, value: rand(300, 1200) })).sort(
			(a, b) => b.value - a.value,
		),
	);

	useEffect(() => {
		const timer = setInterval(() => {
			setRankData(
				RANK_LABELS.map((name) => ({ name, value: rand(300, 1200) })).sort(
					(a, b) => b.value - a.value,
				),
			);
		}, 2000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="space-y-4">
			{/* ===== 柱状图 ===== */}
			<h2 className="text-lg font-bold px-1">柱状图</h2>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="单条柱状图"
						option={{
							xAxis: { type: "category", data: MONTHS },
							series: [
								{
									type: "bar",
									data: barData,
									barWidth: "60%",
									itemStyle: {
										borderRadius: [8, 8, 0, 0],
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: "#FFF6DE" },
											{ offset: 1, color: "#F48F68" },
										]),
									},
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="多组柱状图"
						option={{
							xAxis: { type: "category", data: MONTHS },
							legend: { data: ["北京", "上海", "广州"], bottom: 0 },
							series: [
								{
									name: "北京",
									type: "bar",
									data: multiBarData.beijing,
									itemStyle: {
										borderRadius: [8, 8, 0, 0],
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: "#8BDFDD" },
											{ offset: 1, color: "#59B292" },
										]),
									},
								},
								{
									name: "上海",
									type: "bar",
									data: multiBarData.shanghai,
									itemStyle: {
										borderRadius: [8, 8, 0, 0],
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: "#59B292" },
											{ offset: 1, color: "#F48F68" },
										]),
									},
								},
								{
									name: "广州",
									type: "bar",
									data: multiBarData.guangzhou,
									itemStyle: {
										borderRadius: [8, 8, 0, 0],
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: "#F48F68" },
											{ offset: 1, color: "#FFE394" },
										]),
									},
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={24}>
					<Chart
						type="card"
						title="混合柱线图"
						option={{
							xAxis: { type: "category", data: MONTHS },
							yAxis: [
								{ type: "value", name: "万元" },
								{ type: "value", name: "%" },
							],
							legend: { data: ["销售额", "增长率"], bottom: 0 },
							series: [
								{
									name: "销售额",
									type: "bar",
									data: mixLineData.sales,
									barWidth: "50%",
									itemStyle: {
										borderRadius: [4, 4, 0, 0],
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: "#FFC94D" },
											{ offset: 1, color: "#FAE7CB" },
										]),
									},
								},
								{
									name: "增长率",
									type: "line",
									yAxisIndex: 1,
									data: mixLineData.rate,
									smooth: true,
									symbol: "circle",
									symbolSize: 6,
									lineStyle: { color: COLORS.red, width: 2 },
									itemStyle: { color: COLORS.red },
								},
							],
						}}
					/>
				</Col>
			</Row>

			{/* ===== 折线图 ===== */}
			<h2 className="text-lg font-bold px-1 mt-2">折线图</h2>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="普通折线图"
						option={{
							xAxis: { type: "category", data: MONTHS },
							series: [
								{
									type: "line",
									data: lineData,
									smooth: true,
									symbol: "circle",
									symbolSize: 4,
									lineStyle: { color: COLORS.blue, width: 2 },
									itemStyle: { color: COLORS.blue },
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="渐变填充折线图"
						option={{
							xAxis: { type: "category", data: MONTHS },
							series: [
								{
									type: "line",
									data: lineData,
									smooth: true,
									symbol: "none",
									lineStyle: { color: COLORS.green, width: 2 },
									areaStyle: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: COLORS.green + "60" },
											{ offset: 1, color: COLORS.green + "05" },
										]),
									},
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={24}>
					<Chart
						type="card"
						title="多组渐变折线图"
						option={{
							xAxis: { type: "category", data: MONTHS },
							legend: { data: ["新增用户", "活跃用户", "付费用户"], bottom: 0 },
							series: [
								{
									name: "新增用户",
									type: "line",
									data: multiLineData.newUsers,
									smooth: true,
									symbol: "none",
									lineStyle: { color: COLORS.blue, width: 2 },
									areaStyle: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: COLORS.blue + "40" },
											{ offset: 1, color: COLORS.blue + "03" },
										]),
									},
								},
								{
									name: "活跃用户",
									type: "line",
									data: multiLineData.active,
									smooth: true,
									symbol: "none",
									lineStyle: { color: COLORS.green, width: 2 },
									areaStyle: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: COLORS.green + "40" },
											{ offset: 1, color: COLORS.green + "03" },
										]),
									},
								},
								{
									name: "付费用户",
									type: "line",
									data: multiLineData.paid,
									smooth: true,
									symbol: "none",
									lineStyle: { color: COLORS.purple, width: 2 },
									areaStyle: {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: COLORS.purple + "40" },
											{ offset: 1, color: COLORS.purple + "03" },
										]),
									},
								},
							],
						}}
					/>
				</Col>
			</Row>

			{/* ===== 水平柱状图 ===== */}
			<h2 className="text-lg font-bold px-1 mt-2">水平柱状图</h2>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="单条水平柱状图"
						option={{
							xAxis: { type: "value" },
							yAxis: {
								type: "category",
								data: hBarData.map((d) => d.name),
								inverse: true,
							},
							series: [
								{
									type: "bar",
									data: hBarData.map((d) => ({
										value: d.value,
										itemStyle: {
											borderRadius: [0, 6, 6, 0],
											color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
												{ offset: 0, color: "#F48F68" },
												{ offset: 1, color: "#FFF6DE" },
											]),
										},
									})),
									barWidth: "60%",
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="多组水平柱状图"
						option={{
							xAxis: { type: "value" },
							yAxis: {
								type: "category",
								data: multiHBarData.map((d) => d.name),
								inverse: true,
							},
							legend: { data: ["Q1", "Q2"], bottom: 0 },
							series: [
								{
									name: "Q1",
									type: "bar",
									data: multiHBarData.map((d) => d.q1),
									barWidth: "40%",
									itemStyle: {
										borderRadius: [0, 6, 6, 0],
										color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
											{ offset: 0, color: COLORS.blue },
											{ offset: 1, color: COLORS.blue + "40" },
										]),
									},
								},
								{
									name: "Q2",
									type: "bar",
									data: multiHBarData.map((d) => d.q2),
									barWidth: "40%",
									itemStyle: {
										borderRadius: [0, 6, 6, 0],
										color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
											{ offset: 0, color: COLORS.orange },
											{ offset: 1, color: COLORS.orange + "40" },
										]),
									},
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={24}>
					<Chart
						type="card"
						title="动态排序柱状图（每2秒刷新）"
						option={{
							animationDuration: 800,
							animationDurationUpdate: 600,
							xAxis: { type: "value" },
							yAxis: {
								type: "category",
								data: rankData.map((d) => d.name),
								inverse: true,
							},
								series: [
									{
										type: "bar",
										data: rankData.map((d) => ({
											value: d.value,
											itemStyle: {
												borderRadius: [0, 6, 6, 0],
												color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
													{ offset: 0, color: "#FA6781" },
													{ offset: 1, color: "#FA6781" + "30" },
												]),
											},
										})),
										barWidth: "60%",
										realtimeSort: true,
									},
								],
							}}
						/>
					</Col>
				</Row>

			{/* ===== 环形图 & 饼图 ===== */}
			<h2 className="text-lg font-bold px-1 mt-2">环形图 & 饼图</h2>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="普通环形图"
						option={{
							tooltip: { trigger: "item" },
							series: [
								{
									type: "pie",
									radius: ["50%", "75%"],
									center: ["50%", "50%"],
									data: donutData,
									label: { show: true, formatter: "{b}\n{d}%" },
									itemStyle: {
										borderRadius: 4,
										borderColor: "#fff",
										borderWidth: 2,
									},
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="带 Legend 环形图"
						option={{
							tooltip: { trigger: "item" },
							legend: { bottom: 0 },
							series: [
								{
									type: "pie",
									radius: ["45%", "75%"],
									center: ["50%", "45%"],
									data: donutData,
									label: {
										show: true,
										formatter: "{b}\n{d}%",
										fontSize: 10,
									},
									emphasis: {
										label: { fontSize: 14, fontWeight: "bold" },
									},
									itemStyle: {
										borderRadius: 4,
										borderColor: "#fff",
										borderWidth: 2,
									},
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={24}>
					<Chart
						type="card"
						title="玫瑰饼图"
						option={{
							tooltip: { trigger: "item" },
							series: [
								{
									type: "pie",
									radius: [20, "75%"],
									center: ["50%", "50%"],
									roseType: "area",
									data: pieData,
									label: { show: true, formatter: "{b}\n{d}%" },
									itemStyle: {
										borderRadius: 4,
										borderColor: "#fff",
										borderWidth: 2,
									},
								},
							],
						}}
					/>
				</Col>
			</Row>

			{/* ===== 散点图、雷达图、K线图 ===== */}
			<h2 className="text-lg font-bold px-1 mt-2">散点图 / 雷达图 / K线图</h2>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="散点图"
						option={{
							tooltip: {
								trigger: "item",
								formatter: (p: any) =>
									`访问 ${p.value[0]} 次<br/>消费 ¥${p.value[1]}`,
							},
							xAxis: { type: "value", name: "访问次数" },
							yAxis: { type: "value", name: "消费金额(元)" },
							series: [
								{
									type: "scatter",
									data: scatterData,
									symbolSize: 8,
									itemStyle: {
										color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
											{ offset: 0, color: COLORS.blue },
											{ offset: 1, color: COLORS.blue + "30" },
										]),
									},
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="雷达图"
						option={{
							tooltip: { trigger: "item" },
							legend: {
								data: ["个人", "团队平均"],
								bottom: 0,
							},
							radar: {
								indicator: radarData.indicators,
								center: ["50%", "45%"],
								radius: "65%",
							},
							series: [
								{
									name: "个人",
									type: "radar",
									data: [{ value: radarData.self }],
									areaStyle: { color: COLORS.blue + "25" },
									lineStyle: { color: COLORS.blue },
									itemStyle: { color: COLORS.blue },
									symbol: "circle",
									symbolSize: 4,
								},
								{
									name: "团队平均",
									type: "radar",
									data: [{ value: radarData.team }],
									areaStyle: { color: COLORS.orange + "20" },
									lineStyle: { color: COLORS.orange, type: "dashed" },
									itemStyle: { color: COLORS.orange },
									symbol: "circle",
									symbolSize: 4,
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={24}>
					<Chart
						type="card"
						title="K线图"
						option={{
							xAxis: {
								type: "category",
								data: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
							},
							yAxis: { type: "value", scale: true },
							series: [
								{
									type: "candlestick",
									data: candlestickData,
									itemStyle: {
										color: COLORS.red,
										color0: COLORS.green,
										borderColor: COLORS.red,
										borderColor0: COLORS.green,
									},
								},
							],
						}}
					/>
				</Col>
			</Row>

			{/* ===== 漏斗图、仪表盘、热力图 ===== */}
			<h2 className="text-lg font-bold px-1 mt-2">漏斗图 / 仪表盘 / 热力图</h2>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="漏斗图"
						height={350}
						option={{
							tooltip: { trigger: "item" },
							series: [
								{
									type: "funnel",
									left: "15%",
									width: "70%",
									sort: "descending",
									gap: 4,
									data: funnelData.sort((a, b) => b.value - a.value),
									label: {
										show: true,
										position: "inside",
										formatter: "{b}\n{c}",
									},
									itemStyle: { borderColor: "#fff", borderWidth: 2 },
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={12}>
					<Chart
						type="card"
						title="仪表盘"
						height={350}
						option={{
							tooltip: { show: false },
							series: [
								{
									type: "gauge",
									startAngle: 210,
									endAngle: -30,
									center: ["50%", "55%"],
									radius: "85%",
									min: 0,
									max: 100,
									axisLine: {
										lineStyle: {
											width: 20,
											color: [
												[0.3, COLORS.green],
												[0.7, COLORS.orange],
												[1, COLORS.red],
											],
										},
									},
									pointer: {
										length: "60%",
										width: 8,
										itemStyle: { color: "auto" },
									},
									detail: {
										valueAnimation: true,
										formatter: "{value}%",
										fontSize: 28,
										offsetCenter: [0, "55%"],
									},
									data: [{ value: gaugeValue }],
								},
							],
						}}
					/>
				</Col>
				<Col xs={24} lg={24}>
					<Chart
						type="card"
						title="热力图 (24h × 7day)"
						height={420}
						option={{
							tooltip: {
								trigger: "item",
								formatter: (p: any) =>
									`${DAYS_7[p.value[0]]} ${HOURS_6[p.value[1]]}<br/>活跃: ${p.value[2]}`,
							},
							grid: {
								left: "5%",
								right: "10%",
								bottom: "5%",
								top: "5%",
								containLabel: true,
							},
							xAxis: {
								type: "category",
								data: DAYS_7,
								splitArea: { show: true },
								axisLine: {
									show: false,
								},
							},
							yAxis: {
								type: "category",
								data: HOURS_6,
								splitArea: { show: true },
								axisLine: {
									show: false,
								},
							},
							visualMap: {
								min: 10,
								max: 100,
								calculable: true,
								orient: "vertical",
								right: 0,
								top: "center",
								inRange: { color: ["#f0f5ff", COLORS.blue, COLORS.purple] },
							},
							series: [
								{
									type: "heatmap",
									data: heatmapData,
									label: { show: false },
									itemStyle: {
										borderRadius: 16,
									},
									emphasis: {
										itemStyle: {
											shadowBlur: 10,
											shadowColor: "rgba(0,0,0,0.5)",
										},
									},
								},
							],
						}}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default ChartsPage;
