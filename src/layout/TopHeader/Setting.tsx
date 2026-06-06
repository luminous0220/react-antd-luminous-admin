import { Button, Drawer } from "antd";
import { useState } from "react";
import { useThemeStore } from "@/stores/theme";
import { ThemePanel } from "@/components/ThemePanel";
import { IconSettings } from "@tabler/icons-react";

// 可控制的主题抽屉组件
export const Setting = () => {
	const [open, setOpen] = useState(false);
	const { colorPrimary } = useThemeStore();

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<div className="flex items-center gap-2">
			<Button
				type="text"
				icon={<IconSettings stroke={1} />}
				onClick={showDrawer}
				aria-label="系统设置"
				style={{
					color: open ? colorPrimary : undefined,
					transition: "all 0.2s",
				}}
			/>


			<Drawer
				title="系统设置"
				placement="right"
				onClose={onClose}
				open={open}
				size={320}
			>
				<ThemePanel />
			</Drawer>
		</div>
	);
};
