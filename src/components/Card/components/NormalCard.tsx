import { Card, Typography } from "antd";
import { NormalCardProps } from "../types.d";

export const NormalCard: React.FC<NormalCardProps> = ({
	icon,
	title,
	subtitle,
	iconBgColor = "#4a4a4a",
}) => {
	return (
		<Card className="h-full">
			<div className="flex items-center gap-4">
				<div
					className="flex items-center justify-center flex-shrink-0"
					style={{
						width: 48,
						height: 48,
						borderRadius: 12,
						backgroundColor: iconBgColor,
					}}
				>
					<span style={{ color: "#fff", fontSize: 22, display: "flex" }}>
						{icon}
					</span>
				</div>
				<div className="flex flex-col min-w-0">
					<Typography.Text
						strong
						className="truncate"
					>
						{title}
					</Typography.Text>
					<Typography.Text
						type="secondary"
						style={{ fontSize: 13 }}
						className="truncate"
					>
						{subtitle}
					</Typography.Text>
				</div>
			</div>
		</Card>
	);
};

