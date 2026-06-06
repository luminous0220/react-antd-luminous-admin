import React, { useCallback } from "react";
import { Button } from "antd";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useThemeStore } from "@/stores";
import "./index.scss";

export const ThemeToggle: React.FC = () => {
	const isDark = useThemeStore((s) => s.isDark);
	const toggleDark = useThemeStore((s) => s.toggleDark);

	const handleToggle = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			// Fallback: browser doesn't support View Transitions API
			if (!document.startViewTransition) {
				toggleDark();
				return;
			}

			const { clientX, clientY } = e;

			const transition = document.startViewTransition(() => {
				toggleDark();
			});

			transition.ready.then(() => {
				const radius = Math.hypot(
					Math.max(clientX, innerWidth - clientX),
					Math.max(clientY, innerHeight - clientY),
				);

				document.documentElement.animate(
					{
						clipPath: [
							`circle(0 at ${clientX}px ${clientY}px)`,
							`circle(${radius}px at ${clientX}px ${clientY}px)`,
						],
					},
					{
						duration: 400,
						easing: "cubic-bezier(0.4, 0, 0.2, 1)",
						pseudoElement: "::view-transition-new(root)",
					},
				);
			});
		},
		[toggleDark],
	);

	return (
		<Button
			shape="circle"
			type="text"
			size="large"
			icon={
				isDark ? (
					<IconMoon size={20} stroke={1.5} />
				) : (
					<IconSun size={20} stroke={1.5} />
				)
			}
			onClick={handleToggle}
		/>
	);
};

