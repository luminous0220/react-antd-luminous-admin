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
	const sidebarCollapsedWidth = 88;


	return (
		<Layout className="size-full overflow-x-hidden flex flex-row">
			{/* 侧边栏：从左侧滑入 */}
			{isMobile ? (
				<Drawer
					styles={{
						body: {
							padding: 0,
						},
					}}
					size={sidebarWidth}
					placement={"left"}
					closable={false}
					onClose={onClose}
					open={collapsed}
				>
					<Side width={sidebarWidth} />
				</Drawer>
			) : (
				<Side
					width={sidebarWidth}
					collapsedWidth={sidebarCollapsedWidth}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
				/>
			)}

			{/* 右侧主体：头部 + 内容，错峰入场
				（min-w-0：允许在表格等宽内容超出视口时收缩，把横向滚动交给表格内部，
				  避免 flex 的 min-width:auto 把整块区域撑出边界） */}
			<Layout className="min-w-0">
				<TopHeader collapsed={collapsed} setCollapsed={setCollapsed} />

				<Content className="relative size-full">
					<AnimatePresence initial={true} mode="wait">
						<motion.div
							key={location.pathname}
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 30 }}
							transition={{ duration: 0.25, ease: "easeInOut" }}
							className="size-full overflow-y-auto p-2 md:px-4 md:pb-4 pb-0!"
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
