import type { MockMethod } from "@meadmin-cn/vite-plugin-mock";

// ===== 菜单 Mock 数据（从权限接口提取） =====
// 8 个一级菜单分类：数据看板、表单页面、表格页面、数据展示、交互组件、权限管理、组织架构、系统管理
const MOCK_MENUS_TREE = [
	// ========== 1. 数据看板 ==========
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
	// ========== 2. 表单页面 ==========
	{
		id: "menu-forms",
		name: "Forms",
		title: "表单 & 表格",
		sort: 2,
		parentId: null,
		path: "/forms",
		icon: "FormOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "各类表单示例",
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
				desc: "基础表单示例",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-forms-2",
				name: "step-form",
				title: "分步表单",
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
				id: "menu-table-1",
				name: "basic-table",
				title: "基础表格",
				sort: 1,
				parentId: "menu-table",
				path: "/table/basic",
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
	// ========== 4. 数据展示 ==========
	{
		id: "menu-data-display",
		name: "DataDisplay",
		title: "数据展示",
		sort: 4,
		parentId: null,
		path: "/data-display",
		icon: "DatabaseFilled",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "图表与数据可视化组件",
		children: [
			{
				id: "menu-dd-1",
				name: "card-list",
				title: "卡片",
				sort: 1,
				parentId: "menu-data-display",
				path: "/data-display/card-list",
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
				id: "menu-dd-2",
				name: "banner",
				title: "Banner",
				sort: 2,
				parentId: "menu-data-display",
				path: "/data-display/banner",
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
				id: "menu-dd-3",
				name: "charts",
				title: "图表",
				sort: 3,
				parentId: "menu-data-display",
				path: "/data-display/charts",
				icon: "BookOutlined",
				componentPath: "/Demo/ChartsPage",
				status: 1,
				permission: "",
				type: 2,
				desc: "ECharts图表展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-dd-4",
				name: "calendar",
				title: "日历",
				sort: 4,
				parentId: "menu-data-display",
				path: "/data-display/calendar",
				icon: "CodepenOutlined",
				componentPath: "/Demo/CalendarPage",
				status: 1,
				permission: "",
				type: 2,
				desc: "日历组件展示",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-dd-5",
				name: "count-up",
				title: "数字动效",
				sort: 5,
				parentId: "menu-data-display",
				path: "/data-display/count-up",
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
				id: "menu-dd-6",
				name: "confetti",
				title: "礼花特效",
				sort: 6,
				parentId: "menu-data-display",
				path: "/data-display/confetti",
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
	// ========== 5. 交互组件 ==========
	{
		id: "menu-components",
		name: "Components",
		title: "交互组件",
		sort: 5,
		parentId: null,
		path: "/components",
		icon: "RocketOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "交互与工具类组件",
		children: [
			{
				id: "menu-comp-1",
				name: "icons",
				title: "图标",
				sort: 1,
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
				id: "menu-comp-2",
				name: "watermark",
				title: "水印",
				sort: 2,
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
				id: "menu-comp-3",
				name: "drag",
				title: "拖拽",
				sort: 3,
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
				id: "menu-comp-4",
				name: "video",
				title: "视频播放",
				sort: 4,
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
				id: "menu-comp-5",
				name: "avatar-crop",
				title: "图片裁剪",
				sort: 5,
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
				id: "menu-comp-6",
				name: "selector-demo",
				title: "数据选择&查看",
				sort: 6,
				parentId: "menu-components",
				path: "/components/selector-demo",
				icon: "NumberOutlined",
				componentPath: "/Demo/SelectorDemo",
				status: 1,
				permission: "",
				type: 2,
				desc: "数据选择器与查看示例",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
		],
		createTime: "2024-01-01 00:00:00",
	},
	// ========== 6. 权限管理 ==========
	{
		id: "menu-auth",
		name: "Auth",
		title: "权限管理",
		sort: 6,
		parentId: null,
		path: "/auth",
		icon: "LockOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "用户、角色与菜单权限管理",
		children: [
			{
				id: "menu-auth-1",
				name: "user",
				title: "用户管理",
				sort: 1,
				parentId: "menu-auth",
				path: "/auth/user",
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
				id: "menu-auth-2",
				name: "role",
				title: "角色管理",
				sort: 2,
				parentId: "menu-auth",
				path: "/auth/role",
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
				id: "menu-auth-3",
				name: "menu",
				title: "菜单管理",
				sort: 3,
				parentId: "menu-auth",
				path: "/auth/menu",
				icon: "MenuOutlined",
				componentPath: "/System/Menu",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统菜单",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
		],
		createTime: "2024-01-01 00:00:00",
	},
	// ========== 7. 组织架构 ==========
	{
		id: "menu-org",
		name: "Org",
		title: "组织架构",
		sort: 7,
		parentId: null,
		path: "/org",
		icon: "ApartmentOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "部门与岗位组织管理",
		children: [
			{
				id: "menu-org-1",
				name: "department",
				title: "部门管理",
				sort: 1,
				parentId: "menu-org",
				path: "/org/department",
				icon: "CloudOutlined",
				componentPath: "/System/Department",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统部门组织架构",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
			{
				id: "menu-org-2",
				name: "post",
				title: "岗位管理",
				sort: 2,
				parentId: "menu-org",
				path: "/org/post",
				icon: "ProfileOutlined",
				componentPath: "/System/Post",
				status: 1,
				permission: "",
				type: 2,
				desc: "管理系统岗位",
				children: [],
				createTime: "2024-01-01 00:00:00",
			},
		],
		createTime: "2024-01-01 00:00:00",
	},
	// ========== 8. 系统管理 ==========
	{
		id: "menu-system",
		name: "System",
		title: "系统管理",
		sort: 8,
		parentId: null,
		path: "/system",
		icon: "SettingOutlined",
		componentPath: "",
		status: 1,
		permission: "",
		type: 1,
		desc: "系统配置与日志管理",
		children: [
			{
				id: "menu-system-1",
				name: "login-log",
				title: "登录日志",
				sort: 1,
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
				id: "menu-system-2",
				name: "operation-log",
				title: "操作日志",
				sort: 2,
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
				id: "menu-system-3",
				name: "dict",
				title: "字典管理",
				sort: 3,
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
				id: "menu-system-4",
				name: "site-config",
				title: "网站配置",
				sort: 4,
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

// ===== 角色权限 Mock 数据（roleId → menuIds） =====
const ALL_MENU_IDS = [
	// 数据看板
	"menu-001",
	// 表单页面
	"menu-forms",
	"menu-forms-1",
	"menu-forms-2",
	// 表格页面
	"menu-table",
	"menu-table-1",
	// 数据展示
	"menu-data-display",
	"menu-dd-1",
	"menu-dd-2",
	"menu-dd-3",
	"menu-dd-4",
	"menu-dd-5",
	"menu-dd-6",
	// 交互组件
	"menu-components",
	"menu-comp-1",
	"menu-comp-2",
	"menu-comp-3",
	"menu-comp-4",
	"menu-comp-5",
	"menu-comp-6",
	// 权限管理
	"menu-auth",
	"menu-auth-1",
	"menu-auth-2",
	"menu-auth-3",
	// 组织架构
	"menu-org",
	"menu-org-1",
	"menu-org-2",
	// 系统管理
	"menu-system",
	"menu-system-1",
	"menu-system-2",
	"menu-system-3",
	"menu-system-4",
];

const MOCK_ROLE_PERMISSIONS: Record<string, string[]> = {
	"role-1": ALL_MENU_IDS, // 管理员：拥有所有权限
	"role-2": [
		// 编辑员：数据看板 + 表单 + 表格 + 数据展示 + 交互组件
		"menu-001",
		"menu-forms",
		"menu-forms-1",
		"menu-forms-2",
		"menu-table",
		"menu-table-1",
		"menu-data-display",
		"menu-dd-1",
		"menu-dd-2",
		"menu-dd-3",
		"menu-dd-4",
		"menu-dd-5",
		"menu-dd-6",
		"menu-components",
		"menu-comp-1",
		"menu-comp-2",
		"menu-comp-3",
		"menu-comp-4",
		"menu-comp-5",
		"menu-comp-6",
	],
	"role-3": ["menu-001"], // 观察员：仅数据看板
};

// ===== 岗位 Mock 数据 =====
const MOCK_POSTS = [
	{
		id: "post-1",
		name: "董事长",
		code: "chairman",
		sort: 1,
		status: 1 as const,
		desc: "公司最高决策者",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "post-2",
		name: "总经理",
		code: "ceo",
		sort: 2,
		status: 1 as const,
		desc: "负责公司日常运营",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "post-3",
		name: "副总经理",
		code: "vp",
		sort: 3,
		status: 1 as const,
		desc: "协助总经理管理",
		createTime: "2024-01-15 09:00:00",
	},
	{
		id: "post-4",
		name: "部门经理",
		code: "manager",
		sort: 4,
		status: 1 as const,
		desc: "部门日常管理",
		createTime: "2024-02-01 10:00:00",
	},
	{
		id: "post-5",
		name: "主管",
		code: "supervisor",
		sort: 5,
		status: 1 as const,
		desc: "团队管理与协调",
		createTime: "2024-02-15 11:00:00",
	},
	{
		id: "post-6",
		name: "高级工程师",
		code: "senior-engineer",
		sort: 6,
		status: 1 as const,
		desc: "核心技术开发",
		createTime: "2024-03-01 14:00:00",
	},
	{
		id: "post-7",
		name: "初级工程师",
		code: "junior-engineer",
		sort: 7,
		status: 1 as const,
		desc: "基础开发工作",
		createTime: "2024-03-15 15:00:00",
	},
	{
		id: "post-8",
		name: "实习生",
		code: "intern",
		sort: 8,
		status: 0 as const,
		desc: "实习岗位（已冻结）",
		createTime: "2024-04-01 16:00:00",
	},
];

// ===== 字典管理 Mock 数据 =====
const MOCK_DICT_TYPES = [
	{
		id: "dict-type-1",
		name: "用户性别",
		code: "user_gender",
		sort: 1,
		status: 1 as const,
		desc: "用户性别字典",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dict-type-2",
		name: "通用状态",
		code: "common_status",
		sort: 2,
		status: 1 as const,
		desc: "启用/禁用通用状态",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dict-type-3",
		name: "部门类型",
		code: "dept_type",
		sort: 3,
		status: 1 as const,
		desc: "组织部门分类",
		createTime: "2024-01-15 10:00:00",
	},
	{
		id: "dict-type-4",
		name: "标签颜色",
		code: "tag_color",
		sort: 4,
		status: 0 as const,
		desc: "标签颜色枚举（已停用）",
		createTime: "2024-02-01 14:00:00",
	},
];

const MOCK_DICT_DATA = [
	{
		id: "dict-data-1",
		dictTypeId: "dict-type-1",
		label: "男",
		value: "male",
		sort: 1,
		status: 1 as const,
		desc: "",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dict-data-2",
		dictTypeId: "dict-type-1",
		label: "女",
		value: "female",
		sort: 2,
		status: 1 as const,
		desc: "",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dict-data-3",
		dictTypeId: "dict-type-1",
		label: "未知",
		value: "unknown",
		sort: 3,
		status: 1 as const,
		desc: "",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dict-data-4",
		dictTypeId: "dict-type-2",
		label: "启用",
		value: "1",
		sort: 1,
		status: 1 as const,
		desc: "正常使用中",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dict-data-5",
		dictTypeId: "dict-type-2",
		label: "禁用",
		value: "0",
		sort: 2,
		status: 1 as const,
		desc: "已停用",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dict-data-6",
		dictTypeId: "dict-type-3",
		label: "研发部",
		value: "dev",
		sort: 1,
		status: 1 as const,
		desc: "",
		createTime: "2024-01-15 10:00:00",
	},
	{
		id: "dict-data-7",
		dictTypeId: "dict-type-3",
		label: "市场部",
		value: "marketing",
		sort: 2,
		status: 1 as const,
		desc: "",
		createTime: "2024-01-15 10:00:00",
	},
	{
		id: "dict-data-8",
		dictTypeId: "dict-type-3",
		label: "财务部",
		value: "finance",
		sort: 3,
		status: 1 as const,
		desc: "",
		createTime: "2024-01-15 10:00:00",
	},
	{
		id: "dict-data-9",
		dictTypeId: "dict-type-3",
		label: "人事部",
		value: "hr",
		sort: 4,
		status: 1 as const,
		desc: "",
		createTime: "2024-01-15 10:00:00",
	},
	{
		id: "dict-data-10",
		dictTypeId: "dict-type-4",
		label: "蓝色",
		value: "blue",
		sort: 1,
		status: 1 as const,
		desc: "",
		createTime: "2024-02-01 14:00:00",
	},
	{
		id: "dict-data-11",
		dictTypeId: "dict-type-4",
		label: "绿色",
		value: "green",
		sort: 2,
		status: 1 as const,
		desc: "",
		createTime: "2024-02-01 14:00:00",
	},
];

// ===== 登录日志 Mock 数据 =====

// ===== 部门管理 Mock 数据 =====
const MOCK_DEPARTMENTS: any[] = [
	{
		id: "dept-1",
		name: "公司总部",
		code: "headquarters",
		sort: 1,
		parentId: null,
		status: 1 as const,
		desc: "公司总部",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dept-2",
		name: "技术部",
		code: "tech",
		sort: 1,
		parentId: "dept-1",
		status: 1 as const,
		desc: "负责技术研发",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dept-3",
		name: "市场部",
		code: "marketing",
		sort: 2,
		parentId: "dept-1",
		status: 1 as const,
		desc: "负责市场营销与推广",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dept-4",
		name: "财务部",
		code: "finance",
		sort: 3,
		parentId: "dept-1",
		status: 1 as const,
		desc: "负责财务管理",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dept-5",
		name: "人事部",
		code: "hr",
		sort: 4,
		parentId: "dept-1",
		status: 1 as const,
		desc: "负责人力资源管理",
		createTime: "2024-01-01 08:00:00",
	},
	{
		id: "dept-6",
		name: "前端组",
		code: "frontend",
		sort: 1,
		parentId: "dept-2",
		status: 1 as const,
		desc: "Web 前端开发",
		createTime: "2024-01-15 09:00:00",
	},
	{
		id: "dept-7",
		name: "后端组",
		code: "backend",
		sort: 2,
		parentId: "dept-2",
		status: 1 as const,
		desc: "后端服务开发",
		createTime: "2024-01-15 09:00:00",
	},
	{
		id: "dept-8",
		name: "测试组",
		code: "qa",
		sort: 3,
		parentId: "dept-2",
		status: 1 as const,
		desc: "质量保障与测试",
		createTime: "2024-01-15 09:00:00",
	},
	{
		id: "dept-9",
		name: "品牌组",
		code: "brand",
		sort: 1,
		parentId: "dept-3",
		status: 1 as const,
		desc: "品牌建设与维护",
		createTime: "2024-02-01 10:00:00",
	},
	{
		id: "dept-10",
		name: "渠道组",
		code: "channel",
		sort: 2,
		parentId: "dept-3",
		status: 0 as const,
		desc: "渠道拓展（已停用）",
		createTime: "2024-02-01 10:00:00",
	},
];

const MOCK_LOGIN_LOGS = Array.from({ length: 25 }, (_, i) => {
	const users = ["admin", "zhangsan", "lisi", "wangwu", "zhaoliu"];
	const browsers = ["Chrome 120", "Firefox 121", "Safari 17", "Edge 120"];
	const osList = ["Windows 11", "macOS 14", "iOS 17", "Android 14"];
	const locations = ["北京市", "上海市", "广州市", "深圳市", "杭州市"];
	const isSuccess = i % 7 !== 0;
	const month = ((i % 6) + 1).toString().padStart(2, "0");
	const day = ((i % 28) + 1).toString().padStart(2, "0");
	return {
		id: `login-log-${String(i + 1).padStart(3, "0")}`,
		username: users[i % users.length],
		ip: `192.168.${Math.floor(i / 5) + 1}.${(i % 255) + 1}`,
		location: locations[i % locations.length],
		browser: browsers[i % browsers.length],
		os: osList[i % osList.length],
		status: (isSuccess ? 1 : 0) as 1 | 0,
		message: isSuccess ? "登录成功" : "密码错误",
		loginTime: `2024-${month}-${day} ${String(i % 24).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`,
	};
});

// ===== 操作日志 Mock 数据 =====
const MOCK_OPERATION_LOGS = Array.from({ length: 30 }, (_, i) => {
	const operators = ["admin", "zhangsan", "lisi", "wangwu"];
	const modules = [
		"用户管理",
		"角色管理",
		"菜单管理",
		"岗位管理",
		"字典管理",
		"系统配置",
	];
	const actions = ["新增", "编辑", "删除", "导出", "导入", "启用", "禁用"];
	const targets = [
		"用户 admin",
		"角色 管理员",
		"菜单 数据看板",
		"岗位 部门经理",
		"字典 通用状态",
		"系统配置",
	];
	const isSuccess = i % 9 !== 0;
	const month = ((i % 6) + 1).toString().padStart(2, "0");
	const day = ((i % 28) + 1).toString().padStart(2, "0");
	return {
		id: `op-log-${String(i + 1).padStart(3, "0")}`,
		operator: operators[i % operators.length],
		module: modules[i % modules.length],
		action: actions[i % actions.length],
		target: targets[i % targets.length],
		ip: `192.168.${Math.floor(i / 10) + 1}.${(i % 255) + 1}`,
		status: (isSuccess ? 1 : 0) as 1 | 0,
		detail: isSuccess ? "操作成功" : "权限不足，操作被拒绝",
		operationTime: `2024-${month}-${day} ${String(i % 24).padStart(2, "0")}:${String((i * 11) % 60).padStart(2, "0")}:${String((i * 17) % 60).padStart(2, "0")}`,
	};
});

// ===== 网站配置 Mock 数据 =====
const MOCK_SITE_CONFIG = {
	id: "site-config-1",
	siteName: "Luminous Admin",
	logo: "",
	favicon: "",
	keywords: "React,Ant Design,Admin,管理系统",
	description: "基于 React + Ant Design 的后台管理系统模板",
	copyright: "© 2024 Luminous Admin. All rights reserved.",
	icp: "京ICP备12345678号",
	contactEmail: "admin@luminous.com",
};

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
	// ===== 角色权限 =====
	{
		url: "/system/api/Role/permission",
		method: "get",
		response: ({ query }: { query: { roleId?: string } }) => {
			const menuIds = MOCK_ROLE_PERMISSIONS[query.roleId ?? ""] ?? [];
			return { code: 200, data: { menuIds } };
		},
	},
	{
		url: "/system/api/Role/permission/save",
		method: "post",
		response: ({ body }: { body: { roleId: string; menuIds: string[] } }) => {
			MOCK_ROLE_PERMISSIONS[body.roleId] = body.menuIds ?? [];
			return { code: 200, message: "权限设置成功" };
		},
	},

	// ===== 岗位管理 CRUD =====
	{
		url: "/system/api/Post/list",
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
			let list = [...MOCK_POSTS];
			if (query.name)
				list = list.filter((p: any) => p.name.includes(query.name!));
			if (query.status)
				list = list.filter((p: any) => String(p.status) === query.status);
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
		url: "/system/api/Post/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			const { id, ...data } = body;
			if (id) {
				const idx = MOCK_POSTS.findIndex((p: any) => p.id === id);
				if (idx !== -1) Object.assign(MOCK_POSTS[idx], data);
			} else {
				MOCK_POSTS.push({
					id: `post-${Date.now()}`,
					...data,
					createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
				});
			}
			return { code: 200, message: "保存成功" };
		},
	},
	{
		url: "/system/api/Post/delete",
		method: "delete",
		response: ({ query }: { query: { id: string } }) => {
			const idx = MOCK_POSTS.findIndex((p: any) => p.id === query.id);
			if (idx !== -1) MOCK_POSTS.splice(idx, 1);
			return { code: 200, message: "删除成功" };
		},
	},
	// ===== 字典类型 CRUD =====
	{
		url: "/system/api/DictType/list",
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
			let list = [...MOCK_DICT_TYPES];
			if (query.name)
				list = list.filter((d: any) => d.name.includes(query.name!));
			if (query.status)
				list = list.filter((d: any) => String(d.status) === query.status);
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
		url: "/system/api/DictType/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			const { id, ...data } = body;
			if (id) {
				const idx = MOCK_DICT_TYPES.findIndex((d: any) => d.id === id);
				if (idx !== -1) Object.assign(MOCK_DICT_TYPES[idx], data);
			} else {
				MOCK_DICT_TYPES.push({
					id: `dict-type-${Date.now()}`,
					...data,
					createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
				});
			}
			return { code: 200, message: "保存成功" };
		},
	},
	{
		url: "/system/api/DictType/delete",
		method: "delete",
		response: ({ query }: { query: { id: string } }) => {
			const idx = MOCK_DICT_TYPES.findIndex((d: any) => d.id === query.id);
			if (idx !== -1) MOCK_DICT_TYPES.splice(idx, 1);
			return { code: 200, message: "删除成功" };
		},
	},
	// ===== 字典数据 CRUD =====
	{
		url: "/system/api/DictData/list",
		method: "get",
		response: ({
			query,
		}: {
			query: {
				pageNumber?: string;
				pageSize?: string;
				dictTypeId?: string;
				label?: string;
				status?: string;
			};
		}) => {
			let list = [...MOCK_DICT_DATA];
			if (query.dictTypeId)
				list = list.filter((d: any) => d.dictTypeId === query.dictTypeId);
			if (query.label)
				list = list.filter((d: any) => d.label.includes(query.label!));
			if (query.status)
				list = list.filter((d: any) => String(d.status) === query.status);
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
		url: "/system/api/DictData/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			const { id, ...data } = body;
			if (id) {
				const idx = MOCK_DICT_DATA.findIndex((d: any) => d.id === id);
				if (idx !== -1) Object.assign(MOCK_DICT_DATA[idx], data);
			} else {
				MOCK_DICT_DATA.push({
					id: `dict-data-${Date.now()}`,
					...data,
					createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
				});
			}
			return { code: 200, message: "保存成功" };
		},
	},
	{
		url: "/system/api/DictData/delete",
		method: "delete",
		response: ({ query }: { query: { id: string } }) => {
			const idx = MOCK_DICT_DATA.findIndex((d: any) => d.id === query.id);
			if (idx !== -1) MOCK_DICT_DATA.splice(idx, 1);
			return { code: 200, message: "删除成功" };
		},
	},
	// ===== 登录日志（只读） =====
	{
		url: "/system/api/LoginLog/list",
		method: "get",
		response: ({
			query,
		}: {
			query: {
				pageNumber?: string;
				pageSize?: string;
				username?: string;
				ip?: string;
				status?: string;
			};
		}) => {
			let list = [...MOCK_LOGIN_LOGS];
			if (query.username)
				list = list.filter((l: any) => l.username.includes(query.username!));
			if (query.ip) list = list.filter((l: any) => l.ip.includes(query.ip!));
			if (query.status)
				list = list.filter((l: any) => String(l.status) === query.status);
			const page = Number(query.pageNumber) || 1;
			const size = Number(query.pageSize) || 20;
			const start = (page - 1) * size;
			return {
				code: 200,
				data: { data: list.slice(start, start + size), total: list.length },
			};
		},
	},
	// ===== 操作日志（只读） =====
	{
		url: "/system/api/OperationLog/list",
		method: "get",
		response: ({
			query,
		}: {
			query: {
				pageNumber?: string;
				pageSize?: string;
				operator?: string;
				module?: string;
				status?: string;
			};
		}) => {
			let list = [...MOCK_OPERATION_LOGS];
			if (query.operator)
				list = list.filter((l: any) => l.operator.includes(query.operator!));
			if (query.module)
				list = list.filter((l: any) => l.module.includes(query.module!));
			if (query.status)
				list = list.filter((l: any) => String(l.status) === query.status);
			const page = Number(query.pageNumber) || 1;
			const size = Number(query.pageSize) || 20;
			const start = (page - 1) * size;
			return {
				code: 200,
				data: { data: list.slice(start, start + size), total: list.length },
			};
		},
	},
	// ===== 网站配置 =====
	{
		url: "/system/api/SiteConfig/detail",
		method: "get",
		response: () => ({ code: 200, data: MOCK_SITE_CONFIG }),
	},
	{
		url: "/system/api/SiteConfig/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			Object.assign(MOCK_SITE_CONFIG, body);
			return { code: 200, message: "保存成功" };
		},
	},

	// ===== 部门管理 =====
	{
		url: "/system/api/Department/list",
		method: "get",
		response: () => ({
			code: 200,
			data: MOCK_DEPARTMENTS,
		}),
	},
	{
		url: "/system/api/Department/save",
		method: "post",
		response: ({ body }: { body: any }) => {
			const { id, ...data } = body;
			if (id) {
				const findAndUpdate = (list: any[]) => {
					for (const item of list) {
						if (item.id === id) {
							Object.assign(item, data);
							return true;
						}
					}
					return false;
				};
				findAndUpdate(MOCK_DEPARTMENTS);
			} else {
				MOCK_DEPARTMENTS.push({
					id: `dept-${Date.now()}`,
					...data,
					createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
				});
			}
			return { code: 200, message: "保存成功" };
		},
	},
	{
		url: "/system/api/Department/delete",
		method: "delete",
		response: ({ query }: { query: { id: string } }) => {
			const removeDept = (list: any[]): boolean => {
				const idx = list.findIndex((d: any) => d.id === query.id);
				if (idx !== -1) {
					list.splice(idx, 1);
					return true;
				}
				return false;
			};
			removeDept(MOCK_DEPARTMENTS);
			return { code: 200, message: "删除成功" };
		},
	},
] as MockMethod[];
