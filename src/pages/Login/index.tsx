import { useRef, useEffect, useState, useMemo } from "react";
import { Button, Checkbox, ConfigProvider, theme, Form } from "antd";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Api, IApi } from "@/apis";
import { setToken, setItem, getItem, removeItem } from "@/libs/storage";
import { CFG } from "@/constants";
import { useNavigate } from "react-router";
import { IconSun, IconMoon } from "@tabler/icons-react";
import {
	useThemeStore,
	PRESET_COLORS,
	generateColorVariants,
	PresetColorKey,
} from "@/stores/theme";
import { ProForm, FormFieldItem, ProFormInstance } from "@/components/ProForm";

// 记住密码存储的键
const REMEMBER_KEY = CFG.REMEMBER_KEY;
// 30天过期时间
const REMEMBER_TTL = 30 * 24 * 60 * 60 * 1000;

// 副标题
const SUB_TITLE = "智能高效，赋能企业数字化管理新征程";

/** 表单区域子元素错峰入场配置 */
const fadeUp = {
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.45, ease: "easeOut" as const },
};

const Login = () => {
	const formRef = useRef<ProFormInstance>(null);
	const navigate = useNavigate();
	const [remember, setRemember] = useState(false);

	const { isDark, toggleDark, setPresetColor, colorPrimary } = useThemeStore();

	// 根据主题色生成颜色变体
	const colorVariants = useMemo(
		() => generateColorVariants(colorPrimary, isDark),
		[colorPrimary, isDark],
	);

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
			<div className="min-h-screen flex">
				{/* 左侧品牌展示区 */}
				<div className="hidden lg:flex lg:w-[60%] xl:w-[65%] relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-zinc-900">
					{/* 玻璃拟态背景层 */}
					<div className="absolute inset-0">
						{/* 装饰性玻璃卡片 */}
						<div
							className="absolute top-20 left-20 w-32 h-32 backdrop-blur-xl rounded-3xl shadow-lg"
							style={{
								backgroundColor: colorVariants.lightest,
								borderColor: colorVariants.borderLight,
							}}
						/>
						<div
							className="absolute top-40 right-20 w-48 h-48 backdrop-blur-2xl rounded-4xl"
							style={{
								backgroundColor: isDark
									? "rgba(255,255,255,0.05)"
									: "rgba(255,255,255,0.2)",
								borderColor: colorVariants.border,
							}}
						/>
						<div
							className="absolute bottom-20 left-40 w-64 h-40 backdrop-blur-xl rounded-3xl"
							style={{
								backgroundColor: colorVariants.lighter,
								borderColor: colorVariants.border,
							}}
						/>
						<div
							className="absolute bottom-40 right-10 w-24 h-24 backdrop-blur-lg rounded-2xl"
							style={{ backgroundColor: colorVariants.lightest }}
						/>
					</div>

					{/* 网格装饰 */}
					<div className="absolute inset-0 opacity-10 dark:opacity-5">
						<svg
							className="w-full h-full"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<defs>
								<pattern
									id="grid"
									width="10"
									height="10"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 10 0 L 0 0 0 10"
										fill="none"
										stroke={colorVariants.primary}
										strokeWidth="0.3"
									/>
								</pattern>
							</defs>
							<rect width="100" height="100" fill="url(#grid)" />
						</svg>
					</div>

					{/* 顶部 Logo */}
					<div className="absolute top-8 left-8 flex items-center gap-3">
						<div
							className="w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center shadow-lg"
							style={{
								backgroundColor: isDark
									? "rgba(255,255,255,0.2)"
									: "rgba(255,255,255,0.6)",
								borderColor: colorVariants.borderLight,
							}}
						>
							<svg
								viewBox="0 0 24 24"
								className="w-8 h-8"
								fill="currentColor"
								style={{ color: colorVariants.primary }}
							>
								<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
							</svg>
						</div>
						<span
							className="text-xl font-semibold"
							style={{ color: colorVariants.textPrimary }}
						>
							{CFG.SYSTEM_NAME}
						</span>
					</div>

					{/* 中间科技感插画区域 */}
					<div className="absolute inset-0 flex items-center justify-center p-8">
						<div className="relative w-full max-w-lg">
							{/* 主卡片 - 数据大屏 */}
							<div
								className="backdrop-blur-md rounded-2xl p-6 shadow-2xl float-main-card"
								style={{
									backgroundColor: isDark
										? "rgba(31,41,55,0.5)"
										: "rgba(255,255,255,0.5)",
									borderColor: isDark
										? "rgba(55,65,81,0.5)"
										: "rgba(255,255,255,0.6)",
								}}
							>
								{/* 顶部状态栏 */}
								<div className="flex items-center gap-2 mb-4">
									<div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
									<span
										className="text-sm"
										style={{ color: colorVariants.textSecondary }}
									>
										System Running
									</span>
								</div>

								{/* 模拟图表 */}
								<div className="grid grid-cols-3 gap-4 mb-4">
									<div
										className="backdrop-blur rounded-lg p-3"
										style={{
											backgroundColor: isDark
												? "rgba(55,65,81,0.4)"
												: "rgba(255,255,255,0.4)",
											borderColor: isDark
												? "rgba(75,85,99,0.3)"
												: "rgba(255,255,255,0.3)",
										}}
									>
										<div
											className="text-xs mb-1"
											style={{ color: colorVariants.textSecondary }}
										>
											Total Users
										</div>
										<div
											className="text-xl font-bold"
											style={{ color: colorVariants.textPrimary }}
										>
											12,847
										</div>
										<div className="text-emerald-500 dark:text-emerald-400 text-xs mt-1">
											↑ 12.5%
										</div>
									</div>
									<div
										className="backdrop-blur rounded-lg p-3"
										style={{
											backgroundColor: isDark
												? "rgba(55,65,81,0.4)"
												: "rgba(255,255,255,0.4)",
											borderColor: isDark
												? "rgba(75,85,99,0.3)"
												: "rgba(255,255,255,0.3)",
										}}
									>
										<div
											className="text-xs mb-1"
											style={{ color: colorVariants.textSecondary }}
										>
											Activity
										</div>
										<div
											className="text-xl font-bold"
											style={{ color: colorVariants.textPrimary }}
										>
											89.2%
										</div>
										<div className="text-emerald-500 dark:text-emerald-400 text-xs mt-1">
											↑ 5.3%
										</div>
									</div>
									<div
										className="backdrop-blur rounded-lg p-3"
										style={{
											backgroundColor: isDark
												? "rgba(55,65,81,0.4)"
												: "rgba(255,255,255,0.4)",
											borderColor: isDark
												? "rgba(75,85,99,0.3)"
												: "rgba(255,255,255,0.3)",
										}}
									>
										<div
											className="text-xs mb-1"
											style={{ color: colorVariants.textSecondary }}
										>
											Tasks Done
										</div>
										<div
											className="text-xl font-bold"
											style={{ color: colorVariants.textPrimary }}
										>
											1,234
										</div>
										<div className="text-emerald-500 dark:text-emerald-400 text-xs mt-1">
											↑ 8.7%
										</div>
									</div>
								</div>

								{/* 模拟趋势图 */}
								<div
									className="backdrop-blur rounded-lg p-4 h-32 flex items-end gap-2"
									style={{
										backgroundColor: isDark
											? "rgba(55,65,81,0.3)"
											: "rgba(255,255,255,0.3)",
										borderColor: isDark
											? "rgba(75,85,99,0.2)"
											: "rgba(255,255,255,0.2)",
									}}
								>
									{[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
										(h, i) => (
											<div
												key={i}
												className="flex-1 rounded-t"
												style={{
													height: `${h}%`,
													background: `linear-gradient(to top, ${colorVariants.gradientEnd}, ${colorVariants.primary})`,
												}}
											/>
										),
									)}
								</div>
							</div>

							{/* 云元素装饰 */}

							<div
								className="absolute -bottom-8 -left-8 w-24 h-24 backdrop-blur-2xl rounded-full float-main-card animate-delay-1500"
								style={{ backgroundColor: colorVariants.lightest }}
							/>

							{/* 浮动小卡片 */}
							<div
								className="absolute -top-4 -right-4 backdrop-blur rounded-lg p-3 shadow-lg float-main-card animate-delay-800"
								style={{
									backgroundColor: isDark
										? "rgba(31,41,55,0.5)"
										: "rgba(255,255,255,0.5)",
									borderColor: colorVariants.border,
								}}
							>
								<svg
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									style={{ color: colorVariants.primary }}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 002-2h2a2 2 0 002 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 002-2h2a2 2 0 002 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* 底部文案 */}
					<div className="absolute top-8 right-8">
						<h1
							className="text-xl font-bold mb-2"
							style={{ color: colorVariants.textPrimary }}
						>
							{CFG.SYSTEM_NAME}
						</h1>
						<p style={{ color: colorVariants.textSecondary }}>{SUB_TITLE}</p>
					</div>
				</div>

				{/* 右侧登录功能区 */}
				<div className="flex-1 flex flex-col bg-white dark:bg-[#071124] relative shadow-[-4px_0_24px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_24px_rgba(0,0,0,0.3)]">
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
						{/* 主题模式切换 */}
						<button
							onClick={handleThemeChange}
							className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
					</div>

					{/* 登录表单区域 */}
					<motion.div
						className="md:p-16 flex-1 flex items-center justify-center p-8"
						initial={{ opacity: 0, y: -40 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, ease: "easeOut" as const }}
					>
						<div className="w-[95%] xl:w-full">
							{/* 欢迎文案 */}
							<motion.div
								className="mb-8"
								{...fadeUp}
								transition={{ ...fadeUp.transition, delay: 0.1 }}
							>
								<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
									欢迎回来 👋
								</h2>
								<p className="text-gray-500 dark:text-gray-400">
									请输入您的帐户信息以开始管理您的项目
								</p>
							</motion.div>

							{/* 登录表单 */}
							<motion.div
								{...fadeUp}
								transition={{ ...fadeUp.transition, delay: 0.2 }}
							>
								<ProForm
									type="pure"
									ref={formRef}
									fields={formItems}
									layout="vertical"
									footer={null}
									autoComplete="off"
									size="large"
								/>
							</motion.div>

							<motion.div
								className="mt-4"
								{...fadeUp}
								transition={{ ...fadeUp.transition, delay: 0.3 }}
							>
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
									loading={loginMutation.isPending}
									onClick={handleSubmit}
								>
									登录
								</Button>
							</motion.div>

							{/* 页脚版权 */}
							<motion.div
								className="mt-8 text-center text-gray-400 text-sm"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4, delay: 0.5 }}
							>
								Copyright © 2024 zhanyyi. All rights reserved.
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</ConfigProvider>
	);
};

export default Login;
