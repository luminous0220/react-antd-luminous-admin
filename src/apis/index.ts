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
	// 角色权限
	getRolePermissions: (roleId: string) =>
		http.get<IApi.RolePermissionsRes>({
			url: "/system/api/Role/permission",
			params: { roleId },
		}),
	saveRolePermissions: (params: { roleId: string; menuIds: string[] }) =>
		http.post<void>({
			url: "/system/api/Role/permission/save",
			params,
		}),
	// 部门管理
	getDepartmentList: () =>
		http.get<IApi.DepartmentItem[]>({
			url: "/system/api/Department/list",
		}),
	saveDepartment: (params: IApi.DepartmentReq) =>
		http.post<IApi.DepartmentItem>({
			url: "/system/api/Department/save",
			params,
		}),
	deleteDepartment: (id: string) =>
		http.delete<void>({
			url: "/system/api/Department/delete",
			params: { id },
		}),
	// 岗位管理
	getPostList: (params: Record<string, unknown>) =>
		http.get<IApi.PageList<IApi.PostItem>>({
			url: "/system/api/Post/list",
			params,
		}),
	savePost: (params: IApi.PostReq) =>
		http.post<IApi.PostItem>({
			url: "/system/api/Post/save",
			params,
		}),
	deletePost: (id: string) =>
		http.delete<void>({
			url: "/system/api/Post/delete",
			params: { id },
		}),
	// 字典管理 - 类型
	getDictTypeList: (params: Record<string, unknown>) =>
		http.get<IApi.PageList<IApi.DictTypeItem>>({
			url: "/system/api/DictType/list",
			params,
		}),
	saveDictType: (params: IApi.DictTypeReq) =>
		http.post<IApi.DictTypeItem>({
			url: "/system/api/DictType/save",
			params,
		}),
	deleteDictType: (id: string) =>
		http.delete<void>({
			url: "/system/api/DictType/delete",
			params: { id },
		}),
	// 字典管理 - 数据
	getDictDataList: (params: Record<string, unknown>) =>
		http.get<IApi.PageList<IApi.DictDataItem>>({
			url: "/system/api/DictData/list",
			params,
		}),
	saveDictData: (params: IApi.DictDataReq) =>
		http.post<IApi.DictDataItem>({
			url: "/system/api/DictData/save",
			params,
		}),
	deleteDictData: (id: string) =>
		http.delete<void>({
			url: "/system/api/DictData/delete",
			params: { id },
		}),
	// 登录日志
	getLoginLogList: (params: Record<string, unknown>) =>
		http.get<IApi.PageList<IApi.LoginLogItem>>({
			url: "/system/api/LoginLog/list",
			params,
		}),
	// 操作日志
	getOperationLogList: (params: Record<string, unknown>) =>
		http.get<IApi.PageList<IApi.OperationLogItem>>({
			url: "/system/api/OperationLog/list",
			params,
		}),
	// 网站配置
	getSiteConfig: () =>
		http.get<IApi.SiteConfigItem>({
			url: "/system/api/SiteConfig/detail",
		}),
	saveSiteConfig: (params: IApi.SiteConfigItem) =>
		http.post<void>({
			url: "/system/api/SiteConfig/save",
			params,
		}),
};

export * from "./type.d";
