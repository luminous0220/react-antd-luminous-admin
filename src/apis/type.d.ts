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

	// 通用分页响应
	interface PageList<T> {
		data: T[];
		total: number;
	}
}
