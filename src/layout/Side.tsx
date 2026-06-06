import { Menu, theme } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth";
import { CFG } from "@/constants";
import { CollapseProps } from "./TopHeader/CollapseButton";
import { useMemo } from "react";
import { useThemeStore } from "@/stores/theme";
import { Logo } from "@/assets/Logo";
import { IconMap } from "@/libs";

interface ISideProps extends CollapseProps {
	className?: string;
	width?: number;
	collapsedWidth?: number;
}

// Logo 区域组件
const LogoSection = ({ collapsed }: { collapsed?: boolean }) => {
	const { colorVariants } = useThemeStore();

	return (
		<div
			className={`flex items-center justify-center h-[var(--top-height)] px-4 transition-colors ${
				collapsed ? "flex-col" : "gap-3"
			}`}
		>
			{/* Logo - 使用主题色 */}
			<Logo className="size-12" style={{ color: colorVariants.textPrimary }} />
			{/* 系统标题 */}
			{!collapsed && (
				<span
					className="text-[16px] font-semibold whitespace-nowrap"
					style={{ color: colorVariants.textPrimary }}
				>
					{CFG.SYSTEM_NAME}
				</span>
			)}
		</div>
	);
};

/**
 * @description 侧边栏菜单组件
 * 使用扁平静态菜单（无子菜单嵌套）
 */
export const Side = ({
	collapsed,
	width = 228,
	collapsedWidth = 64,
}: ISideProps) => {
	const location = useLocation();
	const menus = useAuthStore((s) => s.menus);
	const navigate = useNavigate();
	const { token } = theme.useToken();

	// 计算 selectedKeys：支持一级菜单和子菜单的精确匹配
	const selectedKeys = useMemo(() => {
		const currentPath = location.pathname;
		let matchedKey: string | null = null;

		for (const item of menus) {
			if (item.path === currentPath) {
				matchedKey = item.path;
				break;
			}

			if (item.children) {
				for (const child of item.children) {
					if (child.path === currentPath) {
						matchedKey = child.path;
						break;
					}
				}
				if (matchedKey) break;
			}
		}

		return matchedKey ? [matchedKey] : [CFG.HOME_PATH];
	}, [location.pathname, menus]);

	// 转换菜单数据为 antd Menu items 格式（扁平结构）
	const menuItems = useMemo(
		() =>
			menus.map((item) => {
				return {
					key: item.path,
					icon: IconMap[item.icon],
					label: item.title,
					children: item.children?.map((child) => ({
						key: child.path,
						icon: IconMap[child.icon],
						label: child.title,
					})),
				};
			}),
		[menus],
	);

	return (
		<aside
			className="h-full overflow-hidden absolute left-0 top-0 z-10"
			style={{
				width: collapsed ? collapsedWidth : width,
				backgroundColor: token.colorBgContainer,
				transition: "width 0.3s ease",
				borderRight: `1px solid ${token.colorBorderSecondary}`,
			}}
		>
			{/* Logo 区域 */}
			<LogoSection collapsed={collapsed} />

			{/* 菜单区域 */}
			<div className="h-[calc(100%-var(--top-height))] overflow-y-auto overflow-x-hidden">
				<Menu
					className="overflow-hidden w-full"
					styles={{
						root: {
							transition: "none",
							backgroundColor: token.colorBgContainer,
						},
					}}
					mode="inline"
					theme="light"
					selectedKeys={selectedKeys}
					inlineCollapsed={collapsed}
					onClick={({ key }) => {
						navigate(key);
					}}
					items={menuItems}
				/>
			</div>
		</aside>
	);
};
