import { useEffect, useState, useRef, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth";
import { getToken, removeToken } from "@/libs/storage";
import { CFG } from "@/constants";
import { Api } from "@/apis";
import { filterAndSortMenus } from "./utils";
interface AuthGuardProps {
	children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const isRequestingRef = useRef(false);

	const { setIsOnline, setUserInfo, setMenus, resetAuth } = useAuthStore();
	const isOnline = useAuthStore((state) => state.isOnline);

	const reset = useCallback(() => {
		resetAuth();
		removeToken();
		setLoading(false);
	}, [resetAuth]);

	useEffect(() => {
		const checkAuth = async () => {
			// 防止重复请求
			if (isRequestingRef.current) return;
			isRequestingRef.current = true;

			const token = getToken();
			if (!token) {
				reset();
				return;
			}

			// 已经在线，无需重复请求
			if (isOnline) {
				setLoading(false);
				return;
			}

			try {
				const res = await Api.getPermissions();
				setUserInfo({
					id: res.user.id,
					name: res.user.name,
				});
				setMenus(filterAndSortMenus(res.menus));
				setIsOnline(true);
				setLoading(false);
			} catch {
				reset();
			} finally {
				isRequestingRef.current = false;
			}
		};

		checkAuth();
	}, [isOnline, reset, setIsOnline, setUserInfo, setMenus]);

	// 全屏 loading
	if (loading) {
		// <Spin fullscreen description="页面加载中..." />
		return <img src="../../public/loading.svg" className="size-[50%] abs-center" alt="图标"></img>;
	}

	// 未登录，跳转登录页
	if (!isOnline || !getToken()) {
		return <Navigate to={CFG.LOGIN_PATH} replace state={{ from: location }} />;
	}

	return <>{children}</>;
};

// 已登录用户重定向组件
export const RedirectIfAuthenticated = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const navigate = useNavigate();
	const token = getToken();
	useEffect(() => {
		if (token) {
			// 如果已认证，则返回首页
			navigate(CFG.HOME_PATH, { replace: true });
		}
	}, [navigate, token]);

	return !token ? children : null;
};
