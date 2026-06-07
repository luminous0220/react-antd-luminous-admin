import { useState, useEffect } from "react";
import { Card, Typography, Progress } from "antd";
import CountUp from "react-countup";
import { ProgressCardProps } from "../types";

export const ProgressCard: React.FC<ProgressCardProps> = ({
	title,
	percent,
	subtitle,
	strokeColor = "#1890ff",
}) => {
	const [animPercent, setAnimPercent] = useState(0);

	useEffect(() => {
		let startTime: number | null = null;
		let raf = 0;
		const duration = 500;

		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - (1 - progress) * (1 - progress);
			setAnimPercent(Math.round(eased * percent));
			if (progress < 1) raf = requestAnimationFrame(step);
		};

		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [percent]);

	return (
		<Card className="h-full">
			<div className="flex items-center justify-between mb-2">
				<Typography.Title level={5}>{title}</Typography.Title>
				<Typography.Text strong style={{ fontSize: 18, color: strokeColor }}>
					<CountUp end={percent} duration={2} suffix="%" />
				</Typography.Text>
			</div>
			<Progress
				percent={animPercent}
				strokeColor={strokeColor}
				railColor="#f5f5f5"
				strokeWidth={8}
				showInfo={false}
			/>
			{subtitle && (
				<Typography.Text
					type="secondary"
					style={{ fontSize: 13, display: "block", marginTop: 8 }}
				>
					{subtitle}
				</Typography.Text>
			)}
		</Card>
	);
};
