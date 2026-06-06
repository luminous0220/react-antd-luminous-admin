import { useMemo } from "react";
import { useThemeStore, type ColorVariants } from "@/stores/theme";
import type { ChartColorSet } from "@/components/Chart/type";

export function getChartColors(
	variants: ColorVariants,
	isDark: boolean,
): ChartColorSet {
	return {
		primary: variants.primary,
		primaryLight: variants.light,
		primaryLighter: variants.lighter,
		primaryLightest: variants.lightest,
		textPrimary: variants.textPrimary,
		textSecondary: variants.textSecondary,
		border: variants.border,
		borderLight: variants.borderLight,
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
