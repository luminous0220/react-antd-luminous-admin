/**
 * 资源 URL 处理工具
 *
 * 后端返回的图片路径为相对路径（如 /static/avatars/xxx.jpg），
 * 在开发环境下前后端不同端口，需确保浏览器能正确访问后端静态资源。
 *
 * - 开发环境：相对路径原样返回，Vite proxy 会将 /static 转发到后端
 * - 生产环境：若配置了 VITE_STATIC_BASE_URL 环境变量则拼接，否则原样返回
 *   （同域部署时相对路径可直接访问）
 */

/**
 * @description 将后端返回的资源相对路径转为浏览器可用的完整 URL
 * @param path 资源相对路径，如 "/static/avatars/xxx.jpg"
 * @returns 浏览器可用的 URL；若 path 为空则返回空字符串
 */
export const getAssetUrl = (path: string | undefined | null): string => {
	if (!path) return "";

	// 已是完整 URL（http/https 开头），直接返回
	if (/^https?:\/\//.test(path)) return path;

	// 生产中可通过 VITE_STATIC_BASE_URL 指定静态资源基地址
	const staticBase = import.meta.env.VITE_STATIC_BASE_URL as string | undefined;
	if (staticBase) {
		return staticBase.replace(/\/$/, "") + path;
	}

	// 默认：相对路径原样返回（开发环境 Vite proxy 处理 /static，生产环境同域部署）
	return path;
};

/**
* @description 图片url转File对象
*/
export const urlToFile = async (url: string, filename: string): Promise<File> => {
	const res = await fetch(url);
	const blob = await res.blob();
	return new File([blob], filename, { type: blob.type });
};
