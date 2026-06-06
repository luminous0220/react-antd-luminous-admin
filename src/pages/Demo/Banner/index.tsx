import { Banner, type BannerType } from "@/components/Banner";
import img1 from "./img-1.png";
import img2 from "./img-2.png";
import img3 from "./img-3.png";
import img4 from "./img-4.png";

interface BannerItem {
	type: BannerType;
	title: string;
	description: string;
	buttonText: string;
	img?: string;
	onButtonClick: () => void;
}

const BANNERS: BannerItem[] = [
	{
		type: "blue",
		title: "数据洞察报告",
		description: "实时追踪核心业务指标，AI 驱动智能分析与趋势预测",
		buttonText: "查看详情",
		img: img1,
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "pink",
		title: "用户增长引擎",
		description: "多渠道获客分析，精准定位高价值用户群体与转化路径",
		buttonText: "立即体验",
		img: img2,
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "green",
		title: "安全合规中心",
		description: "全方位数据加密与权限管控，满足企业级安全审计标准",
		buttonText: "了解更多",
		img: img3,
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "purple",
		title: "智能工作流",
		description: "可视化流程编排引擎，轻松搭建审批、通知、自动化任务",
		buttonText: "开始使用",
		img: img4,
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "orange",
		title: "多端协同办公",
		description: "Web / 移动端 / 桌面端实时同步，随时随地高效协作",
		buttonText: "立即试用",
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "teal",
		title: "开放 API 平台",
		description: "RESTful & GraphQL 双协议支持，完善的 SDK 与开发者文档",
		buttonText: "查看文档",
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "red",
		title: "智能预警系统",
		description: "实时监控异常指标，多渠道告警通知与自动化处理流程",
		buttonText: "配置规则",
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "cyan",
		title: "数据可视化",
		description: "丰富的图表组件库，拖拽式搭建专业数据看板",
		buttonText: "创建看板",
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "indigo",
		title: "权限管理系统",
		description: "细粒度 RBAC 权限模型，灵活配置角色与资源访问策略",
		buttonText: "管理权限",
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
	{
		type: "lime",
		title: "性能优化平台",
		description: "前端性能监控与分析，智能推荐优化方案提升加载速度",
		buttonText: "开始优化",
		onButtonClick: () => {
			window.$message.success("点击了按钮");
		},
	},
];

const BannerPage: React.FC = () => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{BANNERS.map((item, index) => (
				<Banner key={index} {...item} />
			))}
		</div>
	);
};

export default BannerPage;
