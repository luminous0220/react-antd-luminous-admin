import { ChartColorSet } from "@/components/Chart";
import type { RankingItem, AnalysisTab } from "../types";

interface RankingListProps {
	data: RankingItem[];
	mode: AnalysisTab;
	colors: ChartColorSet;
}

const medalColors = (rank: number, colors: ChartColorSet) => {
	if (rank === 1)
		return { bg: "#F48F68", color: "#fff" };
	if (rank === 2)
		return { bg: "#FFE394", color: "#fff" };
	if (rank === 3)
		return { bg: "#8CDFDD", color: "#fff" };
	return { bg: "transparent", color: colors.textSecondary };
};

const RankingList: React.FC<RankingListProps> = ({ data, mode, colors }) => {
	return (
		<div className="flex flex-col h-full" style={{ minHeight: 360 }}>
			<div
				className="text-sm font-medium mb-3 px-1"
				style={{ color: colors.textPrimary }}
			>
				{mode === "revenue" ? "收益排行 Top 7" : "转化率排行 Top 7"}
			</div>

			<div className="flex flex-col gap-0 flex-1">
				{data.map((item) => {
					const medal = medalColors(item.rank, colors);
					return (
						<div
							key={item.rank}
							className="flex items-center px-2 py-2 rounded-md transition-colors"
						>
							{/* Rank badge */}
							<div
								className="flex items-center justify-center rounded-full shrink-0"
								style={{
									width: 24,
									height: 24,
									background: medal.bg,
									color: medal.color,
									fontSize: 12,
									fontWeight: 700,
									border: item.rank > 3 ? `1px solid ${colors.border}` : "none",
								}}
							>
								{item.rank}
							</div>

							{/* Label */}
							<span
								className="flex-1 ml-3 text-sm truncate"
								style={{ color: colors.textPrimary }}
							>
								{item.label}
							</span>

							{/* Value */}
							<span
								className="text-sm font-semibold shrink-0 ml-2"
								style={{ color: colors.primary }}
							>
								{mode === "revenue"
									? `¥${item.value.toLocaleString()}`
									: `${item.secondaryValue ?? item.value}%`}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default RankingList;
