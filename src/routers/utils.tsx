import { lazy, Suspense } from "react";
import { RouteObject } from "react-router";
import { Spin } from "antd";
import { IApi } from "@/apis";

// 空页面组件（开发中）
const EmptyPage = () => (
	<div className="min-h-full flex items-center justify-center">
		<div className="text-center">
			<h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
				页面开发中
			</h1>
			<p className="text-gray-500 dark:text-gray-400">敬请期待...</p>
		</div>
	</div>
);

// 懒加载组件包装器（带 fallback，保证过渡动画可见）
const LazyWrapper = (
	Component: React.LazyExoticComponent<React.ComponentType<any>>,
) => (
	<Suspense
		fallback={
			<div className="size-full flex items-center justify-center">
				<Spin />
			</div>
		}
	>
		<Component />
	</Suspense>
);

// 动态加载组件页面
const dynamicImport = (componentPath: string) => {
	// 使用 Vite 支持的动态导入格式
	const modules = import.meta.glob("@/pages/**/*.tsx");
	const path = `/src/pages/${componentPath}/index.tsx`;
	if (modules[path]) {
		return modules[path];
	}
	const path2 = `/src/pages${componentPath}/index.tsx`;
	if (modules[path2]) {
		return modules[path2];
	}

	// 尝试其他路径格式
	const path3 = `/src/pages/${componentPath}/index.tsx`;
	if (modules[path3]) {
		return modules[path3];
	}

	return null;
};

// 加载组件
export const loadComponent = (
	componentPath: string | undefined,
): React.ReactNode => {
	if (!componentPath) return <EmptyPage />;

	const importer = dynamicImport(componentPath);
	if (importer) {
		const LazyComponent = lazy(
			importer as () => Promise<{ default: React.ComponentType<any> }>,
		);
		return LazyWrapper(LazyComponent);
	}

	return <EmptyPage />;
};

// 排序、筛选
export const filterAndSortMenus = (menus: IApi.MenuItem[]): IApi.MenuItem[] => {
	return menus
		.filter((menu) => menu.status === 1) // 仅处理启用的菜单
		.sort((a, b) => a.sort - b.sort) // 按 sort 字段升序排序
		.map((menu) => ({
			...menu,
			path: menu.path,
			title: menu.title,
			icon: menu.icon,
			children: menu.children?.length
				? filterAndSortMenus(menu.children)
				: undefined,
		}));
};

// 生成动态路由
export const generateRoutes = (menus: IApi.MenuItem[]): RouteObject[] => {
	const routes: RouteObject[] = [];
	menus.forEach((menu) => {
		// 处理根菜单(component为组件路径)
		if (menu.path && menu.componentPath) {
			routes.push({
				path: menu.path,
				element: loadComponent(menu.componentPath),
			});
		}

		// 处理子菜单
		if (menu.children?.length) {
			const childRoutes = generateRoutes(menu.children);
			routes.push(...childRoutes);
		}
	});

	return routes;
};
