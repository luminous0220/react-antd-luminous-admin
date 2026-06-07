import { Button, Card } from "antd";
import { IconX } from "@tabler/icons-react";

/** 已选项 */
export interface SelectedItem {
	value: number | string;
	title: string;
	desc?: string;
}

/** SelectedPanel Props */
export interface SelectedPanelProps {
	className?: string;
	bodyClassName?: string;
	/** 已选数据 */
	selectedItems: SelectedItem[];
	/** 单项删除回调 */
	onRemove: (item: SelectedItem) => void;
	/** 清空全部 */
	onClearAll: () => void;
}

/**
 * @description 选择器已选面板 — 展示已选项列表，支持单项删除和清空
 * TreeSelector 和 TableSelector 共用
 */
export const SelectedPanel: React.FC<SelectedPanelProps> = ({
	className = "",
	selectedItems,
	bodyClassName = "",
	onRemove,
	onClearAll,
}) => {
	return (
		<Card
			className={className}
			classNames={{
				header: "!bg-[var(--ant-color-bg-layout)]",
				body: bodyClassName,
			}}
			styles={{
				body: { padding: 12, overflow: "auto", maxHeight: "400px" },
			}}
			title={
				<div className="flex justify-between items-center">
					<span className="text-base">
						已选{" "}
						<span className="text-[var(--ant-color-primary)] font-semibold">
							{selectedItems.length}
						</span>
					</span>
					<Button
						type="link"
						size="small"
						onClick={onClearAll}
						disabled={!selectedItems.length}
					>
						清空
					</Button>
				</div>
			}
		>
			{selectedItems.length === 0 ? (
				<div className="text-gray-400 text-center py-12">暂无选择</div>
			) : (
				<div className="flex flex-col gap-2">
					{selectedItems.map((item) => (
						<div
							key={item.value}
							className="flex justify-between items-center border border-[var(--ant-color-border)]
								rounded-lg p-3 hover:border-[var(--ant-color-primary-border)]
								transition-colors bg-[var(--ant-color-bg-container)]"
						>
							<div className="min-w-0">
								<div className="font-medium truncate">{item.title}</div>
								{item.desc && (
									<div className="text-xs text-gray-500 mt-0.5 truncate">
										{item.desc}
									</div>
								)}
							</div>
							<Button
								type="text"
								size="small"
								icon={<IconX size={14} />}
								className="text-gray-400 hover:!text-red-500 shrink-0 ml-2"
								onClick={() => onRemove(item)}
							/>
						</div>
					))}
				</div>
			)}
		</Card>
	);
};
