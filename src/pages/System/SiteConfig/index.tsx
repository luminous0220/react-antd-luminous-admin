import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Button, Card } from "antd";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { ProForm } from "@/components/ProForm";
import type { ProFormInstance, FormFieldItem } from "@/components/ProForm";
import { Api } from "@/apis";

const SiteConfig: React.FC = () => {
	const formRef = useRef<ProFormInstance>(null);

	// 加载配置
	const loadConfig = useCallback(async () => {
		try {
			const config = await Api.getSiteConfig();
			formRef.current?.setFieldsValue(config);
		} catch {
			window.$message?.error?.("加载网站配置失败");
		}
	}, []);

	useEffect(() => {
		loadConfig();
	}, [loadConfig]);

	// 保存配置
	const handleSave = useCallback(async () => {
		try {
			const values = await formRef.current?.validate?.();
			if (values) {
				await Api.saveSiteConfig(values as IApi.SiteConfigItem);
				window.$message?.success?.("网站配置保存成功");
			}
		} catch {
			// validate 内部已处理错误提示
		}
	}, []);

	const formFields: FormFieldItem[] = useMemo(
		() => [
			// 基本信息
			{ type: "divider", label: "基本信息" },
			{ type: "input", name: "siteName", label: "网站名称", formItemProps: { rules: [{ required: true, message: "请输入网站名称" }] }, fieldProps: { placeholder: "如: Luminous Admin" } },
			{ type: "input", name: "logo", label: "Logo URL", fieldProps: { placeholder: "Logo 图片地址" } },
			{ type: "input", name: "favicon", label: "Favicon URL", fieldProps: { placeholder: "网站图标地址" } },
			{ type: "input", name: "contactEmail", label: "联系邮箱", fieldProps: { placeholder: "admin@example.com" } },
			// SEO 配置
			{ type: "divider", label: "SEO 配置" },
			{ type: "input", name: "keywords", label: "SEO 关键词", fieldProps: { placeholder: "多个关键词用英文逗号分隔", allowClear: true } },
			{ type: "textarea", name: "description", label: "网站描述", fieldProps: { placeholder: "用于 SEO 的网站描述（建议 80-160 字符）", rows: 3, allowClear: true, showCount: true, maxLength: 200 } },
			// 页脚配置
			{ type: "divider", label: "页脚配置" },
			{ type: "textarea", name: "copyright", label: "版权信息", fieldProps: { placeholder: "如: © 2024 Luminous Admin. All rights reserved.", rows: 2, allowClear: true } },
			{ type: "input", name: "icp", label: "ICP 备案号", fieldProps: { placeholder: "如: 京ICP备12345678号" } },
		],
		[],
	);

	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold m-0">网站配置</h2>
				<Button type="primary" icon={<IconDeviceFloppy size={16} />} onClick={handleSave} size="large">
					保存配置
				</Button>
			</div>

			<Card classNames={{ header: "!bg-[var(--ant-color-bg-layout)]" }}>
				<ProForm
					ref={formRef}
					type="pure"
					fields={formFields}
					footer={null}
					labelCol={{ style: { width: 110 } }}
				/>
			</Card>
		</div>
	);
};

export default SiteConfig;
