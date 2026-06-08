import { Button, Space } from "antd";

/** SelectorFooter Props */
export interface SelectorFooterProps {
	/** 当前已选数量 */
	selectedCount: number;
	/** 取消回调 */
	onCancel: () => void;
	/** 确认回调 */
	onConfirm: () => void;
}

/**
 * @description 选择器底部操作栏 — 显示已选数量 + 取消/确定按钮
 * TreeSelector 和 TableSelector 共用
 */
export const SelectorFooter: React.FC<SelectorFooterProps> = ({
	selectedCount,
	onCancel,
	onConfirm,
}) => {
	return (
		<div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--ant-color-border)]">
			<span className="text-gray-500 text-sm">
				当前已选择{" "}
				<span className="text-[var(--ant-color-primary)] font-semibold">
					{selectedCount}
				</span>{" "}
				项
			</span>
			<Space>
				<Button size="large" onClick={onCancel}>
					取消
				</Button>
				<Button size="large" type="primary" onClick={onConfirm}>
					确定
				</Button>
			</Space>
		</div>
	);
};
