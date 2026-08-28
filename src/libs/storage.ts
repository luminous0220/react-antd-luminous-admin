import { CFG } from "@/constants";

/**
 * 存储数据到 localStorage 并设置过期时间（单位：毫秒）
 */
function setItem(key: string, value: any, ttl: number = Infinity): void {
	const now = new Date().getTime();
	const data = {
		value,
		expiry: ttl === Infinity ? null : now + ttl,
	};
	window.localStorage.setItem(key, JSON.stringify(data));
}

/**
 * 从 localStorage 获取数据，自动判断是否过期
 */
function getItem<T>(key: string): T | null {
	const item = window.localStorage.getItem(key);
	if (!item) return null;

	const data = JSON.parse(item);
	const now = new Date().getTime();

	if (data.expiry && now > data.expiry) {
		removeItem(key);
		return null;
	}

	return data.value as T;
}

/**
 * 从 localStorage 移除指定键的数据
 */
function removeItem(key: string): void {
	window.localStorage.removeItem(key);
}

/**
 * 清空所有 localStorage 数据
 */
function clearItems(): void {
	window.localStorage.clear();
}

/**
 * 存储数据到 sessionStorage 并设置过期时间（单位：毫秒）
 */
function setSessionItem(key: string, value: any, ttl: number = Infinity): void {
	const now = new Date().getTime();
	const data = {
		value,
		expiry: ttl === Infinity ? null : now + ttl,
	};
	window.sessionStorage.setItem(key, JSON.stringify(data));
}

/**
 * 从 sessionStorage 获取数据，自动判断是否过期
 */
function getSessionItem<T>(key: string): T | null {
	const item = window.sessionStorage.getItem(key);
	if (!item) return null;

	const data = JSON.parse(item);
	const now = new Date().getTime();

	if (data.expiry && now > data.expiry) {
		removeSessionItem(key);
		return null;
	}

	return data.value as T;
}

/**
 * 从 sessionStorage 移除指定键的数据
 */
function removeSessionItem(key: string): void {
	window.sessionStorage.removeItem(key);
}

/**
 * 清空所有 sessionStorage 数据
 */
function clearSessionItems(): void {
	window.sessionStorage.clear();
}

/**
 * 设置 token 到 localStorage 并带上默认过期时间（如 24 小时）
 */
function setToken(token: string): void {
	setItem(CFG.TOKEN_KEY, token);
}

/**
 * 获取 localStorage 中的 token
 */
function getToken() {
	return getItem<string | undefined>(CFG.TOKEN_KEY);
}

/**
 * 删除 localStorage 中的 token
 */
function removeToken(): void {
	removeItem(CFG.TOKEN_KEY);
}


// 导出方法
export {
	setItem,
	getItem,
	removeItem,
	clearItems,
	setToken,
	getToken,
	removeToken,
	setSessionItem,
	getSessionItem,
	removeSessionItem,
	clearSessionItems,
};
