import type { MockMethod } from "@meadmin-cn/vite-plugin-mock";

// ===== 菜单 Mock 数据（从权限接口提取） =====
const MOCK_MENUS_TREE = [
	{
		id: "menu-001",
		name: "Dashboard",
		title: "数据看板",
		sort: 1,
		parentId: null,
		path: "/home",
		icon: "HomeFilled",
		componentPath: "/Home",
		status: 1,
		permission: "",
		type: 2,
		desc: "首页仪表盘",
		children: [],
		createTime: "2024-01-01 00:00:00",
	},
	{
		id: "menu-forms",
		name: "FormsAndTables",
		title: "表格表单",
		sort: 2,
		parentId: null,
		path: "/forms",
		icon: "FormOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "表单与表格相关页面",
		children: [
			{
				id: "menu-forms-1",
				name: "basic-form",
				title: "基础表单",
				sort: 1,
				parentId: "menu-forms",
				path: "/forms/basic",
				icon: "FormOutlined",
				componentPath: "/Demo/BasicForm",
				status: 1,
				permission: "",
				type: 2,
				desc: "基础表单",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-forms-2",
				name: "step-form",
				title: "分布表单",
				sort: 2,
				parentId: "menu-forms",
				path: "/forms/step",
				icon: "MenuOutlined",
				componentPath: "/Demo/StepForm",
				status: 1,
				permission: "",
				type: 2,
				desc: "分步表单示例",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-forms-3",
				name: "basic-table",
				title: "基础表格",
				sort: 3,
				parentId: "menu-forms",
				path: "/forms/basic-table",
				icon: "ContainerOutlined",
				componentPath: "/Demo/BasicTable",
				status: 1,
				permission: "",
				type: 2,
				desc: "基础表格示例",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
		],
		createTime: "2024-01-01 00:00:00",
	},
	{
		id: "menu-components",
		name: "Components",
		title: "组件示例",
		sort: 3,
		parentId: null,
		path: "/components",
		icon: "CodepenOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "各类 UI 组件展示",
		children: [
			{
				id: "menu-comp-1",
				name: "card-list",
				title: "卡片",
				sort: 1,
				parentId: "menu-components",
				path: "/components/card-list",
				icon: "ApartmentOutlined",
				componentPath: "/Demo/CardList",
				status: 1,
				permission: "",
				type: 2,
				desc: "卡片形式数据展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-2",
				name: "banner",
				title: "Banner",
				sort: 2,
				parentId: "menu-components",
				path: "/components/banner",
				icon: "WindowsOutlined",
				componentPath: "/Demo/Banner",
				status: 1,
				permission: "",
				type: 2,
				desc: "Banner轮播图展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-3",
				name: "charts",
				title: "图表",
				sort: 3,
				parentId: "menu-components",
				path: "/components/charts",
				icon: "CodepenOutlined",
				componentPath: "/Demo/ChartsPage",
				status: 1,
				permission: "",
				type: 2,
				desc: "ECharts图表展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-4",
				name: "calendar",
				title: "日历",
				sort: 4,
				parentId: "menu-components",
				path: "/components/calendar",
				icon: "ProfileOutlined",
				componentPath: "/Demo/CalendarPage",
				status: 1,
				permission: "",
				type: 2,
				desc: "日历组件展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-5",
				name: "icons",
				title: "Icon",
				sort: 5,
				parentId: "menu-components",
				path: "/components/icons",
				icon: "PictureOutlined",
				componentPath: "/Demo/Icons",
				status: 1,
				permission: "",
				type: 2,
				desc: "Icon图标集展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-6",
				name: "video",
				title: "视频播放",
				sort: 6,
				parentId: "menu-components",
				path: "/components/video",
				icon: "VideoCameraOutlined",
				componentPath: "/Demo/Video",
				status: 1,
				permission: "",
				type: 2,
				desc: "视频播放器展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-7",
				name: "count-up",
				title: "数字动效",
				sort: 7,
				parentId: "menu-components",
				path: "/components/count-up",
				icon: "NumberOutlined",
				componentPath: "/Demo/CountUp",
				status: 1,
				permission: "",
				type: 2,
				desc: "数字滚动动画效果",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-8",
				name: "avatar-crop",
				title: "图片裁剪",
				sort: 8,
				parentId: "menu-components",
				path: "/components/avatar-crop",
				icon: "CiOutlined",
				componentPath: "/Demo/AvatarCrop",
				status: 1,
				permission: "",
				type: 2,
				desc: "头像裁剪功能展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-9",
				name: "watermark",
				title: "水印",
				sort: 9,
				parentId: "menu-components",
				path: "/components/watermark",
				icon: "SafetyCertificateOutlined",
				componentPath: "/Demo/Watermark",
				status: 1,
				permission: "",
				type: 2,
				desc: "水印功能展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-10",
				name: "drag",
				title: "拖拽",
				sort: 10,
				parentId: "menu-components",
				path: "/components/drag",
				icon: "DragOutlined",
				componentPath: "/Demo/Drag",
				status: 1,
				permission: "",
				type: 2,
				desc: "拖拽功能展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-comp-12",
				name: "confetti",
				title: "礼花特效",
				sort: 12,
				parentId: "menu-components",
				path: "/components/confetti",
				icon: "GiftOutlined",
				componentPath: "/Demo/Confetti",
				status: 1,
				permission: "",
				type: 2,
				desc: "礼花特效展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
		],
		createTime: "2024-01-01 00:00:00",
	},
	{
		id: "menu-system",
		name: "System",
		title: "系统管理",
		sort: 4,
		parentId: null,
		path: "/system",
		icon: "SettingOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "系统配置与权限管理",
		children: [
			{
				id: "menu-system-1",
				name: "menu",
				title: "菜单管理",
				sort: 1,
				parentId: "menu-system",
				path: "/system/menu",
				icon: "MenuOutlined",
				componentPath: "/System/Menu",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统菜单",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-system-2",
				name: "user",
				title: "用户管理",
				sort: 2,
				parentId: "menu-system",
				path: "/system/user",
				icon: "UserOutlined",
				componentPath: "/System/User",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统用户",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-system-3",
				name: "role",
				title: "角色管理",
				sort: 3,
				parentId: "menu-system",
				path: "/system/role",
				icon: "TeamOutlined",
				componentPath: "/System/Role",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统角色",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-system-4",
				name: "post",
				title: "岗位管理",
				sort: 4,
				parentId: "menu-system",
				path: "/system/post",
				icon: "ProfileOutlined",
				componentPath: "/System/Post",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统岗位",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-system-5",
				name: "dict",
				title: "字典管理",
				sort: 5,
				parentId: "menu-system",
				path: "/system/dict",
				icon: "BookOutlined",
				componentPath: "/System/Dict",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统字典",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-system-6",
				name: "login-log",
				title: "登录日志",
				sort: 6,
				parentId: "menu-system",
				path: "/system/login-log",
				icon: "BellOutlined",
				componentPath: "/System/LoginLog",
				status: 1,
				permission: "",
				type: 2,
				desc: "查看用户登录日志",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-system-7",
				name: "operation-log",
				title: "操作日志",
				sort: 7,
				parentId: "menu-system",
				path: "/system/operation-log",
				icon: "FileTextOutlined",
				componentPath: "/System/OperationLog",
				status: 1,
				permission: "",
				type: 2,
				desc: "查看用户操作日志",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-system-8",
				name: "site-config",
				title: "网站配置",
				sort: 8,
				parentId: "menu-system",
				path: "/system/site-config",
				icon: "GlobalOutlined",
				componentPath: "/System/SiteConfig",
				status: 1,
				permission: "",
				type: 2,
				desc: "网站全局配置",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
		],
		createTime: "2024-01-01 00:00:00",
	},
];

// 从菜单树中删除节点
function removeMenuNode(tree: any[], id: string): boolean {
	const index = tree.findIndex((n) => n.id === id);
	if (index !== -1) {
		tree.splice(index, 1);
		return true;
	}
	for (const node of tree) {
		if (node.children?.length && removeMenuNode(node.children, id)) {
			return true;
		}
	}
	return false;
}

// 在父节点下添加子节点
function addMenuNode(tree: any[], parentId: string | null, node: any): boolean {
	if (!parentId) {
		tree.push(node);
		return true;
	}
	for (const n of tree) {
		if (n.id === parentId) {
			if (!n.children) n.children = [];
			n.children.push(node);
			return true;
		}
		if (n.children?.length && addMenuNode(n.children, parentId, node)) {
			return true;
		}
	}
	return false;
}

// 更新菜单树中的节点
function updateMenuNode(tree: any[], id: string, updates: any): boolean {
	for (let i = 0; i < tree.length; i++) {
		if (tree[i].id === id) {
			// 如果 parentId 变化，需要移动节点
			if (
				updates.parentId !== undefined &&
				updates.parentId !== tree[i].parentId
			) {
				const node = { ...tree[i], ...updates };
				tree.splice(i, 1);
				addMenuNode(tree, updates.parentId, node);
				return true;
			}
			Object.assign(tree[i], updates);
			return true;
		}
		if (
			tree[i].children?.length &&
			updateMenuNode(tree[i].children, id, updates)
		) {
			return true;
		}
	}
	return false;
}

// ===== 用户 Mock 数据 =====
const MOCK_USERS = Array.from({ length: 30 }, (_, i) => ({
	id: `user-${String(i + 1).padStart(3, "0")}`,
	username: `user${i + 1}`,
	nickname:
		[
			"张三",
			"李四",
			"王五",
			"赵六",
			"陈七",
			"刘八",
			"周九",
			"吴十",
			"郑一",
			"钱二",
		][i % 10] + (i > 9 ? String(Math.floor(i / 10) + 1) : ""),
	email: `user${i + 1}@example.com`,
	phone: `138${String(10000000 + i).slice(0, 8)}`,
	role: ["admin", "editor", "viewer"][i % 3],
	status: (i % 5 === 0 ? 0 : 1) as 1 | 0,
	createTime: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")} 10:00:00`,
}));

// ===== 角色 Mock 数据 =====
const MOCK_ROLES = [
	{
		id: "role-1",
		name: "管理员",
		code: "admin",
		sort: 1,
		status: 1 as const,
		desc: "系统管理员，拥有所有权限",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "role-2",
		name: "编辑员",
		code: "editor",
		sort: 2,
		status: 1 as const,
		desc: "可编辑内容，管理用户",
		createTime: "2024-01-15 10:30:00",
	},
	{
		id: "role-3",
		name: "观察员",
		code: "viewer",
		sort: 3,
		status: 1 as const,
		desc: "只读权限，可查看数据",
		createTime: "2024-02-01 14:00:00",
	},
	{
		id: "role-4",
		name: "审计员",
		code: "auditor",
		sort: 4,
		status: 0 as const,
		desc: "审计日志和操作记录",
		createTime: "2024-03-10 09:00:00",
	},
];

// ---- Home Dashboard Mock Data ----

const STAT_CARD_DATA = [
	{
		id: "1",
		title: "总销售额",
		value: 126560,
		prefix: "¥",
		tooltip: "统计周期内所有订单的总销售金额",
		sparklineType: "line",
		sparklineData: [
			4200, 3800, 5100, 4600, 5300, 4900, 5600, 5200, 5800, 6100, 5900, 6200,
			5800, 6300, 6000, 6500, 6200, 6800, 6400, 7000,
		],
	},
	{
		id: "2",
		title: "总访问量",
		value: 88466,
		tooltip: "统计周期内页面总访问次数（UV）",
		sparklineType: "bar",
		sparklineData: [
			3200, 2800, 3600, 3100, 3800, 3400, 4100, 3700, 4300, 3900, 4400, 4000,
			4200, 3800, 4500, 4100, 4600, 4200, 4700, 4300,
		],
		sparklineColor: "#13c2c2",
	},
	{
		id: "3",
		title: "总订单数",
		value: 12546,
		tooltip: "统计周期内成功下单的总订单数量",
		sparklineType: "line",
		sparklineData: [
			420, 380, 450, 410, 470, 430, 490, 460, 510, 480, 520, 490, 500, 470, 530,
			500, 540, 510, 550, 520,
		],
	},
	{
		id: "4",
		title: "转化率",
		value: 14.2,
		suffix: "%",
		tooltip: "访问用户中实际完成下单的占比",
		sparklineType: "progress",
		sparklineData: [14.2],
		sparklineColor: "#52c41a",
	},
	{
		id: "5",
		title: "活跃用户",
		value: 32889,
		tooltip: "统计周期内有操作行为的独立用户数",
		sparklineType: "bar",
		sparklineData: [
			1200, 1100, 1350, 1250, 1400, 1300, 1450, 1380, 1500, 1420, 1520, 1480,
			1460, 1400, 1550, 1500, 1580, 1520, 1600, 1550,
		],
	},
	{
		id: "6",
		title: "平均客单价",
		value: 126.5,
		prefix: "¥",
		tooltip: "总销售额除以总订单数得出的平均每单金额",
		sparklineType: "line",
		sparklineData: [
			108, 112, 115, 118, 120, 119, 122, 125, 123, 126, 124, 127, 125, 128, 126,
			129, 127, 130, 128, 126,
		],
		sparklineColor: "#fa8c16",
	},
];

const HORIZONTAL_BAR_DATA = [
	{ name: "电子产品", value: 45230 },
	{ name: "服装鞋帽", value: 38120 },
	{ name: "家居用品", value: 29850 },
	{ name: "美妆护肤", value: 24560 },
	{ name: "食品饮料", value: 21340 },
	{ name: "运动户外", value: 18200 },
];

const DONUT_DATA = [
	{ name: "直接访问", value: 335 },
	{ name: "搜索引擎", value: 280 },
	{ name: "社交媒体", value: 210 },
	{ name: "邮件营销", value: 125 },
	{ name: "其他渠道", value: 50 },
];

const GAUGE_VALUE = 72.5;

function getDateLabels(preset: string): string[] {
	switch (preset) {
		case "today": {
			const hours: string[] = [];
			for (let i = 0; i < 24; i++)
				hours.push(`${String(i).padStart(2, "0")}:00`);
			return hours;
		}
		case "week": {
			const days: string[] = [];
			for (let i = 6; i >= 0; i--) {
				const d = new Date(2026, 4, 18 - i);
				days.push(
					`${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
				);
			}
			return days;
		}
		case "month": {
			const days: string[] = [];
			for (let i = 29; i >= 0; i--) {
				const d = new Date(2026, 4, 18 - i);
				days.push(
					`${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
				);
			}
			return days;
		}
		case "year": {
			const months: string[] = [];
			for (let i = 0; i < 12; i++)
				months.push(`2025/${String(i + 1).padStart(2, "0")}`);
			return months;
		}
		default:
			return [];
	}
}

function generateAnalysisData(preset: string) {
	const labels = getDateLabels(preset);
	const multiplier =
		preset === "today"
			? 1
			: preset === "week"
				? 10
				: preset === "month"
					? 7
					: 280;
	return labels.map((label) => {
		const r = Math.random();
		const r2 = Math.random();
		const r3 = Math.random();
		const baseRevenue = (3000 + r * 4000) * multiplier;
		const regUsers = Math.round((30 + r2 * 50) * multiplier);
		const payUsers = Math.round(regUsers * (0.15 + r3 * 0.35));
		const convRate =
			regUsers > 0 ? Math.round((payUsers / regUsers) * 1000) / 10 : 0;
		return {
			date: label,
			revenue: Math.round(baseRevenue),
			registeredUsers: regUsers,
			payingUsers: payUsers,
			conversionRate: convRate,
		};
	});
}

function generateRankingData(preset: string) {
	const labels = getDateLabels(preset);
	const items = labels.slice(0, 7).map((label) => {
		const r = Math.random();
		const base =
			preset === "today"
				? 800 + r * 2000
				: preset === "week"
					? 8000 + r * 20000
					: preset === "month"
						? 5000 + r * 15000
						: 60000 + r * 180000;
		return {
			rank: 0,
			label,
			value: Math.round(base),
			secondaryValue: Math.round((20 + Math.random() * 75) * 10) / 10,
		};
	});
	items.sort((a, b) => b.value - a.value);
	items.forEach((item, i) => {
		item.rank = i + 1;
	});
	return items;
}

function generateLineData() {
	const hours = Array.from(
		{ length: 24 },
		(_, i) => `${String(i).padStart(2, "0")}:00`,
	);
	return hours.map((time, i) => {
		const base = 200 + Math.random() * 300;
		const noise = Math.sin(i * 0.5) * 50;
		return { time, value: Math.round(base + noise) };
	});
}

export default [
	// 登录
	{
		url: "/system/api/User/login",
		method: "post",
		response: ({
			body,
		}: {
			body: { loginName?: string; loginPwd?: string };
		}) => {
			if (body.loginName === "admin" && body.loginPwd === "123456") {
				return {
					code: 200,
					data: {
						userId: "mock-user-001",
						accessToken: "mock-access-token-" + Date.now(),
						refreshToken: "mock-refresh-token-" + Date.now(),
						nickname: body.loginName || "Mock User",
					},
				};
			}
			return {
				code: 400,
				message: "用户名或密码错误",
			};
		},
	},
	// 获取权限（用户信息 + 菜单）
	{
		url: "/system/api/User/permission",
		method: "get",
		response: () => {
			return {
				code: 200,
				data: {
					user: {
						id: "mock-user-001",
						name: "管理员",
						avatar: "",
						email: "admin@yang.com",
						phone: "13800138000",
						role: "admin",
					},
					menus: JSON.parse(JSON.stringify(MOCK_MENUS_TREE)),
				},
			};
		},
	},
	// Home Dashboard
	{
		url: "/home/dashboard",
		method: "get",
		response: () => ({
			code: 200,
			data: {
				statCards: STAT_CARD_DATA,
				horizontalBar: HORIZONTAL_BAR_DATA,
				donut: DONUT_DATA,
				gaugeValue: GAUGE_VALUE,
				lineData: generateLineData(),
			},
		}),
	},
	// Home Analysis
	{
		url: "/home/analysis",
		method: "get",
		response: ({ query }: { query: { preset?: string } }) => {
			const preset = query.preset || "week";
			return {
				code: 200,
				data: {
					analysisData: generateAnalysisData(preset),
					rankingData: generateRankingData(preset),
				},
			};
		},
	},
	// ===== 菜单管理 CRUD =====
	{
		url: "/system/api/Menu/list",
		method: "get",
		response: () => ({
			code: 200,
			data: MOCK_MENUS_TREE,
		}),
	},
	{
		url: "/system/api/Menu/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			const { id, ...menuData } = body;
			if (id) {
				updateMenuNode(MOCK_MENUS_TREE, id, menuData);
			} else {
				const newId = `menu-new-${Date.now()}`;
				const newNode = {
					...menuData,
					id: newId,
					children: menuData.type === 1 ? [] : undefined,
					createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
				};
				addMenuNode(MOCK_MENUS_TREE, menuData.parentId || null, newNode);
			}
			return {
				code: 200,
				data: { id: id || `menu-new-${Date.now()}` },
				message: "保存成功",
			};
		},
	},
	{
		url: "/system/api/Menu/delete",
		method: "delete",
		response: ({ query }: { query: { id: string } }) => {
			removeMenuNode(MOCK_MENUS_TREE, query.id);
			return { code: 200, message: "删除成功" };
		},
	},
	// ===== 用户管理 CRUD =====
	{
		url: "/system/api/User/list",
		method: "get",
		response: ({
			query,
		}: {
			query: {
				pageNumber?: string;
				pageSize?: string;
				username?: string;
				status?: string;
			};
		}) => {
			let list = [...MOCK_USERS];
			if (query.username)
				list = list.filter((u: any) => u.username.includes(query.username!));
			if (query.status)
				list = list.filter((u: any) => String(u.status) === query.status);
			const page = Number(query.pageNumber) || 1;
			const size = Number(query.pageSize) || 20;
			const start = (page - 1) * size;
			return {
				code: 200,
				data: { data: list.slice(start, start + size), total: list.length },
			};
		},
	},
	{
		url: "/system/api/User/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			const { id, ...userData } = body;
			if (id) {
				const idx = MOCK_USERS.findIndex((u: any) => u.id === id);
				if (idx !== -1) Object.assign(MOCK_USERS[idx], userData);
			} else {
				MOCK_USERS.unshift({
					id: `user-${Date.now()}`,
					...userData,
					createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
				});
			}
			return { code: 200, message: "保存成功" };
		},
	},
	{
		url: "/system/api/User/delete",
		method: "delete",
		response: ({ query }: { query: { id: string } }) => {
			const idx = MOCK_USERS.findIndex((u: any) => u.id === query.id);
			if (idx !== -1) MOCK_USERS.splice(idx, 1);
			return { code: 200, message: "删除成功" };
		},
	},
	// ===== 角色管理 CRUD =====
	{
		url: "/system/api/Role/list",
		method: "get",
		response: ({
			query,
		}: {
			query: {
				pageNumber?: string;
				pageSize?: string;
				name?: string;
				status?: string;
			};
		}) => {
			let list = [...MOCK_ROLES];
			if (query.name)
				list = list.filter((r: any) => r.name.includes(query.name!));
			if (query.status)
				list = list.filter((r: any) => String(r.status) === query.status);
			const page = Number(query.pageNumber) || 1;
			const size = Number(query.pageSize) || 20;
			const start = (page - 1) * size;
			return {
				code: 200,
				data: { data: list.slice(start, start + size), total: list.length },
			};
		},
	},
	{
		url: "/system/api/Role/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			const { id, ...roleData } = body;
			if (id) {
				const idx = MOCK_ROLES.findIndex((r: any) => r.id === id);
				if (idx !== -1) Object.assign(MOCK_ROLES[idx], roleData);
			} else {
				MOCK_ROLES.push({
					id: `role-${Date.now()}`,
					...roleData,
					createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
				});
			}
			return { code: 200, message: "保存成功" };
		},
	},
	{
		url: "/system/api/Role/delete",
		method: "delete",
		response: ({ query }: { query: { id: string } }) => {
			const idx = MOCK_ROLES.findIndex((r: any) => r.id === query.id);
			if (idx !== -1) MOCK_ROLES.splice(idx, 1);
			return { code: 200, message: "删除成功" };
		},
	},
] as MockMethod[];
