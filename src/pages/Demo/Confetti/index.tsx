import { useCallback } from "react";
import { Card, Typography, Row, Col, Divider } from "antd";
import {
	RocketOutlined,
	FireOutlined,
	ThunderboltOutlined,
	StarOutlined,
	SmileOutlined,
	GiftOutlined,
} from "@ant-design/icons";
import confetti from "canvas-confetti";

const ConfettiPage: React.FC = () => {
	const fire = useCallback(
		(fn: (c: typeof confetti) => void) => {
			confetti.reset();
			fn(confetti);
		},
		[],
	);

	// ---- 效果函数 ----

	const basicBurst = (c: typeof confetti) => {
		c({
			particleCount: 150,
			spread: 80,
			origin: { x: 0.5, y: 0.5 },
			startVelocity: 45,
		});
	};

	const dualCannon = (c: typeof confetti) => {
		c({
			particleCount: 80,
			angle: 60,
			spread: 55,
			origin: { x: 0, y: 0.6 },
		});
		c({
			particleCount: 80,
			angle: 120,
			spread: 55,
			origin: { x: 1, y: 0.6 },
		});
	};

	const fireworks = (c: typeof confetti) => {
		const duration = 2000;
		const end = Date.now() + duration;
		const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];

		(function frame() {
			c({
				particleCount: 3,
				angle: 60,
				spread: 60,
				origin: { x: 0, y: 0.4 },
				colors,
			});
			c({
				particleCount: 3,
				angle: 120,
				spread: 60,
				origin: { x: 1, y: 0.4 },
				colors,
			});
			if (Date.now() < end) requestAnimationFrame(frame);
		})();
	};

	const waterfall = (c: typeof confetti) => {
		const end = Date.now() + 2500;
		const colors = ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1"];

		(function frame() {
			c({
				particleCount: 4,
				angle: 270,
				spread: 40,
				origin: { x: Math.random(), y: 0 },
				colors,
				startVelocity: 35,
				gravity: 0.7,
				scalar: 1.2,
			});
			if (Date.now() < end) requestAnimationFrame(frame);
		})();
	};

	const emojiConfetti = (c: typeof confetti) => {
		const scalar = 2;
		const star = confetti.shapeFromText({ text: "⭐", scalar });
		const heart = confetti.shapeFromText({ text: "❤️", scalar });
		const rocket = confetti.shapeFromText({ text: "🚀", scalar });

		c({
			particleCount: 30,
			spread: 70,
			origin: { x: 0.5, y: 0.4 },
			shapes: [star, heart, rocket],
			scalar: 1.5,
			startVelocity: 40,
		});
	};

	const coloredBurst = (c: typeof confetti) => {
		c({
			particleCount: 120,
			spread: 100,
			origin: { x: 0.5, y: 0.5 },
			colors: ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1"],
			startVelocity: 50,
			decay: 0.9,
			ticks: 200,
		});
	};

	const effects = [
		{
			label: "中心爆发",
			icon: <ThunderboltOutlined />,
			color: "#1677ff",
			action: basicBurst,
			desc: "从屏幕中央向四周扩散",
		},
		{
			label: "左右对射",
			icon: <RocketOutlined />,
			color: "#52c41a",
			action: dualCannon,
			desc: "从屏幕两侧同时发射",
		},
		{
			label: "烟花效果",
			icon: <FireOutlined />,
			color: "#fa8c16",
			action: fireworks,
			desc: "持续 2 秒的多色烟花",
		},
		{
			label: "顶部瀑布",
			icon: <GiftOutlined />,
			color: "#eb2f96",
			action: waterfall,
			desc: "从上往下飘落的彩带",
		},
		{
			label: "Emoji 礼花",
			icon: <SmileOutlined />,
			color: "#722ed1",
			action: emojiConfetti,
			desc: "星星爱心火箭形状",
		},
		{
			label: "五彩爆发",
			icon: <StarOutlined />,
			color: "#faad14",
			action: coloredBurst,
			desc: "品牌色系自定义颜色",
		},
	];

	return (
		<div className="min-h-full p-6 space-y-6">
			<div>
				<Typography.Title level={4} className="!mb-1">
					礼花特效 Confetti
				</Typography.Title>
				<Typography.Text type="secondary">
					基于 canvas-confetti 库，点击按钮触发全屏礼花粒子效果
				</Typography.Text>
			</div>

			<Row gutter={[16, 16]}>
				{effects.map((item, i) => (
					<Col xs={24} sm={12} lg={8} key={i}>
						<Card
							hoverable
							onClick={() => fire(item.action)}
							className="h-full cursor-pointer transition-all duration-300 text-center"
							styles={{ body: { padding: "28px 20px" } }}
						>
							<div
								className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
								style={{
									background: `${item.color}18`,
									color: item.color,
								}}
							>
								{item.icon}
							</div>
							<Typography.Title level={5} className="!mb-2">
								{item.label}
							</Typography.Title>
							<Typography.Text type="secondary" className="text-sm">
								{item.desc}
							</Typography.Text>
						</Card>
					</Col>
				))}
			</Row>

			<Divider />

			<Typography.Title level={5}>组合演示</Typography.Title>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12}>
					<Card
						hoverable
						onClick={() =>
							fire((c) => {
								// 3 轮连发：爆发 + Emoji 交替，间隔递增
								basicBurst(c);
								setTimeout(() => emojiConfetti(c), 300);
								setTimeout(() => basicBurst(c), 600);
								setTimeout(() => emojiConfetti(c), 900);
								setTimeout(() => basicBurst(c), 1200);
								setTimeout(() => emojiConfetti(c), 1500);
							})
						}
						className="text-center cursor-pointer"
						styles={{ body: { padding: 32 } }}
					>
						<div
							className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
							style={{
								background: "linear-gradient(135deg, #1677ff, #eb2f96)",
								color: "#fff",
							}}
						>
							<StarOutlined />
						</div>
						<Typography.Title level={5}>🎉 终极庆祝</Typography.Title>
						<Typography.Text type="secondary">
							3 轮爆发 + Emoji 交替连发
						</Typography.Text>
					</Card>
				</Col>
				<Col xs={24} sm={12}>
					<Card
						hoverable
						onClick={() =>
							fire((c) => {
								fireworks(c);
								setTimeout(() => waterfall(c), 1000);
							})
						}
						className="text-center cursor-pointer"
						styles={{ body: { padding: 32 } }}
					>
						<div
							className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
							style={{
								background: "linear-gradient(135deg, #fa8c16, #722ed1)",
								color: "#fff",
							}}
						>
							<FireOutlined />
						</div>
						<Typography.Title level={5}>🔥 全屏盛典</Typography.Title>
						<Typography.Text type="secondary">
							烟花 + 瀑布同时进行
						</Typography.Text>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ConfettiPage;
