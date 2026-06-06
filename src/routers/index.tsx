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

	return (
		<Suspense fallback={<Spin className="size-full flex-center" />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}