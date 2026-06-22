export namespace IApi {
	// 登录请求参数
	interface LoginReq {
		loginName: string;
		loginPwd: string;
	}

	// 登录响应
	interface LoginRes {
		userId: string;
		accessToken: string;
		refreshToken: string;
		nickname: string;
	}

	interface UserInfo {
		id: string;
		name: string;
		avatar?: string;
		email?: string;
		phone?: string;
		role?: string;
	}

	// 菜单项（完整字段）
	interface MenuItem {
		id: string;
		name: string;
		title: string;
		sort: number;
		parentId: string | null;
		path: string;
		icon: string;
		componentPath: string;
		status: 1 | 0; // 1 启用；0 关闭
		permission: string;
		type: 1 | 2; // 1 菜单；2 按钮；
		desc: string;
		children?: MenuItem[];
		createTime: string;
	}

	// 菜单请求参数（新增/编辑）
	interface MenuReq extends Omit<MenuItem, "id" | "createTime" | "children"> {
		id?: string;
	}

	interface PermissionRes {
		user: UserInfo;
		menus: MenuItem[];
	}

	// Home 仪表盘
	interface StatCardItem {
		id: string;
		title: string;
		value: number;
		prefix?: string;
		suffix?: string;
		tooltip: string;
		sparklineType: "line" | "bar" | "progress";
		sparklineData: number[];
		sparklineColor?: string;
	}

	interface HomeDashboardRes {
		statCards: StatCardItem[];
		horizontalBar: { name: string; value: number }[];
		donut: { name: string; value: number }[];
		gaugeValue: number;
		lineData: { time: string; value: number }[];
	}

	interface AnalysisDataPoint {
		date: string;
		revenue: number;
		registeredUsers: number;
		payingUsers: number;
		conversionRate: number;
	}

	interface RankingItem {
		rank: number;
		label: string;
		value: number;
		secondaryValue?: number;
	}

	interface HomeAnalysisRes {
		analysisData: AnalysisDataPoint[];
		rankingData: RankingItem[];
	}

	// 用户管理
	interface UserItem {
		id: string;
		username: string;
		nickname: string;
		email: string;
		phone: string;
		role: string;
		status: 1 | 0;
		createTime: string;
	}

	interface UserReq {
		id?: string;
		username: string;
		nickname: string;
		email: string;
		phone: string;
		role: string;
		password?: string;
		status: 1 | 0;
	}

	// 角色管理
	interface RoleItem {
		id: string;
		name: string;
		code: string;
		sort: number;
		status: 1 | 0;
		desc: string;
		createTime: string;
	}

	interface RoleReq {
		id?: string;
		name: string;
		code: string;
		sort: number;
		status: 1 | 0;
		desc: string;
	}

	// 角色权限
	interface RolePermissionsRes {
		menuIds: string[];
	}

	// 部门管理
	interface DepartmentItem {
		id: string;
		name: string;
		code: string;
		sort: number;
		parentId: string | null;
		status: 1 | 0;
		desc: string;
		children?: DepartmentItem[];
		createTime: string;
	}

	interface DepartmentReq {
		id?: string;
		name: string;
		code: string;
		sort: number;
		parentId: string | null;
		status: 1 | 0;
		desc: string;
	}

	// 岗位管理
	interface PostItem {
		id: string;
		name: string;
		code: string;
		sort: number;
		status: 1 | 0;
		desc: string;
		createTime: string;
	}

	interface PostReq {
		id?: string;
		name: string;
		code: string;
		sort: number;
		status: 1 | 0;
		desc: string;
	}

	// 字典管理
	interface DictTypeItem {
		id: string;
		name: string;
		code: string;
		sort: number;
		status: 1 | 0;
		desc: string;
		createTime: string;
	}

	interface DictTypeReq {
		id?: string;
		name: string;
		code: string;
		sort: number;
		status: 1 | 0;
		desc: string;
	}

	interface DictDataItem {
		id: string;
		dictTypeId: string;
		label: string;
		value: string;
		sort: number;
		status: 1 | 0;
		desc: string;
		createTime: string;
	}

	interface DictDataReq {
		id?: string;
		dictTypeId: string;
		label: string;
		value: string;
		sort: number;
		status: 1 | 0;
		desc: string;
	}

	// 登录日志
	interface LoginLogItem {
		id: string;
		username: string;
		ip: string;
		location: string;
		browser: string;
		os: string;
		status: 1 | 0;
		message: string;
		loginTime: string;
	}

	// 操作日志
	interface OperationLogItem {
		id: string;
		operator: string;
		module: string;
		action: string;
		target: string;
		ip: string;
		status: 1 | 0;
		detail: string;
		operationTime: string;
	}

	// 网站配置
	interface SiteConfigItem {
		id: string;
		siteName: string;
		logo: string;
		favicon: string;
		keywords: string;
		description: string;
		copyright: string;
		icp: string;
		contactEmail: string;
	}

	// 通用分页响应
	interface PageList<T> {
		data: T[];
		total: number;
	}
}
