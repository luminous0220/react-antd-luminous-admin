// src/App.tsx
import { ConfigProvider, App as Message, theme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { MessageHolder, FullLoadingHolder } from "./hooks";
import { useThemeStore } from "./stores";
import { useEffect } from "react";
import { AppRouter } from "./routers";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
		},
	},
});

dayjs.locale("zh-cn");

const App = () => {
	const { isDark, colorPrimary } = useThemeStore();

	useEffect(() => {
		useThemeStore.getState().recomputeTheme();
	}, []);

	return (
		<div className="root-bg size-full">
			<ConfigProvider
				locale={locale}
				theme={{
					algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
					token: {
						colorPrimary,
						colorTextBase: isDark ? "#b1b1c7" : "#030229",
						colorBgContainer: isDark ? "#161618" : "#FFFFFF",
						colorBgLayout: isDark ? "#000000" : "#F5F5F5",
					},
					components: {
						Menu: {
							fontSize: 14,
						},
						Modal: {
							borderRadiusLG: 32,
						},
					},
				}}
			>
				<QueryClientProvider client={queryClient}>
					<Message
						className="size-full"
						message={{ duration: 3 }}
						notification={{ duration: 3 }}
					>
						<MessageHolder />
						<AppRouter />
					</Message>
				</QueryClientProvider>
			</ConfigProvider>
			<FullLoadingHolder />
		</div>
	);
};

export default App;
