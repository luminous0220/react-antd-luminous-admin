import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "@meadmin-cn/vite-plugin-mock";
import { resolve } from "path";

/**
 * @description 添加.env文件中的变量到process.env进程中
 * @returns 含有env键值对的js对象
 */
function getEnv(env: Record<string, any>) {
	const ret: any = {};

	for (const [key, val] of Object.entries(env)) {
		let v: any = "";
		v = val === "true" ? true : val === "false" ? false : val;
		if (
			typeof v === "string" &&
			typeof Number(v) === "number" &&
			!isNaN(Number(v))
		) {
			v = Number(v);
		}

		process.env[key] = v;
		ret[key] = v;
	}

	return ret;
}

// https://vite.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv) => {
	// process.cwd()获取当前node进程所在的地址
	const env = loadEnv(mode, process.cwd());
	const viteEnv = getEnv(env);
	const { VITE_PORT } = viteEnv;

	return {
		// react-draggable 等库引用 process.env.NODE_ENV，Vite 环境下需 define 注入
		define: {
			"process.env.NODE_ENV": JSON.stringify(mode),
		},
		// 配置前端服务地址和端口
		server: {
			preTransformRequests: true,
			host: "0.0.0.0",
			port: VITE_PORT,
		},
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
			},
		},
		plugins: [
			react(),
			viteMockServe({
				mockPath: "src/mock",
				localEnabled: command === "serve",
				supportTs: true,
			}),
		],
	};
});
