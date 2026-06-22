import React, { useMemo } from "react";
import { Tag } from "antd";
import { ProTable, ProTableColumnType, ProTableSearchConfig } from "@/components/ProTable";
import { Api } from "@/apis";
import type { IApi } from "@/apis";

const MODULE_COLORS: Record<string, string> = {
	用户管理: "blue", 角色管理: "purple", 菜单管理: "cyan", 岗位管理: "orange", 字典管理: "green", 系统配置: "magenta",
};

const ACTION_COLORS: Record<string, string> = {
	新增: "green", 编辑: "blue", 删除: "red", 导出: "cyan", 导入: "orange", 启用: "lime", 禁用: "volcano",
};

const searchConfig: ProTableSearchConfig = {
	fields: [
		{ type: "input", name: "operator", label: "操作人", fieldProps: { placeholder: "请输入操作人", allowClear: true } },
		{ type: "input", name: "module", label: "模块", fieldProps: { placeholder: "请输入模块名称", allowClear: true } },
		{
			type: "select", name: "status", label: "状态",
			fieldProps: { placeholder: "请选择", allowClear: true, options: [{ label: "成功", value: "1" }, { label: "失败", value: "0" }] },
		},
	],
	defaultShowCount: 3,
};

const OperationLog: React.FC = () => {
	const columns: ProTableColumnType<IApi.OperationLogItem>[] = useMemo(
		() => [
			{ title: "操作人", dataIndex: "operator", key: "operator", width: 100, render: (v: string) => <Tag color="blue">{v}</Tag> },
			{
				title: "模块", dataIndex: "module", key: "module", width: 100,
				render: (v: string) => <Tag color={MODULE_COLORS[v] ?? "default"}>{v}</Tag>,
			},
			{
				title: "操作", dataIndex: "action", key: "action", width: 80, align: "center",
				render: (v: string) => <Tag color={ACTION_COLORS[v] ?? "default"}>{v}</Tag>,
			},
			{ title: "目标", dataIndex: "target", key: "target", width: 150, ellipsis: true },
			{ title: "IP 地址", dataIndex: "ip", key: "ip", width: 130, render: (v: string) => <Tag>{v}</Tag> },
			{
				title: "状态", dataIndex: "status", key: "status", width: 80, align: "center",
				render: (v: number) => (v === 1 ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>),
			},
			{ title: "详情", dataIndex: "detail", key: "detail", width: 160, ellipsis: true },
			{ title: "操作时间", dataIndex: "operationTime", key: "operationTime", width: 170 },
		],
		[],
	);

	return (
		<div className="flex flex-col gap-4">
			<ProTable<IApi.OperationLogItem>
				title="操作日志"
				rowKey="id"
				columns={columns}
				search={searchConfig}
				api={async (params) => {
					const res = await Api.getOperationLogList(params);
					return { data: res.data, total: res.total };
				}}
			/>
		</div>
	);
};

export default OperationLog;
