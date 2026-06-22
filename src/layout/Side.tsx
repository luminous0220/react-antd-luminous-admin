import { Divider, Menu, theme } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth";
import { CFG } from "@/constants";
import { CollapseProps } from "./TopHeader/CollapseButton";
import { useMemo, useState } from "react";
import { useThemeStore } from "@/stores/theme";
import { Logo } from "@/assets/Logo";
import { IconMap } from "@/libs";
import { motion } from "framer-motion";

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
					className="text-[22px] font-semibold whitespace-nowrap"
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
 * 手风琴模式：同一时间只允许展开一个父菜单
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

	// 手风琴模式：只允许展开一个父菜单
	const [openKeys, setOpenKeys] = useState<string[]>([]);

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

	// 转换菜单数据为 antd Menu items 格式
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
			className={`h-full overflow-hidden absolute left-0 top-0 z-10 ${collapsed ? "h-[98%] translate-y-[-50%] top-[50%] left-2" : ""}`}
			style={{
				width: collapsed ? collapsedWidth : width,
				backgroundColor: token.colorBgContainer,
				transition: "width 0.3s ease",
				borderRight: `1px solid ${token.colorBorderSecondary}`,
				borderRadius: collapsed ? "18px" : "0 18px 18px 0",
			}}
		>
			{/* Logo 区域 */}

			<LogoSection collapsed={collapsed} />

			<Divider className="my-0 mb-2" />

			{/* 菜单区域 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
				className="side-menu h-[calc(100%-var(--top-height))] overflow-y-auto overflow-x-hidden"
			>
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
					openKeys={openKeys}
					inlineCollapsed={collapsed}
					onOpenChange={(keys) => {
						// 手风琴模式：只保留最新展开的菜单
						setOpenKeys(keys.length > 0 ? [keys[keys.length - 1]] : []);
					}}
					onClick={({ key }) => {
						navigate(key);
					}}
					items={menuItems}
				/>
			</motion.div>
		</aside>
	);
};
