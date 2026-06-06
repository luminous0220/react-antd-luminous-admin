import { Row, Col, message, Typography } from "antd";
import {
	ShoppingCartOutlined,
	DollarOutlined,
	UserOutlined,
	EyeOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	ShoppingOutlined,
	LikeOutlined,
	MessageOutlined,
	StarOutlined,
	EditOutlined,
	SettingOutlined,
	EllipsisOutlined,
} from "@ant-design/icons";
import {
	NormalCard,
	ProgressCard,
	StatCard,
	MediaCard,
} from "@/components/Card";
import type {
	TodoItem,
	ActivityItem,
	TransactionItem,
} from "@/components/Card";
import DataCard from "./DataCard";
import { useChartColors } from "@/hooks/useChartColors";
import img1 from "./img1.jpg";
import img2 from "./img2.jpg";
import img3 from "./img3.jpg";
import img4 from "./img4.jpg";
// ---- Sample Data ----

const STAT_CARD_DATA = [
	{ id: "3", title: "总订单数", value: 12546, tooltip: "统计周期内成功下单的总订单数量", sparklineType: "line" as const, sparklineData: [420, 380, 450, 410, 470, 430, 490, 460, 510, 480, 520, 490, 500, 470, 530, 500, 540, 510, 550, 520] },
	{ id: "4", title: "转化率", value: 14.2, suffix: "%", tooltip: "访问用户中实际完成下单的占比", sparklineType: "progress" as const, sparklineData: [14.2], sparklineColor: "#52c41a" },
	{ id: "5", title: "活跃用户", value: 32889, tooltip: "统计周期内有操作行为的独立用户数", sparklineType: "bar" as const, sparklineData: [1200, 1100, 1350, 1250, 1400, 1300, 1450, 1380, 1500, 1420, 1520, 1480, 1460, 1400, 1550, 1500, 1580, 1520, 1600, 1550] },
	{ id: "6", title: "平均客单价", value: 126.5, prefix: "¥", tooltip: "总销售额除以总订单数得出的平均每单金额", sparklineType: "line" as const, sparklineData: [108, 112, 115, 118, 120, 119, 122, 125, 123, 126, 124, 127, 125, 128, 126, 129, 127, 130, 128, 126], sparklineColor: "#fa8c16" },
];

const NORMAL_CARDS = [
	{
		icon: <ShoppingCartOutlined />,
		title: "总订单数",
		subtitle: (
			<>
				较昨日增长 <strong className="text-red-400">12.5%</strong>
			</>
		),
		iconBgColor: "#4a4a4a",
	},
	{
		icon: <DollarOutlined />,
		title: "总收入",
		subtitle: (
			<>
				较昨日增长 <strong className="text-green-400">8.2%</strong>
			</>
		),
		iconBgColor: "#13c2c2",
	},
	{
		icon: <UserOutlined />,
		title: "新增用户",
		subtitle: (
			<>
				较昨日增长 <strong className="text-blue-400">15.3%</strong>
			</>
		),
		iconBgColor: "#1890ff",
	},
	{
		icon: <EyeOutlined />,
		title: "页面浏览量",
		subtitle: (
			<>
				较昨日下降 <strong className="text-red-400">3.1%</strong>
			</>
		),
		iconBgColor: "#fa8c16",
	},
];

const PROGRESS_CARDS = [
	{
		title: "项目进度",
		percent: 72,
		subtitle: (
			<>
				已完成 <strong className="text-green-400">+12.5%</strong> 个里程碑
			</>
		),
		strokeColor: "#1890ff",
	},
	{
		title: "季度目标",
		percent: 45,
		subtitle: (
			<>
				距离季度结束还有 <strong className="text-blue-400">32</strong> 天
			</>
		),
		strokeColor: "#52c41a",
	},
	{
		title: "预算使用",
		percent: 88,
		subtitle: (
			<>
				已使用 <strong className="text-orange-400">¥88,000</strong> /{" "}
				<strong className="text-pink-400">¥100,000</strong>
			</>
		),
		strokeColor: "#fa8c16",
	},
	{
		title: "用户满意度",
		percent: 94,
		subtitle: (
			<>
				基于 <strong className="text-violet-400">2,836</strong> 份有效反馈
			</>
		),
		strokeColor: "#13c2c2",
	},
];

const MEDIA_CARDS = [
	{
		cover: img1,
		title: "产品设计规范",
		description: "我们努力打造一个完整的产品设计语言体系。",
		actions: [
			<SettingOutlined
				key="setting"
				onClick={() => window.$message.info("Click on Setting")}
			/>,
			<EditOutlined
				key="edit"
				onClick={() => window.$message.info("Click on Edit")}
			/>,
			<EllipsisOutlined
				key="ellipsis"
				onClick={() => window.$message.info("Click on Ellipsis")}
			/>,
		],
	},
	{
		cover: img2,
		avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
		title: "用户增长报告",
		description: "2025年Q1用户增长趋势与渠道分析",
		actions: [
			<SettingOutlined
				key="setting"
				onClick={() => window.$message.info("Click on Setting")}
			/>,
			<EditOutlined
				key="edit"
				onClick={() => window.$message.info("Click on Edit")}
			/>,
			<EllipsisOutlined
				key="ellipsis"
				onClick={() => window.$message.info("Click on Ellipsis")}
			/>,
		],
	},
	{
		cover: img3,
		avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
		title: "数据看板2.0",
		description: "全新升级的数据可视化看板",
		actions: [
			<SettingOutlined
				key="setting"
				onClick={() => window.$message.info("Click on Setting")}
			/>,
			<EditOutlined
				key="edit"
				onClick={() => window.$message.info("Click on Edit")}
			/>,
			<EllipsisOutlined
				key="ellipsis"
				onClick={() => window.$message.info("Click on Ellipsis")}
			/>,
		],
	},
	{
		cover: img4,
		avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4",
		title: "自动化工作流",
		description: "智能审批与任务编排，提升协作效率",
		actions: [
			<SettingOutlined
				key="setting"
				onClick={() => window.$message.info("Click on Setting")}
			/>,
			<EditOutlined
				key="edit"
				onClick={() => window.$message.info("Click on Edit")}
			/>,
			<EllipsisOutlined
				key="ellipsis"
				onClick={() => window.$message.info("Click on Ellipsis")}
			/>,
		],
	},
];

const TODO_ITEMS: TodoItem[] = [
	{
		icon: <FileTextOutlined />,
		iconBgColor: "#1990FF",
		title: "审核新注册商家资质",
		status: "待处理",
		time: "10:30",
	},
	{
		icon: <CheckCircleOutlined />,
		iconBgColor: "#F59E0C",
		title: "更新首页Banner素材",
		status: "进行中",
		time: "11:00",
	},
	{
		icon: <ClockCircleOutlined />,
		iconBgColor: "#EB3097",
		title: "处理用户投诉工单 #2847",
		status: "紧急",
		time: "12:15",
	},
	{
		icon: <ExclamationCircleOutlined />,
		iconBgColor: "#02B96B",
		title: "备份数据库并更新索引",
		status: "已完成",
		time: "14:00",
	},
	{
		icon: <FileTextOutlined />,
		iconBgColor: "#1990FF",
		title: "新商品上架审批流程",
		status: "待处理",
		time: "15:30",
	},
];

const ACTIVITY_ITEMS: ActivityItem[] = [
	{
		icon: <ShoppingOutlined />,
		iconBgColor: "#1990FF",
		title: "新订单 #20240525-001",
		description: "用户张先生下单购买了3件商品，总金额¥598.00",
	},
	{
		icon: <LikeOutlined />,
		iconBgColor: "#EB3097",
		title: "商品获得好评",
		description: "「无线蓝牙耳机」收到用户5星好评",
	},
	{
		icon: <MessageOutlined />,
		iconBgColor: "#F59E0C",
		title: "新留言通知",
		description: "您有3条新的客户留言待回复",
	},
	{
		icon: <StarOutlined />,
		iconBgColor: "#02B96B",
		title: "收藏店铺提醒",
		description: "您的店铺被 28 位用户收藏",
	},
	{
		icon: <EditOutlined />,
		iconBgColor: "#1990FF",
		title: "商品信息更新",
		description: "「智能手表Pro」商品详情页已更新",
	},
];

const TRANSACTION_ITEMS: TransactionItem[] = [
	{
		color: "#1890ff",
		time: "2025-05-25 14:30",
		description: "订单 ORD-20250525-001 已支付，金额 ¥598.00",
		highlightText: "ORD-20250525-001",
	},
	{
		color: "#52c41a",
		time: "2025-05-25 13:15",
		description: "退款单 RFD-20250525-002 已处理，金额 ¥128.00",
		highlightText: "RFD-20250525-002",
	},
	{
		color: "#fa8c16",
		time: "2025-05-25 11:45",
		description: "订单 ORD-20250525-003 待发货，金额 ¥1,299.00",
		highlightText: "ORD-20250525-003",
	},
	{
		color: "#13c2c2",
		time: "2025-05-25 10:00",
		description: "结算单 STL-20250525-004 已到账，金额 ¥3,560.00",
		highlightText: "STL-20250525-004",
	},
	{
		color: "#fa8c16",
		time: "2025-05-25 09:20",
		description: "订单 ORD-20250525-005 待支付，金额 ¥256.00",
		highlightText: "ORD-20250525-005",
	},
];

const CardList: React.FC = () => {
	const colors = useChartColors();

	return (
		<div className="space-y-4">
			{/* Section 1: Normal Cards */}
			<div>
				<Typography.Title level={5}>普通卡片</Typography.Title>
				<Row gutter={[16, 16]}>
					{NORMAL_CARDS.map((card, i) => (
						<Col xs={24} sm={12} md={12} lg={6} key={i}>
							<NormalCard
								icon={card.icon}
								title={card.title}
								subtitle={card.subtitle}
								iconBgColor={card.iconBgColor}
							/>
						</Col>
					))}
				</Row>
			</div>

			<div>
				<Typography.Title level={5}>图表卡片</Typography.Title>
				<Row gutter={[16, 16]}>
					{STAT_CARD_DATA.map((card, i) => (
						<Col xs={24} sm={12} md={12} lg={6} key={i}>
							<StatCard data={card} colors={colors} />
						</Col>
					))}
				</Row>
			</div>

			<div>
				<Typography.Title level={5}>进度卡片</Typography.Title>
				<Row gutter={[16, 16]}>
					{PROGRESS_CARDS.map((card, i) => (
						<Col xs={24} sm={12} md={12} lg={6} key={i}>
							<ProgressCard
								title={card.title}
								percent={card.percent}
								subtitle={card.subtitle}
								strokeColor={card.strokeColor}
							/>
						</Col>
					))}
				</Row>
			</div>

			<div>
				<Typography.Title level={5}>媒体卡片</Typography.Title>
				<Row gutter={[16, 16]}>
					{MEDIA_CARDS.map((card, i) => (
						<Col xs={24} sm={12} md={12} lg={6} key={i}>
							<MediaCard
								cover={card.cover}
								avatar={card.avatar}
								title={card.title}
								description={card.description}
								actions={card.actions}
							/>
						</Col>
					))}
				</Row>
			</div>

			<div>
				<Typography.Title level={5}>数据卡片</Typography.Title>
				<DataCard
					todoTitle="待办事项"
					todoSubtitle="共 5 项"
					todoItems={TODO_ITEMS}
					activityTitle="最近活动"
					activitySubtitle="共 5 条"
					activityItems={ACTIVITY_ITEMS}
					onViewMore={() => message.info("查看更多活动")}
					transactionTitle="最近交易"
					transactionSubtitle="共 5 笔"
					transactionItems={TRANSACTION_ITEMS}
				/>
			</div>
		</div>
	);
};

export default CardList;
