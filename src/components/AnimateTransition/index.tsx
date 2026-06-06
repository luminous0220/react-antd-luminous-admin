import { useState, useEffect } from "react";
import { AnimateTransitionProps } from "./type";


export const AnimateTransition = ({
	visible,
	children,
	enter = "animate__fadeIn",
	leave = "animate__fadeOut",
	duration = 400,
	className = "",
	unmountOnExit = true,
}: AnimateTransitionProps) => {
	const [innerVisible, setInnerVisible] = useState(visible);
	const [animateClass, setAnimateClass] = useState(enter);

	// 监听显示状态，执行入场/退场
	useEffect(() => {
		if (visible) {
			setInnerVisible(true);
			setAnimateClass(enter);
		} else {
			setAnimateClass(leave);
			const timer = setTimeout(() => {
				setInnerVisible(false);
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [visible, enter, leave, duration]);

	// 退场后卸载DOM
	if (unmountOnExit && !innerVisible) {
		return null;
	}

	return (
		<div
			className={`animate__animated ${animateClass} ${className}`}
			style={{
				["--animate-duration" as any]: `${duration}ms`,
			}}
		>
			{children}
		</div>
	);
};

