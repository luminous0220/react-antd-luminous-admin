import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 预设颜色配置
export const PRESET_COLORS = {
	blue: "#438CFC",
	orange: "#db9b34",
	green: "#b1d5c8",
	red: "#ba5140",
	cyan: "#80a492",
	magenta: "#f091a0",
};

export type PresetColorKey = keyof typeof PRESET_COLORS;

// ===== HSL 工具（无依赖） =====
const hexToHsl = (hex: string) => {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h *= 60;
	}
	return { h, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number) => {
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(c * 255)
			.toString(16)
			.padStart(2, "0");
	};
	return `#${f(0)}${f(8)}${f(4)}`;
};

// ===== 颜色变体接口（只保留 p 色阶） =====
export interface ColorVariants {
	p: string;
	p100: string; // 最浅（背景 hover / 极淡装饰）
	p200: string; // 浅（弱化背景 / 分割线）
	p300: string; // 中浅（边框 / 描边）
	p400: string; // 主色 = 原始颜色
	p500?: string; // 略深（按需启用）
	p600?: string; // 深（按下/激活）
	p700?: string; // 更深（hover on dark）
	p800?: string; // 更深（hover on dark）
	p900?: string; // 更深（hover on dark）
}

/**
 * 根据主色生成颜色变体
 * @param primaryColor 主色 hex 值
 * @param isDark 是否深色模式
 */
export const generateColorVariants = (
	primaryColor: string,
	isDark: boolean, // 当前保留参数，便于以后按模式微调
): ColorVariants => {
	const { h, s, l } = hexToHsl(primaryColor);

	// 限制亮度在 [0, 95] 区间，避免出现纯白/纯黑
	const shift = (delta: number) =>
		hslToHex(h, s, Math.max(0, Math.min(95, l + delta)));

	return {
		p: primaryColor,
		p100: shift(+35), // 最浅
		p200: shift(+22),
		p300: shift(+10),
		p400: primaryColor, // 基色
		p500: shift(-10),
		p600: shift(-20),
		p700: shift(-30),
		p800: shift(-40),
		p900: shift(-50),
		_isDark: isDark, // 防止 unused 警告；如不需要可删
	} as ColorVariants;
};

/**
 * 同步主题到 DOM
 * @param isDark 是否深色模式
 */
const syncThemeToDOM = (isDark: boolean) => {
	const root = document.documentElement;
	if (isDark) {
		root.classList.add("dark");
		document.body.classList.add("dark");
	} else {
		root.classList.remove("dark");
		document.body.classList.remove("dark");
	}
};

/**
 * 将颜色变体同步为全局 CSS 变量
 * @param variants 颜色变体对象
 */
const syncThemeToCSSVariables = (variants: ColorVariants) => {
	const root = document.documentElement;
	// 主色
	root.style.setProperty("--p", variants.p);
	// 数字色阶：键名 p100 → --p-100
	(Object.keys(variants) as (keyof ColorVariants)[]).forEach((key) => {
		if (typeof key === "string" && /^p\d+$/.test(key)) {
			root.style.setProperty(`--${key}`, variants[key] as string);
		}
	});
};

interface ThemeStoreState {
	isMobile: boolean;
	isDark: boolean;
	colorPrimary: string;
	colorVariants: ColorVariants;

	// Actions
	setMobile: (isMobile: boolean) => void;
	setDark: (isDark: boolean) => void;
	toggleDark: () => void;
	setColorPrimary: (color: string) => void;
	setPresetColor: (key: PresetColorKey) => void;
	recomputeTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState>()(
	persist(
		(set, get) => ({
			isMobile: false,
			isDark: false,
			colorPrimary: PRESET_COLORS.blue,
			colorVariants: generateColorVariants(PRESET_COLORS.blue, false),

			setMobile: (isMobile) => {
				set({ isMobile });
			},

			setDark: (isDark) => {
				syncThemeToDOM(isDark);
				const { colorPrimary } = get();
				set({
					isDark,
					colorVariants: generateColorVariants(colorPrimary, isDark),
				});
			},

			toggleDark: () => {
				const { isDark } = get();
				get().setDark(!isDark);
			},

			setColorPrimary: (color) => {
				const { isDark } = get();
				set({
					colorPrimary: color,
					colorVariants: generateColorVariants(color, isDark),
				});
			},

			setPresetColor: (key) => {
				const color = PRESET_COLORS[key];
				get().setColorPrimary(color);
			},

			recomputeTheme: () => {
				const { isDark, colorPrimary } = get();
				syncThemeToDOM(isDark);
				const colorVariants = generateColorVariants(colorPrimary, isDark);
				syncThemeToCSSVariables(colorVariants);
				set({
					colorVariants,
				});
			},
		}),
		{
			name: "theme-storage",
			storage: createJSONStorage(() => localStorage),
			// 只持久化基础状态，colorVariants 是计算值不需要持久化
			partialize: (state) => ({
				isDark: state.isDark,
				colorPrimary: state.colorPrimary,
			}),
			// 恢复持久化数据后重新计算
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.recomputeTheme();
				}
			},
		},
	),
);

// 初始化：确保页面加载时主题正确应用
if (typeof window !== "undefined") {
	// 监听系统主题变化（可选功能）
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", () => {
		// 如果需要自动跟随系统主题，可以在这里处理
		// 当前不自动跟随，保留用户手动选择
	});

	// 页面加载时同步主题
	const state = useThemeStore.getState();
	syncThemeToDOM(state.isDark);
}

// 2. 在 Store 外部添加订阅器，监听状态变化后同步 DOM
useThemeStore.subscribe((state, prevState) => {
	// 只有当颜色或暗黑模式真正发生变化时，才同步 DOM
	if (
		state.colorPrimary !== prevState.colorPrimary ||
		state.isDark !== prevState.isDark
	) {
		syncThemeToDOM(state.isDark);
		syncThemeToCSSVariables(state.colorVariants);
	}
});
