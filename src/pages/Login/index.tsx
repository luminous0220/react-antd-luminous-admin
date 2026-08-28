import { useRef, useEffect, useState } from "react";
import { Button, Checkbox, ConfigProvider, theme, Form } from "antd";
import { useMutation } from "@tanstack/react-query";

import { Api, IApi } from "@/apis";
import { setToken, setItem, getItem, removeItem } from "@/libs/storage";
import { CFG } from "@/constants";
import { useNavigate } from "react-router";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useThemeStore, PRESET_COLORS, PresetColorKey } from "@/stores/theme";
import { ProForm, FormFieldItem, ProFormInstance } from "@/components/ProForm";
import {
	ShakeOutlined,
	UserOutlined,
	PieChartOutlined,
} from "@ant-design/icons";
import "@/styles/login.scss";

const { useToken } = theme;

const tags = [
	{ icon: ShakeOutlined, label: "安全可靠" },
	{ icon: UserOutlined, label: "高效便捷" },
	{ icon: PieChartOutlined, label: "现代设计" },
];

// 记住密码存储的键
const REMEMBER_KEY = CFG.REMEMBER_KEY;
// 30天过期时间
const REMEMBER_TTL = 30 * 24 * 60 * 60 * 1000;

const Login = () => {
	const formRef = useRef<ProFormInstance>(null);
	const navigate = useNavigate();
	const [remember, setRemember] = useState(false);

	const { isDark, toggleDark, setPresetColor, colorPrimary } = useThemeStore();

	// 加载记住的账号信息
	useEffect(() => {
		const remembered = getItem<{
			loginName: string;
			remember: boolean;
			loginPwd: string;
		}>(REMEMBER_KEY);
		if (remembered) {
			formRef.current?.setFieldsValue({
				loginName: remembered.loginName,
				loginPwd: remembered?.loginPwd,
			});
			setRemember(remembered.remember);
		}
	}, []);

	// 登录 mutation
	const loginMutation = useMutation({
		mutationFn: (params: IApi.LoginReq) => Api.login(params),
		onSuccess: (data) => {
			// 存储token
			setToken(data.accessToken);

			window.$message.success("登录成功");
			navigate(CFG.HOME_PATH);
		},
	});

	// 表单配置
	const formItems: FormFieldItem[] = [
		{
			name: "loginName",
			label: "账号",
			type: "input",

			rules: ["required"],
			fieldProps: {
				placeholder: "请输入用户名",
			},
		},
		{
			name: "loginPwd",
			label: "密码",
			type: "input-password",
			rules: ["required"],
			fieldProps: {
				placeholder: "请输入密码",
			},
		},
	];

	// 提交登录
	const handleSubmit = async () => {
		try {
			const values = await formRef.current?.validateFields();
			// 处理记住密码
			if (remember) {
				setItem(
					REMEMBER_KEY,
					{
						loginName: values?.loginName,
						loginPwd: values?.loginPwd,
						remember: true,
					},
					REMEMBER_TTL,
				);
			} else {
				removeItem(REMEMBER_KEY);
			}

			loginMutation.mutate({
				loginName: values?.loginName,
				loginPwd: values?.loginPwd,
			});
		} catch (error) {
			console.error("表单验证失败", error);
		}
	};

	// 主题切换
	const handleThemeChange = () => {
		toggleDark();
	};

	// 预设颜色切换
	const handleColorChange = (color: PresetColorKey) => {
		setPresetColor(color);
	};

	return (
		<ConfigProvider
			theme={{
				algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
				token: {
					colorPrimary,
				},
			}}
		>
			<div className="relative flex min-h-screen mx-auto flex-col items-center justify-center px-4 py-10 login">
				{/* 装饰背景层：固定定位，覆盖全屏，层级设为 -1 或 0  */}
				<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
					{/* 右上角：大圆弧 */}
					<div className="absolute -top-[25%] -right-[12%] h-[500px] w-[500px] rounded-full bg-[var(--p100)] dark:opacity-0"></div>
					{/* 右上角内部的小圆点 */}
					<div className="absolute top-20 right-10 size-4 rounded-full bg-[var(--p200)] opacity-70  dark:opacity-30"></div>
					<div className="absolute top-[7rem] right-[13rem] size-16 rounded-full bg-[var(--p200)] opacity-60  dark:opacity-30"></div>
					{/* 左侧中部：倾斜方块 */}
					<div className="absolute top-[20%] left-20 h-24 w-24 -translate-y-1/2 rotate-12 rounded-lg bg-[var(--p200)] opacity-50 dark:opacity-30"></div>
					{/* 左下角：重叠方块组 */}
					{/* 前方深色块 */}
					<div className="h-16 w-16 rounded-lg bg-[var(--p200)] absolute left-[4%] bottom-[8%] -rotate-[25deg]  dark:opacity-30"></div>
					{/* 中间浅色块 */}
					<div className="h-20 w-20 rounded-lg bg-[var(--p100)] absolute left-[4%] bottom-[4%] rotate-[12deg] opacity-80 dark:opacity-30"></div>
					{/* 后方小块 */}
					<div className="h-10 w-10  rotate-6 rounded-xl bg-[var(--p300)] absolute left-[7%] bottom-[6%] opacity-40"></div>
					{/* 右下角：菱形 */}
					<div className="absolute bottom-20 right-20 h-16 w-16 rotate-45 rounded-md bg-[var(--p200)] dark:opacity-30"></div>
				</div>

				{/* 右上角主题切换 */}
				<div className="absolute z-[999] top-4 right-4 flex items-center gap-2">
					{/* 预设颜色选择 */}
					<div className="flex gap-1">
						{(Object.keys(PRESET_COLORS) as PresetColorKey[]).map(
							(colorKey) => {
								const isActive = colorPrimary === PRESET_COLORS[colorKey];
								return (
									<button
										key={colorKey}
										onClick={() => handleColorChange(colorKey)}
										className={`w-6 h-6 rounded-full border-2 transition-all ${
											isActive
												? "border-white scale-110"
												: "border-transparent hover:scale-105"
										}`}
										style={{
											backgroundColor: PRESET_COLORS[colorKey],
										}}
										title={colorKey}
									/>
								);
							},
						)}
					</div>
				</div>

				{/* 登录主体：左右分栏大卡片 */}
				<div className="relative flex w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl shadow-soft-lg md:h-155 md:flex-row login-container">
					{/* 左侧栏 */}
					<aside
						className={`relative flex flex-col justify-between gap-8  p-8 md:w-[55%] md:p-10 login-container_left`}
					>
						<div className="blur-1"></div>
						<div className="blur-2"></div>

						{/* 顶部 logo + 标题 */}
						<div>
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-soft text-white">
									🐼
								</div>
								<span className="text-2xl font-semibold tracking-tight text-white">
									LM-ADMIN
								</span>
							</div>

							<h1 className="mt-10 text-[26px] font-bold leading-tight text-white">
								欢迎登录管理平台
							</h1>
							<p className="mt-3 text-sm text-[#CDDCF7]">
								或许我们只是差点运气
							</p>

							{/* 标签 */}
							<div className="mt-6 flex flex-wrap gap-2.5">
								{tags.map((t) => (
									<span
										key={t.label}
										className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium  shadow-soft backdrop-blur bg-opacity-15 bg-white border text-white"
									>
										<t.icon className="h-3.5 w-3.5" />
										{t.label}
									</span>
								))}
							</div>
						</div>

						{/* 底部浏览器窗口 mock UI */}
						<BrowserMock />
					</aside>

					{/* 右侧登录表单区 */}
					<div className="relative flex flex-1 flex-col justify-center px-7 py-8 md:px-12 md:py-12 login-container_right">
						{/* 主题模式切换 */}
						<button
							onClick={handleThemeChange}
							className="absolute top-2 right-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							title={isDark ? "切换到亮色模式" : "切换到暗色模式"}
						>
							{isDark ? (
								<IconSun
									className="w-5 h-5 text-gray-600 dark:text-gray-300"
									stroke={1}
								/>
							) : (
								<IconMoon
									className="w-5 h-5 text-gray-600 dark:text-gray-300"
									stroke={1}
								/>
							)}
						</button>
						<div className="blur-3"></div>
						<div className="blur-4"></div>
						<div className="mx-auto w-full">
							<ProForm
								initialValues={{
									loginName: "admin",
									loginPwd: "123456",
								}}
								type="pure"
								ref={formRef}
								fields={formItems}
								layout="vertical"
								defaultButtons={null}
								autoComplete="off"
								size="large"
							/>

							{/* 记住密码复选框 */}
							<Form.Item className="mb-4">
								<Checkbox
									checked={remember}
									onChange={(e) => setRemember(e.target.checked)}
								>
									记住密码
								</Checkbox>
							</Form.Item>
							<Button
								type="primary"
								block
								size="large"
								className="h-[52px]"
								loading={loginMutation.isPending}
								onClick={handleSubmit}
							>
								登录
							</Button>
						</div>
					</div>
				</div>

				{/* 备案号 */}
				<footer className="mt-8 text-center text-xs text-[#94a3b8]">
					Copyright © 2024 LM-ADMIN · ICP备88888888号-1
				</footer>
			</div>
		</ConfigProvider>
	);
};

/** 左侧底部 CSS 浏览器窗口 mock UI */
function BrowserMock() {
	const { token } = useToken();

	return (
		<div className="hidden rounded-xl p-3 shadow-soft backdrop-blur md:block browser-mock">
			{/* 顶部窗口栏 */}
			<div className="flex items-center gap-2 border-b border-[#e6eefb] pb-2.5">
				<span className="h-2.5 w-2.5 rounded-full bg-[#ff7a7a]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
				<span className="h-2.5 w-2.5 rounded-full bg-[#6dd49e]" />
				<div className="ml-2 flex-1">
					<div className="h-5 rounded-full px-3 text-[10px] leading-5 text-[#94a3b8] mock_item_bg">
						https://LM-admin.com
					</div>
				</div>
			</div>
			{/* 内容区 mock */}
			<div className="space-y-2.5 p-3">
				<div className="flex items-center justify-between">
					<div className="space-y-1.5">
						<div className="h-2.5 w-28 rounded-full mock_item_bg" />
						<div className="h-2 w-40 rounded-full mock_item_bg" />
					</div>
					<div
						className={`h-9 w-9 rounded-lg opacity-80`}
						style={{
							background: `linear-gradient(145deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBgHover} 100%)`,
						}}
					/>
				</div>
				<div className="grid grid-cols-3 gap-2.5">
					{["#E6F0FF", "#EEF4FF", "#F1F5FB"].map((_, i) => (
						<div key={i} className="mock_item_bg py-1">
							<div className="h-2 w-3/4 rounded-full bg-slate-200 mb-1" />
							<div className="h-3 w-1/2 rounded-full bg-slate-200" />
						</div>
					))}
				</div>
				{/* 折线图 mock */}
				<div className="flex h-20 items-end gap-1.5 rounded-lg p-2.5 mock_item_bg">
					{[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
						<div
							key={i}
							className="flex-1 rounded-t-xl mock_bar"
							style={{
								height: `${h}%`,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default Login;
