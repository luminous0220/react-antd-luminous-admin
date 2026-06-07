import { memo } from "react";
import { Alert, Button } from "antd";



export const SelectedInfo = memo(function SelectedInfo({
	selectedCount,
	onClear,
}: {
	selectedCount: number;
	onClear: () => void;
}) {
	if (selectedCount === 0) return null;

	return (
		<div className="shrink-0 mb-1">
			<Alert
				type="info"
				showIcon
				title={`已选择 ${selectedCount} 条`}
				action={
					<Button size="small" onClick={onClear}>
						取消选择
					</Button>
				}
			/>
		</div>
	);
});

/**
 * ProTable 增强表格组件
 * 继承 antd Table 所有 props，并增加自动请求、分页、工具栏等功能
 * 通过 ref 暴露 refresh / getDataSource / clearSelected / reset 等实例方法
 */
