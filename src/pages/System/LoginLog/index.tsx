import React, { useMemo } from "react";
import { Tag } from "antd";
import { ProTable, ProTableColumnType, ProTableSearchConfig } from "@/components/ProTable";
import { Api } from "@/apis";
import type { IApi } from "@/apis";

const searchConfig: ProTableSearchConfig = {
	fields: [
		{ type: "input", name: "username", label: "用户名", fieldProps: { placeholder: "请输入用户名", allowClear: true } },
		{ type: "input", name: "ip", label: "IP 地址", fieldProps: { placeholder: "请输入 IP", allowClear: true } },
		{
			type: "select", name: "status", label: "状态",
			fieldProps: { placeholder: "请选择", allowClear: true, options: [{ label: "成功", value: "1" }, { label: "失败", value: "0" }] },
		},
	],
	defaultShowCount: 3,
};

const LoginLog: React.FC = () => {
	const columns: ProTableColumnType<IApi.LoginLogItem>[] = useMemo(
		() => [
			{ title: "用户名", dataIndex: "username", key: "username", width: 110, render: (v: string) => <Tag color="blue">{v}</Tag> },
			{ title: "IP 地址", dataIndex: "ip", key: "ip", width: 140, render: (v: string) => <Tag>{v}</Tag> },
			{ title: "登录地点", dataIndex: "location", key: "location", width: 110 },
			{ title: "浏览器", dataIndex: "browser", key: "browser", width: 120 },
			{ title: "操作系统", dataIndex: "os", key: "os", width: 120 },
			{
				title: "状态", dataIndex: "status", key: "status", width: 80, align: "center",
				render: (v: number) => (v === 1 ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>),
			},
			{
				title: "消息", dataIndex: "message", key: "message", width: 120, ellipsis: true,
				render: (v: string) => <span className={v === "登录成功" ? "text-green-600" : "text-red-500"}>{v}</span>,
			},
			{ title: "登录时间", dataIndex: "loginTime", key: "loginTime", width: 170 },
		],
		[],
	);

	return (
		<div className="flex flex-col gap-4">
			<ProTable<IApi.LoginLogItem>
				title="登录日志"
				rowKey="id"
				columns={columns}
				search={searchConfig}
				api={async (params) => {
					const res = await Api.getLoginLogList(params);
					return { data: res.data, total: res.total };
				}}
			/>
		</div>
	);
};

export default LoginLog;
