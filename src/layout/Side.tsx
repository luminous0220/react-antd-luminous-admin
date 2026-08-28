import { Card, Tooltip, theme } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth";
import { CFG } from "@/constants";
import { CollapseProps } from "./TopHeader/CollapseButton";
import { memo, useCallback, useMemo } from "react";
import { useThemeStore } from "@/stores/theme";
import { IconMap } from "@/libs";
import type { IApi } from "@/apis";

interface ISideProps extends CollapseProps {
	className?: string;
	width?: number;
	collapsedWidth?: number;
}

/** 侧边栏菜单分组 */
interface SideGroup {
	key: string;
	title: string;
	items: SideItem[];
}

/** 侧边栏菜单项 */
interface SideItem {
	key: string;
	title: string;
	icon?: React.ReactNode;
	depth: number;
}

/** 菜单项横向内边距（与分组标题左侧对齐） */
const ITEM_PADDING_X = 12;

/**
 * @description 递归收集分组下的菜单项（展平子菜单，深层级通过 depth 缩进）
 * 消费后端 model.Menu（menu_name 为标题，menu_type 为 M/C/F），F 按钮已在上游被过滤
 * @param children 子菜单列表
 * @param depth 当前层级
 */
const collectItems = (children: IApi.MenuItem[], depth: number): SideItem[] =>
	children.flatMap((child) => [
		{
			key: child.path,
			title: child.title,
			icon: IconMap[child.icon],
			depth,
		},
		...(child.children?.length ? collectItems(child.children, depth + 1) : []),
	]);

/**
 * @description Logo 头部区域：主题色渐变圆角图标 + 系统名称/副标题
 */
const SideHeader = ({ collapsed }: { collapsed?: boolean }) => {
	const { token } = theme.useToken();

	return (
		<div
			className={`flex items-center pt-5 pb-4 whitespace-nowrap ${
				collapsed ? "justify-center" : "gap-3 px-4"
			}`}
		>
			{/* Logo 图标：主题色渐变圆角方块 + 品牌标识 */}
			<div className="size-[36px] shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2577F5] to-[#4f93ff]">
				🐼
			</div>

			{/* 系统名称 + 副标题 */}
			{!collapsed && (
				<div className="min-w-0">
					<h2
						className="text-[17px] font-semibold leading-none whitespace-nowrap overflow-hidden text-ellipsis"
						style={{ color: token.colorText }}
					>
						{CFG.SYSTEM_NAME}
					</h2>
					<p
						className="mt-1.5 text-xs"
						style={{ color: token.colorTextTertiary }}
					>
						管理平台
					</p>
				</div>
			)}
		</div>
	);
};

/**
 * @description 菜单分组标题（贴合设计稿的灰色小标题）
 */
const GroupTitle = ({ title }: { title: string }) => {
	const { token } = theme.useToken();

	return (
		<div
			className="pt-3 pb-2 text-[11px] font-medium"
			style={{
				color: token.colorTextTertiary,
				paddingLeft: ITEM_PADDING_X,
				paddingRight: ITEM_PADDING_X,
			}}
		>
			{title}
		</div>
	);
};

/**
 * @description 单个菜单项：选中态为内缩圆角高亮块；折叠态仅显示图标 + Tooltip
 * 使用 React.memo 缓存：仅当 props（item/active/collapsed/onClick）变化时才重新渲染，
 * 避免点击菜单项导致整棵菜单树重渲染
 */
const MenuItem = memo(
	({
		item,
		active,
		collapsed,
		onClick,
	}: {
		item: SideItem;
		active: boolean;
		collapsed?: boolean;
		onClick: (key: string) => void;
	}) => {
		const colorVariants = useThemeStore((s) => s.colorVariants);
		const { token } = theme.useToken();

		// 折叠态：仅图标，居中对齐，hover 展示标题
		if (collapsed) {
			return (
				<Tooltip placement="right" title={item.title}>
					<button
						onClick={() => onClick(item.key)}
						className="flex items-center justify-center size-10 mx-auto rounded-xl transition-colors"
						style={
							active
								? { backgroundColor: colorVariants.p, color: "#fff" }
								: { color: token.colorText }
						}
					>
						<span className="text-[16px] leading-none">{item.icon}</span>
					</button>
				</Tooltip>
			);
		}

		// 展开态：图标 + 文字，选中项为内缩圆角高亮块（贴合设计稿）
		return (
			<button
				onClick={() => onClick(item.key)}
				className={`flex items-center gap-2.5 w-full rounded-xl py-2.5 text-left transition-all duration-100 ${
					active ? "" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
				}`}
				style={{
					paddingLeft: ITEM_PADDING_X,
					paddingRight: ITEM_PADDING_X,
					...(!active && { color: token.colorText }),
					// 选中态：横向内缩 8px 的圆角高亮块
					...(active && {
						backgroundColor: colorVariants.p,
						color: "#fff",
					}),
					// 深层级菜单缩进
					...(item.depth >= 2 && {
						paddingLeft: ITEM_PADDING_X + (item.depth - 1) * 8,
					}),
				}}
			>
				<span className="shrink-0 text-[14px] leading-none">{item.icon}</span>
				<span className="text-sm truncate">{item.title}</span>
			</button>
		);
	},
);

/**
 * @description 侧边栏菜单组件（按设计稿 1:1 还原）
 * 布局：Logo 头部 / 分组标题 + 扁平菜单项 / 底部帮助中心
 * 支持折叠（仅图标 + Tooltip）与暗黑模式
 */
export const Side = ({
	className,
	collapsed,
	width = 256,
	collapsedWidth = 64,
}: ISideProps) => {
	const location = useLocation();
	const menus = useAuthStore((s) => s.menus);
	const navigate = useNavigate();

	// 菜单分组：无子菜单的一级菜单归入「工作台」，有子菜单的一级菜单作为分组标题
	const groups = useMemo(() => {
		const result: SideGroup[] = [];
		const workbench: SideItem[] = [];
		for (const top of menus) {
			// 有子菜单的一级菜单作为分组标题（M 目录），叶子一级菜单归入「工作台」
			if (top.children?.length) {
				result.push({
					key: String(top.id),
					title: top.title,
					items: collectItems(top.children, 1),
				});
			} else {
				workbench.push({
					key: top.path,
					title: top.title,
					icon: IconMap[top.icon],
					depth: 0,
				});
			}
		}

		if (workbench.length) {
			result.unshift({ key: "workbench", title: "工作台", items: workbench });
		}

		return result;
	}, [menus]);

	// 当前选中项：精确匹配路径，兜底回首页
	const selectedKey = useMemo(() => {
		const allItems = groups.flatMap((group) => group.items);
		const matched = allItems.find((item) => item.key === location.pathname);
		return matched ? matched.key : CFG.HOME_PATH;
	}, [location.pathname, groups]);

	// 点击菜单项：若点击的是当前已选中项，则跳过导航。
	// 避免重复 push 相同路由（产生冗余历史记录并触发无意义的重渲染导致卡顿）
	const handleClick = useCallback(
		(key: string) => {
			if (key === selectedKey) return;
			navigate(key);
		},
		[navigate, selectedKey],
	);

	return (
		<Card
			className={`flex flex-col h-full border-none z-10 ${className ?? ""}`}
			classNames={{
				body: "!p-2 h-full",
			}}
			style={{
				width: collapsed ? collapsedWidth : width,
				minWidth: collapsed ? collapsedWidth : width,
				transition:
					"all 0.3s ease, border-radius 0.3s ease, box-shadow 0.3s ease",
				borderRadius: "0 20px 20px 0",
			}}
		>
			<Card
				className="h-full"
				classNames={{
					body: "!p-0 h-full ",
				}}
				style={{
					borderRadius: "20px",
				}}
			>
				{/* Logo 头部 */}
				<SideHeader collapsed={collapsed} />

				{/* 菜单区域 */}
				<div className="side-menu-item-scroller h-[calc(100%-78px)] flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2">
					{/* 折叠态：仅图标 + Tooltip，不展示分组标题 */}
					{collapsed &&
						groups.map((group) => (
							<div key={group.key} className="space-y-2">
								{group.items.map((item) => (
									<MenuItem
										key={item.key}
										item={item}
										active={item.key === selectedKey}
										collapsed
										onClick={handleClick}
									/>
								))}
							</div>
						))}

					{/* 展开态：分组标题 + 菜单项 */}
					{!collapsed &&
						groups.map((group) => (
							<div key={group.key}>
								<GroupTitle title={group.title} />
								<div className="space-y-2">
									{group.items.map((item) => (
										<MenuItem
											key={item.key}
											item={item}
											active={item.key === selectedKey}
											onClick={handleClick}
										/>
									))}
								</div>
							</div>
						))}
				</div>
			</Card>
		</Card>
	);
};
