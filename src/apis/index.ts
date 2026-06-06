import { http } from "@/libs";
import { IApi } from "./type.d";

export const Api = {
	login: (params: IApi.LoginReq) =>
		http.post<IApi.LoginRes>({
			url: "/system/api/User/login",
			params,
			config: { noToken: true },
		}),
	getPermissions: () =>
		http.get<IApi.PermissionRes>({
			url: "/system/api/User/permission",
		}),
	getHomeDashboard: () =>
		http.get<IApi.HomeDashboardRes>({
			url: "/home/dashboard",
		}),
	getHomeAnalysis: (preset: string) =>
		http.get<IApi.HomeAnalysisRes>({
			url: "/home/analysis",
			params: { preset },
		}),
	// 菜单管理
	getMenuList: () =>
		http.get<IApi.MenuItem[]>({
			url: "/system/api/Menu/list",
		}),
	saveMenu: (params: IApi.MenuReq) =>
		http.post<IApi.MenuItem>({
			url: "/system/api/Menu/save",
			params,
		}),
	deleteMenu: (id: string) =>
		http.delete<void>({
			url: "/system/api/Menu/delete",
			params: { id },
		}),
	// 用户管理
	getUserList: (params: Record<string, unknown>) =>
		http.get<IApi.PageList<IApi.UserItem>>({
			url: "/system/api/User/list",
			params,
		}),
	saveUser: (params: IApi.UserReq) =>
		http.post<IApi.UserItem>({
			url: "/system/api/User/save",
			params,
		}),
	deleteUser: (id: string) =>
		http.delete<void>({
			url: "/system/api/User/delete",
			params: { id },
		}),
	// 角色管理
	getRoleList: (params: Record<string, unknown>) =>
		http.get<IApi.PageList<IApi.RoleItem>>({
			url: "/system/api/Role/list",
			params,
		}),
	saveRole: (params: IApi.RoleReq) =>
		http.post<IApi.RoleItem>({
			url: "/system/api/Role/save",
			params,
		}),
	deleteRole: (id: string) =>
		http.delete<void>({
			url: "/system/api/Role/delete",
			params: { id },
		}),
};

export * from "./type.d";
