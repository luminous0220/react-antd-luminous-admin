import { Navigate } from "react-router";
import { BaseLayout } from "@/layout";
import { CFG } from "@/constants";
import { generateRoutes } from "./utils";
import { lazy, Suspense, useMemo } from "react";
import { createHashRouter, RouterProvider } from "react-router";
import Login from "@/pages/Login";
import { Spin } from "antd";
import { AuthGuard, RedirectIfAuthenticated } from "./AuthGuard";
import { useAuthStore } from "@/stores/auth";

const NotFound = lazy(() => import("@/pages/NotFound"));

// 创建路由配置
export function AppRouter() {
	const menus = useAuthStore((s) => s.menus);

	// 根据菜单动态生成子路由
	const dynamicRoutes = useMemo(() => {
		if (!menus || menus.length === 0) return [];
		return generateRoutes(menus);
	}, [menus]);
	const router = useMemo(() => {
		return createHashRouter([
			{
				path: "/",
				element: (
					<AuthGuard>
						<BaseLayout />
					</AuthGuard>
				),
				children: [
					{
						index: true,
						element: <Navigate to={CFG.HOME_PATH} replace />,
					},
					...dynamicRoutes,
					{
						path: "*",
						element: <NotFound />,
					},
				],
			},
			{
				path: CFG.LOGIN_PATH,
				element: (
					<RedirectIfAuthenticated>
						<Login />
					</RedirectIfAuthenticated>
				),
			},
		]);
	}, [dynamicRoutes]);

	// 路由签名：菜单路由变化时生成新的 key，强制重挂载 RouterProvider。
	// RouterProvider 内部状态仅在首次挂载时记录，router 实例更换后不会自动同步，
	// 若沿用旧状态会按新路由树重新映射，导致刷新后误渲染首页，故路由变化时需整树重建。
	const routerKey = dynamicRoutes.map((r) => r.path).join(",");

	return (
		<Suspense fallback={<Spin className="size-full flex-center" />}>
			<RouterProvider key={routerKey} router={router} />
		</Suspense>
	);
}