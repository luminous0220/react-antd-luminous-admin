import React, { useState, useRef } from "react";
import { Card, Steps, Alert, Button, Result, Descriptions, Space } from "antd";
import {
	ProForm,
	type ProFormFields,
	type ProFormInstance,
} from "@/components/ProForm";

interface TransferFormValues {
	payeeName: string;
	payeeAccount: string;
	transferAmount: number;
	transferRemark?: string;
}

const INITIAL_VALUES: TransferFormValues = {
	payeeName: "张三",
	payeeAccount: "6222 0000 1234 5678",
	transferAmount: 10000,
	transferRemark: "货款转账",
};

const STEPS = [
	{ title: "填写转账信息" },
	{ title: "确认转账详情" },
	{ title: "转账完成" },
];

const TRANSFER_FIELDS: ProFormFields = [
	{
		type: "input",
		name: "payeeName",
		label: "收款人姓名",
		rules: [{ required: true, message: "请输入收款人姓名" }],
		fieldProps: { placeholder: "请输入收款人姓名" },
	},
	{
		type: "input",
		name: "payeeAccount",
		label: "收款账号",
		rules: [{ required: true, message: "请输入收款账号" }],
		fieldProps: { placeholder: "请输入收款账号" },
	},
	{
		type: "input-number",
		name: "transferAmount",
		label: "转账金额",
		rules: [
			{ required: true, message: "请输入转账金额" },
			{
				validator: (_: unknown, value: number) => {
					if (value != null && value <= 0) {
						return Promise.reject(new Error("金额必须大于0"));
					}
					return Promise.resolve();
				},
			},
		],
		fieldProps: {
			placeholder: "请输入转账金额",
			min: 0.01,
			precision: 2,
			prefix: "¥",
			style: { width: "100%" },
		},
	},
	{
		type: "textarea",
		name: "transferRemark",
		label: "转账备注",
		fieldProps: {
			placeholder: "请输入转账备注（选填）",
			rows: 3,
			maxLength: 200,
			showCount: true,
		},
	},
];

function formatAmount(amount: number): string {
	return `¥${amount.toLocaleString("zh-CN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

const StepForm: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<TransferFormValues | null>(null);
	const [submitLoading, setSubmitLoading] = useState(false);
	const proFormRef = useRef<ProFormInstance>(null);

	const percent = Math.round(((currentStep + 1) / STEPS.length) * 100);

	// Step 1 → Step 2: validate and store data
	const handleStep1Next = async () => {
		const values = await proFormRef.current?.validate();
		if (values) {
			setFormData(values as unknown as TransferFormValues);
			setCurrentStep(1);
		}
	};

	// Step 2 → Step 3: simulated async submit
	const handleSubmit = async () => {
		setSubmitLoading(true);
		await new Promise<void>((resolve) => setTimeout(resolve, 2000));
		setSubmitLoading(false);
		setCurrentStep(2);
	};

	// Step 2 → Step 1: back to edit
	const handleBack = () => {
		setCurrentStep(0);
	};

	// Step 3 → Step 1: reset and start over
	const handleReset = () => {
		proFormRef.current?.resetFields();
		setFormData(null);
		setCurrentStep(0);
	};

	const handleViewBill = () => {
		const message = JSON.stringify(formData, null, 2);
		window.$message.info(message);
	};

	return (
		<Card className="max-w-[800px] mx-auto">
			<Alert
				title="转账业务说明"
				description="请仔细核对收款人信息，转账成功后无法撤销。"
				type="info"
				showIcon
				className="mb-6"
			/>

			<Steps
				current={currentStep}
				percent={percent}
				items={STEPS}
				className="mb-8"
			/>

			{/* Step 1 — always mounted to preserve form state when navigating back */}
			<div style={{ display: currentStep === 0 ? "block" : "none" }}>
				<ProForm
					type="pure"
					ref={proFormRef}
					fields={TRANSFER_FIELDS}
					initialValues={INITIAL_VALUES}
					footer={{
						confirmText: "下一步",
					}}
					onConfirm={handleStep1Next}
				/>
			</div>

			{/* Step 2 — confirmation */}
			{currentStep === 1 && (
				<div>
					<Descriptions bordered column={1} size="middle">
						<Descriptions.Item label="收款人姓名">
							{formData?.payeeName}
						</Descriptions.Item>
						<Descriptions.Item label="收款账号">
							{formData?.payeeAccount}
						</Descriptions.Item>
						<Descriptions.Item label="转账金额">
							{formData?.transferAmount != null
								? formatAmount(formData.transferAmount)
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="转账备注">
							{formData?.transferRemark || "无"}
						</Descriptions.Item>
					</Descriptions>

					<div className="mt-6 flex justify-end">
						<Space>
							<Button size="large" onClick={handleBack}>
								上一步
							</Button>
							<Button
								size="large"
								type="primary"
								loading={submitLoading}
								onClick={handleSubmit}
							>
								确认转账
							</Button>
						</Space>
					</div>
				</div>
			)}

			{/* Step 3 — complete */}
			{currentStep === 2 && (
				<div>
					<Result
						status="success"
						title="转账成功"
						subTitle={
							formData
								? `已向 ${formData.payeeName} 成功转账 ${formatAmount(formData.transferAmount)}`
								: ""
						}
					/>

					<Descriptions
						bordered
						column={1}
						size="middle"
						className="!max-w-[400px] mx-auto mt-6"
					>
						<Descriptions.Item label="收款人">
							{formData?.payeeName}
						</Descriptions.Item>
						<Descriptions.Item label="收款账号">
							{formData?.payeeAccount}
						</Descriptions.Item>
						<Descriptions.Item label="转账金额">
							{formData?.transferAmount != null
								? formatAmount(formData.transferAmount)
								: "-"}
						</Descriptions.Item>
						<Descriptions.Item label="转账备注">
							{formData?.transferRemark || "无"}
						</Descriptions.Item>
					</Descriptions>

					<div className="text-center mt-8">
						<Space>
							<Button type="primary" size="large" onClick={handleReset}>
								再转一笔
							</Button>
							<Button size="large" onClick={handleViewBill}>
								查看账单
							</Button>
						</Space>
					</div>
				</div>
			)}
		</Card>
	);
};

export default StepForm;
