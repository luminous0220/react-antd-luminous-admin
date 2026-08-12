import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 预设颜色配置
export const PRESET_COLORS = {
  blue: "#427bff",
  orange: "#fa8c16",
  green: "#52c41a",
  purple: "#722ed1",
  cyan: "#13c2c2",
  magenta: "#eb2f96",
};

export type PresetColorKey = keyof typeof PRESET_COLORS;

// 颜色变体接口
export interface ColorVariants {
  primary: string;
  deep: string;
  light: string;
  lighter: string;
  lightest: string;
  textPrimary: string;
  textSecondary: string;
  gradientEnd: string;
  border: string;
  borderLight: string;
}

/**
 * 根据主色生成颜色变体
 * @param primaryColor 主色 hex 值
 * @param isDark 是否深色模式
 */
export const generateColorVariants = (
  primaryColor: string,
  isDark: boolean,
): ColorVariants => {
  const hex = primaryColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return {
    primary: primaryColor,
    deep: `rgb(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.7)})`,
    light: isDark
      ? `rgba(${r}, ${g}, ${b}, 0.35)`
      : `rgba(${r}, ${g}, ${b}, 0.6)`,
    lighter: `rgba(${r}, ${g}, ${b}, 0.25)`,
    lightest: `rgba(${r}, ${g}, ${b}, 0.15)`,
    textPrimary: isDark
      ? `rgba(${r}, ${g}, ${b}, 0.9)`
      : `rgb(${Math.floor(r * 0.8)}, ${Math.floor(g * 0.8)}, ${Math.floor(b * 0.8)})`,
    textSecondary: isDark
      ? `rgba(${r}, ${g}, ${b}, 0.7)`
      : `rgba(${r}, ${g}, ${b}, 0.6)`,
    gradientEnd: `rgb(${Math.floor(r * 0.85)}, ${Math.floor(g * 0.85)}, ${Math.floor(b * 0.85)})`,
    border: isDark
      ? `rgba(${r}, ${g}, ${b}, 0.3)`
      : `rgba(${r}, ${g}, ${b}, 0.4)`,
    borderLight: isDark
      ? `rgba(${r}, ${g}, ${b}, 0.2)`
      : `rgba(${r}, ${g}, ${b}, 0.3)`,
  };
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
        set({
          colorVariants: generateColorVariants(colorPrimary, isDark),
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