import React, { useState, useCallback, useMemo, useRef } from "react";
import { Tag, Button, Space, Popconfirm, Switch } from "antd";
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
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const searchConfig: ProTableSearchConfig = {
	fields: [
		{
			type: "input",
			name: "name",
			label: "岗位名称",
			fieldProps: { placeholder: "请输入岗位名称", allowClear: true },
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

const Post: React.FC = () => {
	const modalRef = useRef<ProFormInstance>(null);
	const [refreshKey, setRefreshKey] = useState(0);

	const openAdd = useCallback(() => {
		modalRef.current?.open({
			title: "新增岗位",
			initialValues: { status: true, sort: 10 },
		});
	}, []);

	const openEdit = useCallback((record: IApi.PostItem) => {
		modalRef.current?.open({
			title: "编辑岗位",
			initialValues: { ...record, status: record.status === 1 },
			extraParams: { id: record.id },
		});
	}, []);

	const handleConfirm = useCallback(
		async (
			title: string,
			values: FormValues,
			extraParams?: Record<string, any>,
		) => {
			const payload = { ...values, status: values.status ? 1 : 0 };
			if (title === "新增岗位") {
				await Api.savePost(payload as IApi.PostReq);
				window.$message?.success?.("新增成功");
			} else {
				await Api.savePost({ ...payload, id: extraParams?.id } as IApi.PostReq);
				window.$message?.success?.("编辑成功");
			}
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	const handleDelete = useCallback(async (id: string) => {
		await Api.deletePost(id);
		window.$message?.success?.("删除成功");
		setRefreshKey((k) => k + 1);
	}, []);

	const handleStatusChange = useCallback(
		async (record: IApi.PostItem, checked: boolean) => {
			await Api.savePost({
				...record,
				status: checked ? 1 : 0,
			} as IApi.PostReq);
			window.$message?.success?.(
				`已${checked ? "启用" : "禁用"}: ${record.name}`,
			);
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	const columns: ProTableColumnType<IApi.PostItem>[] = useMemo(
		() => [
			{
				title: "岗位名称",
				dataIndex: "name",
				key: "name",
				width: 130,
				render: (v: string) => <Tag color="blue">{v}</Tag>,
			},
			{
				title: "岗位编码",
				dataIndex: "code",
				key: "code",
				width: 140,
				render: (v: string) => <Tag>{v}</Tag>,
			},
			{
				title: "排序",
				dataIndex: "sort",
				key: "sort",
				width: 70,
				align: "center",
			},
			{
				title: "状态",
				dataIndex: "status",
				key: "status",
				width: 80,
				align: "center",
				hideable: false,
				render: (_: unknown, record: IApi.PostItem) => (
					<Switch
						size="small"
						checked={record.status === 1}
						onChange={(c) => handleStatusChange(record, c)}
					/>
				),
			},
			{
				title: "描述",
				dataIndex: "desc",
				key: "desc",
				width: 240,
				ellipsis: true,
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
				render: (_: unknown, record: IApi.PostItem) => (
					<Space>
						<Button
							size="small"
							color="primary"
							variant="filled"
							icon={<EditOutlined />}
							onClick={() => openEdit(record)}
						>
							编辑
						</Button>
						<Popconfirm
							title="确定删除？"
							onConfirm={() => handleDelete(record.id)}
						>
							<Button
								size="small"
								color="danger"
								icon={<DeleteOutlined />}
								variant="filled"
							>
								删除
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[handleStatusChange, handleDelete, openEdit],
	);

	const formFields: FormFieldItem[] = useMemo(
		() => [
			{
				type: "input",
				name: "name",
				label: "岗位名称",
				formItemProps: {
					rules: [{ required: true, message: "请输入岗位名称" }],
				},
				fieldProps: { placeholder: "如: 部门经理", allowClear: true },
			},
			{
				type: "input",
				name: "code",
				label: "岗位编码",
				formItemProps: {
					rules: [{ required: true, message: "请输入岗位编码" }],
				},
				fieldProps: { placeholder: "如: manager", allowClear: true },
			},
			{
				type: "input-number",
				name: "sort",
				label: "排序",
				fieldProps: {
					placeholder: "数字越小越靠前",
					min: 1,
					style: { width: "100%" },
				},
			},
			{
				type: "switch",
				name: "status",
				label: "启用状态",
				fieldProps: { checkedChildren: "启用", unCheckedChildren: "禁用" },
			},
			{
				type: "textarea",
				name: "desc",
				label: "描述",
				fieldProps: { placeholder: "岗位描述", rows: 2, allowClear: true },
			},
		],
		[],
	);

	const tableProps: ProTableProps<IApi.PostItem> = useMemo(
		() => ({
			key: refreshKey,
			title: "岗位管理",
			rowKey: "id" as const,
			columns,
			search: searchConfig,
			api: async (params) => {
				const res = await Api.getPostList(params);
				return { data: res.data, total: res.total };
			},
			toolbarExtra: (
				<Button type="primary" icon={<IconPlus size={16} />} onClick={openAdd}>
					新增岗位
				</Button>
			),
		}),
		[refreshKey, columns, openAdd],
	);

	return (
		<div className="flex flex-col gap-4">
			<ProTable<IApi.PostItem> {...tableProps} />
			<ProForm
				ref={modalRef}
				type="modal"
				fields={formFields}
				onConfirm={handleConfirm}
			/>
		</div>
	);
};

export default Post;
