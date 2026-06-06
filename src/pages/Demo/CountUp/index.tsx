import { useState } from "react";
import {
	Row,
	Col,
	Card,
	Typography,
	Statistic,
	Button,
	Divider,
} from "antd";
import {
	ReloadOutlined,
	DollarOutlined,
	UserOutlined,
	EyeOutlined,
	ShoppingCartOutlined,
	ThunderboltOutlined,
	RocketOutlined,
	FireOutlined,
} from "@ant-design/icons";
import CountUp from "react-countup";
import { useThemeStore } from "@/stores";

const formatter =
	(opts: {
		duration?: number;
		separator?: string;
		useEasing?: boolean;
		delay?: number;
		decimals?: number;
		prefix?: string;
		suffix?: string;
	}) =>
	(value: string | number) => (
		<CountUp
			end={Number(value)}
			duration={opts.duration ?? 2}
			separator={opts.separator ?? ","}
			useEasing={opts.useEasing ?? true}
			delay={opts.delay}
			decimals={opts.decimals}
			prefix={opts.prefix}
			suffix={opts.suffix}
		/>
	);

const CountUpPage: React.FC = () => {
	const isDark = useThemeStore((s) => s.isDark);
	const [key, setKey] = useState(0);

	const handleReplay = () => setKey((k) => k + 1);

	return (
		<div key={key} className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="mb-4">
					<Typography.Title level={4} className="!mb-1">
						数字滚动动效
					</Typography.Title>
					<Typography.Text type="secondary">
						基于 Ant Design Statistic + react-countup，点击重播按钮查看动画效果
					</Typography.Text>
				</div>
				<Button type="primary" icon={<ReloadOutlined />} onClick={handleReplay}>
					重播动画
				</Button>
			</div>

			{/* 基础数字动效 */}
			<Typography.Title level={5}>基础数字动效</Typography.Title>
			<Row gutter={[16, 16]}>
				{[
					{
						title: "默认 (2s)",
						value: 56890,
						icon: <ShoppingCartOutlined />,
						color: "#1677ff",
					},
					{
						title: "快速 (0.8s)",
						value: 89234,
						icon: <ThunderboltOutlined />,
						color: "#52c41a",
						duration: 0.8,
					},
					{
						title: "慢速 (4s)",
						value: 34721,
						icon: <EyeOutlined />,
						color: "#fa8c16",
						duration: 4,
					},
					{
						title: "超慢 (6s)",
						value: 95218,
						icon: <RocketOutlined />,
						color: "#eb2f96",
						duration: 6,
					},
				].map((item, i) => (
					<Col xs={24} sm={12} lg={6} key={i}>
						<Card>
							<Statistic
								title={item.title}
								value={item.value}
								prefix={
									<span style={{ color: item.color, marginRight: 8 }}>
										{item.icon}
									</span>
								}
								formatter={formatter({ duration: item.duration ?? 2 })}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Divider />

			{/* 格式化与样式 */}
			<Typography.Title level={5}>格式化与样式</Typography.Title>
			<Row gutter={[16, 16]}>
				{[
					{
						title: "货币格式",
						value: 128888,
						prefix: "¥",
						icon: <DollarOutlined />,
						color: "#1677ff",
					},
					{
						title: "百分比格式",
						value: 86.58,
						suffix: "%",
						decimals: 2,
						color: "#52c41a",
					},
					{
						title: "大额数字",
						value: 9834567,
						color: "#fa8c16",
					},
					{
						title: "无千位分隔",
						value: 5647382,
						separator: "",
						color: "#eb2f96",
					},
				].map((item, i) => (
					<Col xs={24} sm={12} lg={6} key={i}>
						<Card>
							<Statistic
								title={
									<div className="flex items-center gap-2">
										<span style={{ color: item.color }}>
											{item.icon || <FireOutlined />}
										</span>
										{item.title}
									</div>
								}
								value={item.value}
								formatter={formatter({
									separator: item.separator ?? ",",
									prefix: item.prefix,
									suffix: item.suffix,
									decimals: item.decimals,
								})}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Divider />

			{/* 缓动效果对比 */}
			<Typography.Title level={5}>缓动效果对比</Typography.Title>
			<Row gutter={[16, 16]}>
				{[
					{
						title: "缓出动画 (easeOut)",
						value: 78456,
						useEasing: true,
						color: "#1677ff",
						desc: "先快后慢，数字逐渐减速停止",
					},
					{
						title: "线性动画 (linear)",
						value: 78456,
						useEasing: false,
						color: "#fa8c16",
						desc: "匀速滚动，速度恒定",
					},
				].map((item, i) => (
					<Col xs={24} sm={12} key={i}>
						<Card>
							<Statistic
								title={item.title}
								value={item.value}
								formatter={formatter({
									duration: 3,
									useEasing: item.useEasing,
								})}
							/>
							<Typography.Text type="secondary" style={{ fontSize: 13 }}>
								{item.desc}
							</Typography.Text>
						</Card>
					</Col>
				))}
			</Row>

			<Divider />

			{/* 延迟逐行动画 */}
			<Typography.Title level={5}>延迟逐行动画</Typography.Title>
			<Row gutter={[16, 16]}>
				{[
					{ title: "立即开始", value: 45219, delay: 0, color: "#1677ff" },
					{ title: "延迟 0.3s", value: 67384, delay: 0.3, color: "#52c41a" },
					{ title: "延迟 0.6s", value: 28910, delay: 0.6, color: "#fa8c16" },
					{ title: "延迟 1.0s", value: 91547, delay: 1, color: "#eb2f96" },
				].map((item, i) => (
					<Col xs={24} sm={12} lg={6} key={i}>
						<Card>
							<Statistic
								title={item.title}
								value={item.value}
								formatter={formatter({ delay: item.delay })}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Divider />

			{/* 大屏卡片组合 */}
			<Typography.Title level={5}>大屏卡片组合</Typography.Title>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={12} lg={8}>
					<Card>
						<Statistic
							title="总用户数"
							value={1024983}
							prefix={<UserOutlined style={{ marginRight: 8 }} />}
							formatter={formatter({ duration: 2.5 })}
						/>
						<Typography.Text type="secondary" style={{ fontSize: 12 }}>
							较上月增长 12.5%
						</Typography.Text>
					</Card>
				</Col>
				<Col xs={24} md={12} lg={8}>
					<Card>
						<Statistic
							title="今日收入"
							value={289560}
							formatter={formatter({ duration: 2, prefix: "¥" })}
						/>
						<Typography.Text type="secondary" style={{ fontSize: 12 }}>
							较昨日增长 8.2%
						</Typography.Text>
					</Card>
				</Col>
				<Col xs={24} md={12} lg={8}>
					<Card>
						<Statistic
							title="订单数"
							value={5680}
							formatter={formatter({ duration: 1.5 })}
						/>
						<Typography.Text type="secondary" style={{ fontSize: 12 }}>
							今日已完成 2,380 单
						</Typography.Text>
					</Card>
				</Col>
			</Row>

			{/* 带小数动画 */}
			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col span={24}>
					<Card>
						<Typography.Title level={5} className="!mb-4">
							高精度小数动画
						</Typography.Title>
						<Row gutter={[16, 16]}>
							{[
								{
									title: "汇率",
									value: 7.2456,
									decimals: 4,
									prefix: "USD/CNY ",
									color: "#1677ff",
								},
								{
									title: "利率",
									value: 3.85,
									decimals: 2,
									suffix: "%",
									color: "#52c41a",
								},
								{
									title: "股价",
									value: 168.42,
									decimals: 2,
									prefix: "$",
									color: "#fa8c16",
								},
								{
									title: "折扣率",
									value: 0.7632,
									decimals: 4,
									suffix: "%",
									color: "#eb2f96",
									transform: (v: number) => v * 100,
								},
							].map((item, i) => (
								<Col xs={24} sm={12} lg={6} key={i}>
									<div
										style={{
											padding: "16px 20px",
											borderRadius: 8,
											background: isDark ? "rgba(255,255,255,0.04)" : "#fafafa",
											border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f0f0f0"}`,
										}}
									>
										<Typography.Text type="secondary">
											{item.title}
										</Typography.Text>
										<div
											style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}
										>
											<CountUp
												end={
													item.transform
														? item.transform(item.value)
														: item.value
												}
												duration={3}
												decimals={item.decimals}
												separator=","
												prefix={item.prefix}
												suffix={item.suffix}
												useEasing
											/>
										</div>
									</div>
								</Col>
							))}
						</Row>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default CountUpPage;
