import { Button, Form } from "antd";
import { memo } from "react";
import type { ProFormProps } from "../types";

/** Footer 按钮组件（重置 + 确认） */
export const FormFooter = memo(function FormFooter({
	footer,
	loading,
	onConfirm,
	onReset,
}: {
	footer: NonNullable<ProFormProps["footer"]>;
	loading: boolean;
	onConfirm: () => void;
	onReset: () => void;
}) {
	const {
		confirmText = "确认",
		resetText = "重置",
		hideConfirm,
		hideReset,
		confirmStyle,
	} = footer;

	return (
		<Form.Item className="mb-0">
			<div className="flex items-center justify-end w-full gap-4">
				{!hideReset && <Button onClick={onReset}>{resetText}</Button>}
				{!hideConfirm && (
					<Button
						type="primary"
						{...confirmStyle}
						loading={loading}
						onClick={onConfirm}
					>
						{confirmText}
					</Button>
				)}
			</div>
		</Form.Item>
	);
});
