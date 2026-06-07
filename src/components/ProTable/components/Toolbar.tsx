import { memo } from "react";
import { Button, Dropdown, Popover, Typography } from "antd";
import {
	IconRefresh,
	IconBaselineDensityLarge,
	IconSettings,
	IconDownload,
} from "@tabler/icons-react";
import type { MenuProps } from "antd";
import type { ProTableDensity, ProTableToolbarProps } from "../types.d";
import { TableDragSort } from "./TableDragSort";

export const Toolbar = memo(function Toolbar({
	title,
	toolbarExtra,
	density,
	onDensityChange,
	onRefresh,
	columns,
	columnConfigs,
	onColumnConfigsChange,
	isMobile,
	exportable,
	onExport,
	selectedCount,
}: ProTableToolbarProps) {
	const densityItems: MenuProps["items"] = [
		{ key: "small", label: "紧凑" },
		{ key: "middle", label: "默认" },
		{ key: "large", label: "宽松" },
	];

	return (
		<div className="flex items-center justify-between py-2 shrink-0 gap-2 flex-wrap">
			<div className="flex items-center gap-2 min-w-0">
				{title && (
					<span
						className={`text-base font-medium whitespace-nowrap ${
							isMobile && "flex-wrap"
						}`}
					>
						{title}
					</span>
				)}
			</div>
			<div
				className={`flex items-center gap-1.5  ${isMobile ? "flex-wrap	" : ""}`}
			>
				{toolbarExtra}
				{exportable && (
					<Button
						icon={<IconDownload size={18} stroke={1.5} />}
						onClick={onExport}
						size="middle"
					>
						{selectedCount ? `导出(${selectedCount})` : "导出"}
					</Button>
				)}
				<Button
					icon={<IconRefresh size={18} stroke={1.5} />}
					onClick={onRefresh}
					size="middle"
				/>
				<Dropdown
					menu={{
						items: densityItems,
						selectedKeys: [density],
						onClick: ({ key }) => onDensityChange(key as ProTableDensity),
					}}
				>
					<Button
						icon={<IconBaselineDensityLarge size={18} stroke={1.5} />}
						size="middle"
					/>
				</Dropdown>

				<Popover
					content={
						<div className="max-w-64 mt-[-8px]">
							<Typography.Text type="secondary" className="text-xs">
								【拖拽/隐藏/固定列】
							</Typography.Text>
							<TableDragSort
								columns={columns}
								columnConfigs={columnConfigs}
								onColumnConfigsChange={onColumnConfigsChange}
							/>
						</div>
					}
					title="列设置"
					trigger="click"
					placement="bottomRight"
				>
					<Button icon={<IconSettings />} type="text" />
				</Popover>
			</div>
		</div>
	);
});
