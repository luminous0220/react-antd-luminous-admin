import { useMemo } from "react";
import { useThemeStore, type ColorVariants } from "@/stores/theme";
import type { ChartColorSet } from "@/components/Chart";

export function getChartColors(
	variants: ColorVariants,
	isDark: boolean,
): ChartColorSet {
	return {
		primary: variants.p,
		primaryLight: variants.p300,
		primaryLighter: variants.p200,
		primaryLightest: variants.p100,
		textPrimary: variants.p700!,
		textSecondary: variants.p600!,
		border: variants.p,
		borderLight: variants.p300,
		accentGreen: isDark ? "#49aa19" : "#52c41a",
		accentOrange: isDark ? "#d87a16" : "#fa8c16",
		accentRed: isDark ? "#d32029" : "#f5222d",
		accentGold: isDark ? "#d4a853" : "#faad14",
	};
}

export function useChartColors(): ChartColorSet {
	const { isDark, colorVariants } = useThemeStore();
	return useMemo(
		() => getChartColors(colorVariants, isDark),
		[colorVariants, isDark],
	);
}
