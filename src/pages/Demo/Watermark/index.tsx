import { useState } from "react";
import { Card, Typography, Input, Slider, Divider } from "antd";
import { Watermark } from "antd";
import { useThemeStore } from "@/stores";

const DEMO_TEXT = `春江潮水连海平，海上明月共潮生。
滟滟随波千万里，何处春江无月明！
江流宛转绕芳甸，月照花林皆似霰。
空里流霜不觉飞，汀上白沙看不见。
江天一色无纤尘，皎皎空中孤月轮。
江畔何人初见月？江月何年初照人？
人生代代无穷已，江月年年望相似。
不知江月待何人，但见长江送流水。`;

const WatermarkPage: React.FC = () => {
	const isDark = useThemeStore((s) => s.isDark);

	const [content, setContent] = useState("内部资料 严禁外传");
	const [fontSize, setFontSize] = useState(18);
	const [rotate, setRotate] = useState(-22);
	const [opacity, setOpacity] = useState(0.15);
	const [gapX, setGapX] = useState(120);
	const [gapY, setGapY] = useState(80);

	const watermarkColor = isDark
		? `rgba(255,255,255,${opacity})`
		: `rgba(0,0,0,${opacity})`;

	return (
		<div className="min-h-full p-6 space-y-6">
			<div>
				<Typography.Title level={4} className="!mb-1">
					水印 Watermark
				</Typography.Title>
				<Typography.Text type="secondary">
					基于 Ant Design Watermark 组件，支持文字/图片水印的自定义配置
				</Typography.Text>
			</div>

			{/* 控制面板 */}
			<Card size="small" title="水印配置">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<Typography.Text className="text-xs mb-1 block">水印内容</Typography.Text>
						<Input
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="水印文字"
							size="middle"
						/>
					</div>
					<div>
						<Typography.Text className="text-xs mb-1 block">
							字号: {fontSize}px
						</Typography.Text>
						<Slider
							min={12}
							max={48}
							value={fontSize}
							onChange={setFontSize}
						/>
					</div>
					<div>
						<Typography.Text className="text-xs mb-1 block">
							旋转: {rotate}°
						</Typography.Text>
						<Slider
							min={-90}
							max={90}
							value={rotate}
							onChange={setRotate}
						/>
					</div>
					<div>
						<Typography.Text className="text-xs mb-1 block">
							透明度: {opacity}
						</Typography.Text>
						<Slider
							min={0.05}
							max={0.5}
							step={0.01}
							value={opacity}
							onChange={setOpacity}
						/>
					</div>
					<div>
						<Typography.Text className="text-xs mb-1 block">
							水平间距: {gapX}px
						</Typography.Text>
						<Slider min={20} max={300} value={gapX} onChange={setGapX} />
					</div>
					<div>
						<Typography.Text className="text-xs mb-1 block">
							垂直间距: {gapY}px
						</Typography.Text>
						<Slider min={20} max={300} value={gapY} onChange={setGapY} />
					</div>
				</div>
			</Card>

			{/* 水印预览区 */}
			<Watermark
				content={content}
				font={{
					fontSize,
					color: watermarkColor,
					fontWeight: "bold",
				}}
				rotate={rotate}
				gap={[gapX, gapY]}
				style={{ borderRadius: 8 }}
			>
				<Card
					className="min-h-[360px]"
					styles={{
						body: {
							padding: "32px 40px",
							minHeight: 360,
							lineHeight: 2.2,
							fontSize: 15,
							color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
						},
					}}
				>
					<Typography.Title level={5} className="!mb-3">
						《春江花月夜》— 张若虚
					</Typography.Title>
					{DEMO_TEXT.split("\n").map((line, i) => (
						<div key={i}>{line}</div>
					))}
				</Card>
			</Watermark>

			<Divider />

			{/* 多行水印 & 图片水印 */}
			<Typography.Title level={5}>更多场景</Typography.Title>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Watermark
					content={["机密文档", "Confidential", "2026/05/28"]}
					font={{
						fontSize: 14,
						color: watermarkColor,
					}}
					rotate={-15}
					gap={[140, 100]}
				>
					<Card
						className="min-h-[240px]"
						styles={{ body: { padding: 24, minHeight: 240 } }}
					>
						<Typography.Title level={5}>多行水印</Typography.Title>
						<Typography.Text type="secondary">
							支持多行文字排列，适合展示多层信息（如文档密级 + 日期 +
							编号）
						</Typography.Text>
					</Card>
				</Watermark>

				<Watermark
					content="LOGO"
					font={{
						fontSize: 40,
						color: `rgba(24,144,255,${Math.max(0.08, opacity - 0.05)})`,
						fontWeight: "bolder",
					}}
					rotate={0}
					gap={[160, 160]}
				>
					<Card
						className="min-h-[240px]"
						styles={{ body: { padding: 24, minHeight: 240 } }}
					>
						<Typography.Title level={5}>Logo 水印</Typography.Title>
						<Typography.Text type="secondary">
							使用品牌色大字号 + 无旋转，模拟 Logo 平铺效果
						</Typography.Text>
					</Card>
				</Watermark>
			</div>
		</div>
	);
};

export default WatermarkPage;
