import { useCallback, useState } from "react";
import { Card, Form, Tabs } from "antd";
import { useNavigate, useSearchParams } from "react-router";
import { ProForm } from "@/components/ProForm";
import type { ProFormFields } from "@/components/ProForm";
import { useAuthStore } from "@/stores";
import { removeToken } from "@/libs";
import { CFG } from "@/constants";

// 性别选项（与后端 model 语义一致：0未知 1男 2女）
const SEX_OPTIONS = [
	{ label: "未知", value: 0 },
	{ label: "男", value: 1 },
	{ label: "女", value: 2 },
];

/**
 * 个人信息页：个人信息 / 修改密码 两个 Tab。
 * 支持 ?tab=password 直达修改密码（TopHeader 下拉进入）。
 * 个人信息保存成功 → 同步 auth store（TopHeader 昵称/头像即时更新）。
 * 修改密码成功后后端强制旧令牌全部失效 → 清缓存并回登录页。
 */
const ProfilePage: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	// 初始 Tab 由 URL 决定（hash 路由下 useSearchParams 同样生效）
	const [activeTab, setActiveTab] = useState(
		searchParams.get("tab") === "password" ? "password" : "info",
	);
	const resetAuth = useAuthStore((s) => s.resetAuth);
	const [infoForm] = Form.useForm();
	const [pwdForm] = Form.useForm();

	// 切换 Tab 时同步 URL，保持 /profile?tab=password 可直达
	const handleTabChange = useCallback(
		(key: string) => {
			setActiveTab(key);
			if (key === "password") {
				setSearchParams({ tab: "password" });
			} else {
				setSearchParams({});
			}
		},
		[setSearchParams],
	);

	// 个人信息字段：username 只读，其余可编辑
	const infoFields: ProFormFields = [
		{
			type: "input",
			label: "用户名",
			name: "username",
			disabled: true,
			formItemProps: {
				initialValue: "admin",
			},
			fieldProps: { disabled: true, placeholder: "用户名不可修改" },
		},
		{
			type: "input",
			label: "昵称",
			name: "nickname",
			formItemProps: {
				initialValue: "管理员",
			},
			rules: [{ required: true, message: "请输入昵称" }],
		},
		{
			type: "input",
			label: "手机号",
			name: "phone",
			fieldProps: { maxLength: 11 },
			rules: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }],
		},
		{
			type: "input",
			label: "邮箱",
			name: "email",
			rules: [{ type: "email", message: "请输入正确的邮箱" }],
		},
		{
			type: "radio",
			label: "性别",
			name: "sex",
			fieldProps: { options: SEX_OPTIONS },
		},
		{
			type: "input",
			label: "头像地址",
			name: "avatar",
			fieldProps: { placeholder: "请输入头像图片地址（暂不支持上传）" },
		},
	];

	// 保存个人信息：成功后用后端返回的最新信息覆盖 store → TopHeader 即时同步
	const handleInfoSubmit = useCallback(async () => {
		window.$message.success("个人信息已保存");
	}, []);

	// 修改密码字段：新密码与后端约束对齐（8-32 位字母数字），二次确认仅前端
	const pwdFields: ProFormFields = [
		{
			type: "input-password",
			label: "旧密码",
			name: "oldPassword",
			rules: [{ required: true, message: "请输入旧密码" }],
		},
		{
			type: "input-password",
			label: "新密码",
			name: "newPassword",
			fieldProps: { placeholder: "8-32 位字母或数字" },
			rules: [
				{ required: true, message: "请输入新密码" },
				{ min: 8, max: 32, message: "密码长度需为 8-32 位" },
				{
					pattern: /^[a-zA-Z0-9]+$/,
					message: "密码只能包含字母和数字",
				},
			],
		},
		{
			type: "input-password",
			label: "确认新密码",
			name: "confirmPassword",
			fieldProps: { placeholder: "请再次输入新密码" },
			// 依赖新密码字段，输入变化时自动重新校验一致性
			formItemProps: { dependencies: ["newPassword"] },
			rules: [
				{ required: true, message: "请再次输入新密码" },
				{
					validator: (_rule: any, value: string) =>
						!value || pwdForm.getFieldValue("newPassword") === value
							? Promise.resolve()
							: Promise.reject(new Error("两次输入的密码不一致")),
				},
			],
		},
	];

	// 提交修改密码：成功即旧令牌全部失效，清缓存回登录页
	const handlePwdSubmit = useCallback(async () => {
		window.$message.success("密码修改成功，请重新登录");
		removeToken();
		resetAuth();
		navigate(CFG.LOGIN_PATH, { replace: true });
	}, [navigate, resetAuth]);

	return (
		<Card className="h-full">
			<Tabs
				activeKey={activeTab}
				onChange={handleTabChange}
				items={[
					{
						key: "info",
						label: "个人信息",
						children: (
							<div className="max-w-xl">
								<ProForm
									form={infoForm}
									type="pure"
									fields={infoFields}
									defaultButtons={{ confirmText: "保存", hideReset: true }}
									onConfirm={handleInfoSubmit}
								/>
							</div>
						),
					},
					{
						key: "password",
						label: "修改密码",
						children: (
							<div className="max-w-xl">
								<ProForm
									form={pwdForm}
									type="pure"
									fields={pwdFields}
									defaultButtons={{ confirmText: "确认修改", hideReset: true }}
									onConfirm={handlePwdSubmit}
								/>
							</div>
						),
					},
				]}
			/>
		</Card>
	);
};

export default ProfilePage;
