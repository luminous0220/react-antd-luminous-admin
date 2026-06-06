import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";

import { getToken, removeToken } from "@/libs";

import { CFG, HTTP_STATUS } from "@/constants";

export interface HttpRequestConfig extends InternalAxiosRequestConfig {
	noToken?: boolean;
}

interface IConfig extends AxiosRequestConfig {
	noToken?: boolean;
	noErrorMessage?: boolean;
}

interface IReqParams {
	url: string;
	params?: any;
	config?: IConfig;
}

// * 基础配置
const DEFAULT_CONFIG = {
	// baseURL: import.meta.env.VITE_BASE_URL as string,
	timeout: CFG.AXIOS_TIME_OUT as number,
	withCredential: true,
	headers: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": "application/json",
		"X-Requested-With": "XMLHttpRequest",
	},
};

// * 创建axios实例的类
class RequestHttp {
	// * Axios实例
	private requestServer: AxiosInstance;
	constructor(config: AxiosRequestConfig) {
		this.requestServer = axios.create(config);

		// 请求拦截器
		this.requestServer.interceptors.request.use(
			async (confi: HttpRequestConfig) => {
				const { headers, noToken } = confi;
				// 如果是白名单里的请求url，则不需要 token
				if (noToken) {
					return confi;
				}

				const token = getToken();
				headers.setAuthorization("Bearer " + token);

				return confi;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			},
		);

		// 响应拦截器
		this.requestServer.interceptors.response.use(
			async (interRes: AxiosResponse) => {
				const { code: status, message, data } = interRes.data || {};
				if (interRes.config.responseType === "blob") {
					if (status !== HTTP_STATUS.SUCCESS) return Promise.reject(data);
					return data;
				}

				if (status === HTTP_STATUS.UNAUTHORIZED) {
					window.$message.error("登录失效，请重新登录");
					// 清除 Token
					removeToken();
					return Promise.reject(data);
				}

				if (status !== HTTP_STATUS.SUCCESS || status !== HTTP_STATUS.SUCCESS) {
					window.$message.error(message || "请求失败");
					console.error(interRes);
					return Promise.reject(data);
				}

				return data;
			},
			async (error: AxiosError) => {
				const { response, status } = error;
				console.error(response);
				if (!window.navigator.onLine) {
					window.$message.error("网络请求超时，请您重试");
					return Promise.reject(response);
				}

				if (status === HTTP_STATUS.UNAUTHORIZED) {
					window.$message.error("登录失效，请重新登录");
					// 清除 Token
					removeToken();
					window.location.href = CFG.LOGIN_PATH;
					return Promise.reject(response);
				}

				if (status && status !== HTTP_STATUS.SUCCESS) {
					window.$message.error("请求错误，请联系系统管理员");
					return Promise.reject(error);
				}

				return Promise.reject(response);
			},
		);
	}

	get<T>(p: IReqParams): Promise<T> {
		const { url, params, config } = p;
		return this.requestServer.get(url, { params, ...config });
	}
	post<T>(p: IReqParams): Promise<T> {
		const { url, params, config } = p;
		return this.requestServer.post(url, params, config);
	}
	put<T>(p: IReqParams): Promise<T> {
		const { url, params, config } = p;
		return this.requestServer.put(url, params, config);
	}
	delete<T>(p: IReqParams): Promise<T> {
		const { url, params, config } = p;
		return this.requestServer.delete(url, { params, ...config });
	}
}

export const http = new RequestHttp(DEFAULT_CONFIG);
