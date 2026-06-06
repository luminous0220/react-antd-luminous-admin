import React, { useState, useRef, useEffect } from "react";
import { Drawer, Layout, theme } from "antd";
import { useOutlet, useLocation } from "react-router";
import { useGlobalStore } from "@/stores";
import { TopHeader } from "./TopHeader/TopHeader";
import { Side } from "./Side";

const { Content } = Layout;

export const BaseLayout: React.FC = () => {
	const {
		token: { borderRadiusLG },
	} = theme.useToken();

	const isMobile = useGlobalStore((s) => s.isMobile);
	const location = useLocation();
	const outlet = useOutlet();

	const [animationClass, setAnimationClass] = useState("");
	const [displayOutlet, setDisplayOutlet] = useState(outlet);
	const prevPathnameRef = useRef(location.pathname);

	const [collapsed, setCollapsed] = useState(false);
	const onClose = () => {
		setCollapsed(false);
	};

	// 路由变化时触发动画
	useEffect(() => {
		if (prevPathnameRef.current !== location.pathname) {
			setAnimationClass("page-exit");
			const timer = setTimeout(() => {
				setDisplayOutlet(outlet);
				setAnimationClass("page-enter");
				setTimeout(() => {
					setAnimationClass("");
				}, 250);
			}, 200);
			prevPathnameRef.current = location.pathname;
			return () => clearTimeout(timer);
		} else {
			setDisplayOutlet(outlet);
		}
	}, [location.pathname, outlet]);

	const sidebarWidth = 228;
	const sidebarCollapsedWidth = 64;
	const contentMarginLeft = isMobile ? 0 : (collapsed ? sidebarCollapsedWidth : sidebarWidth);

	return (
		<Layout className="size-full overflow-x-hidden relative">
			{isMobile ? (
				<Drawer
					styles={{
						body: {
							padding: 0,
						},
					}}
					size={228}
					placement={"left"}
					closable={false}
					onClose={onClose}
					open={collapsed}
				>
					<Side width={228} />
				</Drawer>
			) : (
				<Side
					width={sidebarWidth}
					collapsedWidth={sidebarCollapsedWidth}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>
			)}

			<Layout
				style={{
					marginLeft: contentMarginLeft,
				}}
			>
				<TopHeader collapsed={collapsed} setCollapsed={setCollapsed} />

				<Content className="relative size-full ">
					<div
						className={`transition-wrapper size-full absolute left-0 top-0 overflow-y-auto p-2 md:px-6 md:pb-6	 pb-0! ${animationClass}`}
						style={{
							borderRadius: borderRadiusLG,
						}}
					>
						{displayOutlet}
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};
