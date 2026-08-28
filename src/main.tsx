// src/main.tsx
import "./styles/tailwind.css";
import "./styles/reset.css";
import "./styles/theme.scss";
import "animate.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initResize } from "@/libs";

// 创建容器以避免严格模式下的副作用
let initialized = false;

const initializeApp = () => {
	if (!initialized) {
		initialized = true;
		initResize();
		// 可以在这里放置只需要执行一次的初始化代码
	}
};

initializeApp();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
