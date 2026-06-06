import React, { useState, useCallback, useMemo, useRef } from "react";
import { Tag, Button, Space, Popconfirm, Switch, Avatar } from "antd";
import { IconPlus } from "@tabler/icons-react";
import {
	ProTable,
	ProTableColumnType,
	ProTableProps,
	ProTableSearchConfig,
} from "@/components/ProTable";
import { ProForm } from "@/components/ProForm";
import type {
	ProFormInstance,
	FormFieldItem,
	FormValues,
} from "@/components/ProForm";
import { Api } from "@/apis";
import type { IApi } from "@/apis";

const ROLE_MAP: Record<string, string> = {
	admin: "管理员",
	editor: "编辑员",
	viewer: "观察员",
};
const ROLE_COLORS: Record<string, string> = {
	admin: "red",
	editor: "blue",
	viewer: "green",
};

const searchConfig: ProTableSearchConfig = {
	fields: [
		{
			type: "input",
			name: "username",
			label: "用户名",
			fieldProps: { placeholder: "请输入用户名", allowClear: true },
		},
		{
			type: "select",
			name: "status",
			label: "状态",
			fieldProps: {
				placeholder: "请选择",
				allowClear: true,
				options: [
					{ label: "启用", value: "1" },
					{ label: "禁用", value: "0" },
				],
			},
		},
	],
	defaultShowCount: 2,
};

const UserManagement: React.FC = () => {
	const modalRef = useRef<ProFormInstance>(null);
	const [isEdit, setIsEdit] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	// 新增
	const openAdd = useCallback(() => {
		setIsEdit(false);
		modalRef.current?.open({
			title: "新增用户",
			initialValues: { status: true, role: "editor" },
		});
	}, []);

	// 编辑
	const openEdit = useCallback((record: IApi.UserItem) => {
		setIsEdit(true);
		modalRef.current?.open({
			title: "编辑用户",
			initialValues: { ...record, status: record.status === 1 },
			extraParams: { id: record.id },
		});
	}, []);

	// 表单确认回调
	const handleConfirm = useCallback(
		async (
			title: string,
			values: FormValues,
			extraParams?: Record<string, any>,
		) => {
			const payload: any = { ...values, status: values.status ? 1 : 0 };
			if (title.includes("新增") && !payload.password) {
				delete payload.password;
			}
			if (title.includes("新增")) {
				delete payload.password; // 编辑时不修改密码
				await Api.saveUser({ ...payload, id: extraParams?.id } as IApi.UserReq);
				window.$message?.success?.("编辑成功");
			} else {
				await Api.saveUser(payload as IApi.UserReq);
				window.$message?.success?.("新增成功");
			}
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	const handleDelete = useCallback(async (id: string) => {
		await Api.deleteUser(id);
		window.$message?.success?.("删除成功");
		setRefreshKey((k) => k + 1);
	}, []);

	const handleStatusChange = useCallback(
		async (record: IApi.UserItem, checked: boolean) => {
			await Api.saveUser({
				...record,
				status: checked ? 1 : 0,
			} as IApi.UserReq);
			window.$message?.success?.(
				`已${checked ? "启用" : "禁用"}: ${record.nickname}`,
			);
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	const columns: ProTableColumnType<IApi.UserItem>[] = useMemo(
		() => [
			{
				title: "用户名",
				dataIndex: "username",
				key: "username",
				width: 120,
				render: (v: string) => (
					<Space>
						<Avatar size="small" style={{ backgroundColor: "#1677ff" }}>
							{v[0]}
						</Avatar>
						<span>{v}</span>
					</Space>
				),
			},
			{ title: "昵称", dataIndex: "nickname", key: "nickname", width: 100 },
			{
				title: "邮箱",
				dataIndex: "email",
				key: "email",
				width: 200,
				ellipsis: true,
			},
			{ title: "电话", dataIndex: "phone", key: "phone", width: 130 },
			{
				title: "角色",
				dataIndex: "role",
				key: "role",
				width: 90,
				render: (v: string) => (
					<Tag color={ROLE_COLORS[v] || "default"}>{ROLE_MAP[v] || v}</Tag>
				),
			},
			{
				title: "状态",
				dataIndex: "status",
				key: "status",
				width: 80,
				align: "center",
				hideable: false,
				render: (_: unknown, record: IApi.UserItem) => (
					<Switch
						size="small"
						checked={record.status === 1}
						onChange={(c) => handleStatusChange(record, c)}
					/>
				),
			},
			{
				title: "创建时间",
				dataIndex: "createTime",
				key: "createTime",
				width: 160,
			},
			{
				title: "操作",
				key: "actions",
				width: 150,
				fixed: "right",
				hideable: false,
				fixable: false,
				render: (_: unknown, record: IApi.UserItem) => (
					<Space>
						<Button type="link" size="small" onClick={() => openEdit(record)}>
							编辑
						</Button>
						<Popconfirm
							title="确定删除？"
							onConfirm={() => handleDelete(record.id)}
						>
							<Button type="link" size="small" danger>
								删除
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[handleStatusChange, handleDelete, openEdit],
	);

	// 表单字段：编辑时隐藏密码字段
	const formFields: FormFieldItem[] = useMemo(
		() => [
			{
				type: "input",
				name: "username",
				label: "用户名",
				formItemProps: { rules: [{ required: true, message: "请输入用户名" }] },
				fieldProps: { placeholder: "请输入用户名", allowClear: true },
			},
			{
				type: "input",
				name: "nickname",
				label: "昵称",
				formItemProps: { rules: [{ required: true, message: "请输入昵称" }] },
				fieldProps: { placeholder: "请输入昵称", allowClear: true },
			},
			{
				type: "input",
				name: "email",
				label: "邮箱",
				formItemProps: {
					rules: [
						{ required: true, message: "请输入邮箱" },
						{ type: "email", message: "邮箱格式不正确" },
					],
				},
				fieldProps: { placeholder: "请输入邮箱", allowClear: true },
			},
			{
				type: "input",
				name: "phone",
				label: "电话",
				fieldProps: { placeholder: "请输入电话", allowClear: true },
			},
			{
				type: "select",
				name: "role",
				label: "角色",
				formItemProps: { rules: [{ required: true, message: "请选择角色" }] },
				fieldProps: {
					placeholder: "请选择",
					options: Object.entries(ROLE_MAP).map(([v, l]) => ({
						label: l,
						value: v,
					})),
				},
			},
			{
				type: "switch",
				name: "status",
				label: "启用状态",
				fieldProps: { checkedChildren: "启用", unCheckedChildren: "禁用" },
			},
			{
				type: "input-password",
				name: "password",
				label: "密码",
				visible: !isEdit,
				formItemProps: {
					rules: isEdit ? [] : [{ required: true, message: "请输入密码" }],
				},
				fieldProps: { placeholder: "请输入密码", allowClear: true },
			},
		],
		[isEdit],
	);

	const tableProps: ProTableProps<IApi.UserItem> = useMemo(() => {
		return {
			key: refreshKey,
			title: "用户管理",
			rowKey: "id" as const,
			index: true,
			columns,
			api: async (params) => {
				const res = await Api.getUserList(params);
				return { data: res.data, total: res.total };
			},
			search: searchConfig,
			toolbarExtra: (
				<Button type="primary" icon={<IconPlus size={16} />} onClick={openAdd}>
					新增用户
				</Button>
			),
		};
	}, [refreshKey, columns, openAdd]);

	return (
		<div className="flex flex-col gap-4">
			<ProTable<IApi.UserItem> {...tableProps} />

			<ProForm
				ref={modalRef}
				type="modal"
				fields={formFields}
				onConfirm={handleConfirm}
			/>
		</div>
	);
};

export default UserManagement;
