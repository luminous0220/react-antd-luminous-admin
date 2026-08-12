import React, { useState } from "react";
import { Drawer, Layout, theme } from "antd";
import { useOutlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
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

	const [collapsed, setCollapsed] = useState(false);
	const onClose = () => {
		setCollapsed(false);
	};

	const sidebarWidth = 256;
	const sidebarCollapsedWidth = 78;
	const contentMarginLeft = isMobile
		? 0
		: collapsed
			? sidebarCollapsedWidth
			: sidebarWidth;

	return (
		<Layout className="size-full overflow-x-hidden relative">
			{/* 侧边栏：从左侧滑入 */}
			{isMobile ? (
				<Drawer
					styles={{
						body: {
							padding: 0,
						},
					}}
					size={240}
					placement={"left"}
					closable={false}
					onClose={onClose}
					open={collapsed}
				>
					<Side width={240} />
				</Drawer>
			) : (
				<Side
					width={sidebarWidth}
					collapsedWidth={sidebarCollapsedWidth}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>
			)}

			{/* 右侧主体：头部 + 内容，错峰入场 */}
			<Layout
				style={{
					marginLeft: contentMarginLeft,
				}}
			>
				<TopHeader collapsed={collapsed} setCollapsed={setCollapsed} />

				<Content className="relative size-full">
					<AnimatePresence initial={true} mode="wait">
						<motion.div
							key={location.pathname}
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 30 }}
							transition={{ duration: 0.25, ease: "easeInOut" }}
							className="size-full absolute left-0 top-0 overflow-y-auto p-2 md:px-6 md:pb-6 pb-0!"
							style={{
								borderRadius: borderRadiusLG,
							}}
						>
							{outlet}
						</motion.div>
					</AnimatePresence>
				</Content>
			</Layout>
		</Layout>
	);
};
