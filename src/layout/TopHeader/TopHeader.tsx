import { Header } from "antd/es/layout/layout";
import {
	Dropdown,
	Avatar,
	Space,
	Breadcrumb,
	AutoComplete,
	Input,
	theme,
} from "antd";
import { CollapseButton, CollapseProps } from "./CollapseButton";
import { Setting } from "./Setting";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/stores";
import { IconUser, IconKey, IconLogout, IconSearch } from "@tabler/icons-react";
import { IconMap, removeToken } from "@/libs";
import { useNavigate, useLocation } from "react-router";
import { CFG } from "@/constants";
import type { MenuProps } from "antd";
import type { IApi } from "@/apis";
import { useMemo, useState } from "react";

interface TopHeaderProps extends CollapseProps {
	className?: string;
}

/** 扁平化的菜单节点（用于面包屑和搜索） */
interface FlatMenuNode {
	path: string;
	title: string;
	icon: string;
	type: number;
	/** 从根到当前节点的面包屑文本，如 "Demo > 基础表格" */
	breadcrumbText: string;
	/** 从根到当前节点的面包屑路径数组 */
	trail: { path: string; title: string; icon: string }[];
}

/** 递归扁平化菜单树，返回所有可导航的菜单项 */
function flattenMenus(
	menus: IApi.MenuItem[],
	trail: { path: string; title: string; icon: string }[] = [],
): FlatMenuNode[] {
	const result: FlatMenuNode[] = [];
	for (const menu of menus) {
		const currentTrail = [
			...trail,
			{ path: menu.path, title: menu.title, icon: menu.icon },
		];
		result.push({
			path: menu.path,
			title: menu.title,
			icon: menu.icon,
			type: menu.type,
			breadcrumbText: currentTrail.map((t) => t.title).join(" > "),
			trail: currentTrail,
		});
		if (menu.children) {
			result.push(...flattenMenus(menu.children, currentTrail));
		}
	}
	return result;
}

/** 在菜单树中查找当前路径的面包屑轨迹 */
function findBreadcrumbTrail(
	menus: IApi.MenuItem[],
	targetPath: string,
	trail: { path: string; title: string; icon: string; type: number }[] = [],
): { path: string; title: string; icon: string; type: number }[] | null {
	for (const menu of menus) {
		const current = {
			path: menu.path,
			title: menu.title,
			icon: menu.icon,
			type: menu.type,
		};
		if (menu.path === targetPath) {
			return [...trail, current];
		}
		if (menu.children) {
			const found = findBreadcrumbTrail(menu.children, targetPath, [
				...trail,
				current,
			]);
			if (found) return found;
		}
	}
	return null;
}

export const TopHeader = ({ setCollapsed, collapsed }: TopHeaderProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const userInfo = useAuthStore((s) => s.userInfo);
	const menus = useAuthStore((s) => s.menus);
	const [searchText, setSearchText] = useState("");
	const [inputFocused, setInputFocused] = useState(false);
	const { token } = theme.useToken();
	// 扁平化菜单（用于搜索）
	const flatMenus = useMemo(() => flattenMenus(menus), [menus]);
	// 面包屑
	const breadcrumbItems = useMemo(() => {
		const trail = findBreadcrumbTrail(menus, location.pathname);
		if (!trail || trail.length === 0) return [];
		return trail.map((item, index) => ({
			title: (
				<Space size={4}>
					{IconMap[item.icon]}
					<span>{item.title}</span>
				</Space>
			),
			onClick:
				index < trail.length - 1 && item.type !== 1
					? () => navigate(item.path)
					: undefined,
		}));
	}, [menus, location.pathname, navigate]);

	// 搜索选项
	const searchOptions = useMemo(() => {
		const kw = searchText.toLowerCase();
		const source = searchText
			? flatMenus.filter(
					(item) =>
						item.title.toLowerCase().includes(kw) ||
						item.breadcrumbText.toLowerCase().includes(kw),
				)
			: flatMenus;
		return source.slice(0, 16).map((item) => ({
			value: item.path,
			disabled: item.type === 1,
			label: (
				<div className="flex items-center gap-2 py-0.5">
					<span >{IconMap[item.icon]}</span>
					<span className="text-xs ">{item.breadcrumbText}</span>
				</div>
			),
		}));
	}, [searchText, flatMenus]);

	// 选中搜索结果 → 导航并清空
	const handleSearchSelect = (value: string) => {
		setSearchText("");
		navigate(value);
	};

	// 用户下拉菜单项
	const userMenuItems: MenuProps["items"] = [
		{
			key: "profile",
			label: "个人信息",
			icon: <IconUser stroke={1} />,
			onClick: () => {
				navigate("/profile");
			},
		},
		{
			key: "password",
			label: "修改密码",
			icon: <IconKey stroke={1} />,
			onClick: () => {
				navigate("/password");
			},
		},
		{
			type: "divider",
		},
		{
			key: "logout",
			label: "退出登录",
			icon: <IconLogout stroke={1} />,
			danger: true,
			onClick: () => {
				removeToken();
				navigate(CFG.LOGIN_PATH);
			},
		},
	];

	return (
		<div className="w-full pt-4 relative z-[99] px-4">
			<Header
				className="flex h-top items-center justify-between shadow-soft-lg backdrop-blur "
				style={{
					padding: "0 16px",
					backgroundColor: token.colorBgContainer,
					borderRadius: "14px",
				}}
			>
				{/* 左侧：折叠按钮 + 面包屑 + 搜索 */}
				<div className="flex items-center gap-6 flex-1 min-w-0">
					<CollapseButton collapsed={collapsed} setCollapsed={setCollapsed} />

					<AutoComplete
						className="max-w-64 max-md:hidden"
						options={searchOptions}
						showSearch={{ onSearch: setSearchText }}
						onSelect={handleSearchSelect}
						onClear={() => setSearchText("")}
						value={searchText}
						open={inputFocused && searchOptions.length > 0 ? true : undefined}
						popupMatchSelectWidth={false}
						getPopupContainer={(trigger) => trigger.parentElement!}
					>
						<Input
							className="h-[32px] w-[256px]"
							placeholder="搜索菜单..."
							prefix={
								<IconSearch size={14} stroke={1.5} className="text-gray-400" />
							}
							allowClear
							onFocus={() => setInputFocused(true)}
							onBlur={() => setInputFocused(false)}
						/>
					</AutoComplete>
				</div>

				{/* 右侧：主题切换 + 系统设置 + 用户头像（错峰淡入） */}
				<div className="flex items-center gap-2">
					<ThemeToggle />

					<Setting />

					<Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
						<Space className="cursor-pointer">
							<Avatar
								size={32}
								icon={<IconUser size={18} stroke={1} />}
								style={{
									cursor: "pointer",
								}}
							/>
							<span className="hidden md:inline text-sm">{userInfo?.name}</span>
						</Space>
					</Dropdown>
				</div>
			</Header>
			<Breadcrumb className="mt-4 mb-2 shrink-0" items={breadcrumbItems} />
		</div>
	);
};
