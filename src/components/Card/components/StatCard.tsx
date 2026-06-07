import { Card, Typography, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import CountUp from "react-countup";
import { useSparklineOption } from "../hooks/useSparkline";
import { useEcharts } from "@/hooks";
import { StatCardProps } from "../types.d";

export const StatCard: React.FC<StatCardProps> = ({ data, colors }) => {
	const sparklineColor = data.sparklineColor || colors.primary;
	const sparklineOption = useSparklineOption(
		data.sparklineType,
		data.sparklineData,
		sparklineColor,
	);
	const chartRef = useEcharts(sparklineOption);

	return (
		<Card styles={{ body: { padding: "16px" } }} className="h-full">
			<div className="flex items-center gap-1 mb-1">
				<Typography.Text type="secondary" className="text-md whitespace-nowrap">
					{data.title}
				</Typography.Text>
				<Tooltip title={data.tooltip}>
					<QuestionCircleOutlined
						className="text-xs cursor-pointer"
						style={{ color: colors.textSecondary || "#999" }}
					/>
				</Tooltip>
			</div>

			<Typography.Title
				level={4}
				className="!mb-1 !mt-0"
				style={{
					fontSize: 22,
					fontWeight: 700,
				}}
			>
				<CountUp
					end={data.value}
					duration={2}
					separator=","
					prefix={data.prefix}
					suffix={data.suffix}
					decimals={Number.isInteger(data.value) ? 0 : undefined}
				/>
			</Typography.Title>

			<div ref={chartRef} style={{ height: 40, width: "100%" }} />
		</Card>
	);
};

