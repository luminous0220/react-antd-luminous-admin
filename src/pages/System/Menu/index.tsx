import React, { useCallback, useMemo, useRef } from "react";
import { Tag, Button, Space, Popconfirm, Switch, Tooltip } from "antd";
import { IconPlus } from "@tabler/icons-react";
import {
	ProTable,
	ProTableColumnType,
	ProTableProps,
	ProTableRef,
} from "@/components/ProTable";
import { ProForm } from "@/components/ProForm";
import type {
	ProFormInstance,
	FormFieldItem,
	FormValues,
} from "@/components/ProForm";
import { Api } from "@/apis";
import type { IApi } from "@/apis";
import { IconMap, TablerIconMap } from "@/libs/iconMap";
import { cleanEmptyChildren } from "@/libs";

const TYPE_MAP: Record<number, string> = { 1: "目录", 2: "菜单" };
const TYPE_COLORS: Record<number, string> = { 1: "cyan", 2: "blue" };

const ICON_OPTIONS = [
	...Object.keys(IconMap).map((key) => ({ label: key, value: key })),
	...Object.keys(TablerIconMap).map((key) => ({ label: key, value: key })),
];

function renderIcon(iconName: string) {
	if (!iconName) return <span className="text-gray-400">-</span>;
	const antIcon = IconMap[iconName];
	if (antIcon) return <span className="text-base">{antIcon}</span>;
	const tablerIcon = TablerIconMap[iconName];
	if (tablerIcon) return <span className="text-base">{tablerIcon}</span>;
	return <Tag>{iconName}</Tag>;
}

const Menu: React.FC = () => {
	const modalRef = useRef<ProFormInstance>(null);
	const TableRef = useRef<ProTableRef>(null);

	// 新增
	const openAdd = useCallback(() => {
		modalRef.current?.open({
			title: "新增菜单",
			initialValues: { status: true, type: 2, sort: 1 },
		});
	}, []);

	// 编辑
	const openEdit = useCallback((record: IApi.MenuItem) => {
		modalRef.current?.open({
			title: "编辑菜单",
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
			const payload = { ...values, status: values.status ? 1 : 0 };
			if (title?.includes("新增菜单")) {
				await Api.saveMenu({ ...payload, id: extraParams?.id } as IApi.MenuReq);
				window.$message?.success?.("编辑成功");
			} else {
				await Api.saveMenu(payload as IApi.MenuReq);
				window.$message?.success?.("新增成功");
			}
		},
		[],
	);

	const handleDelete = useCallback(async (id: string) => {
		await Api.deleteMenu(id);
		window.$message?.success?.("删除成功");
	}, []);

	const handleStatusChange = useCallback(
		async (record: IApi.MenuItem, checked: boolean) => {
			await Api.saveMenu({
				...record,
				status: checked ? 1 : 0,
			} as IApi.MenuReq);
			window.$message?.success?.(
				`已${checked ? "启用" : "禁用"}: ${record.title}`,
			);
		},
		[],
	);

	const columns: ProTableColumnType<IApi.MenuItem>[] = useMemo(
		() => [
			{
				title: "标题",
				dataIndex: "title",
				key: "title",
				width: 140,
				render: (v: string) => <Tag color="blue">{v}</Tag>,
			},
			{
				title: "排序",
				dataIndex: "sort",
				key: "sort",
				width: 60,
				align: "center",
			},
			{
				title: "路径",
				dataIndex: "path",
				key: "path",
				width: 160,
				render: (v: string) => <Tag color="default">{v || "-"}</Tag>,
			},
			{
				title: "路由名称",
				dataIndex: "name",
				key: "name",
				width: 120,
			},
			{
				title: "图标",
				dataIndex: "icon",
				key: "icon",
				width: 80,
				align: "center",
				render: (_: string, record: IApi.MenuItem) => renderIcon(record.icon),
			},
			{
				title: "组件路径",
				dataIndex: "componentPath",
				key: "componentPath",
				width: 180,
				render: (v: string) =>
					v ? (
						<Tag color="orange">{v}</Tag>
					) : (
						<span className="text-gray-400">-</span>
					),
			},
			{
				title: "权限标识",
				dataIndex: "permission",
				key: "permission",
				width: 140,
				render: (v: string) =>
					v ? (
						<Tag color="green">{v}</Tag>
					) : (
						<span className="text-gray-400">-</span>
					),
			},
			{
				title: "类型",
				dataIndex: "type",
				key: "type",
				width: 70,
				align: "center",
				render: (v: number) => <Tag color={TYPE_COLORS[v]}>{TYPE_MAP[v]}</Tag>,
			},
			{
				title: "状态",
				dataIndex: "status",
				key: "status",
				width: 70,
				align: "center",
				hideable: false,
				render: (_: unknown, record: IApi.MenuItem) => (
					<Switch
						size="small"
						checked={record.status === 1}
						onChange={(checked) => handleStatusChange(record, checked)}
					/>
				),
			},
			{
				title: "描述",
				dataIndex: "desc",
				key: "desc",
				width: 200,
				ellipsis: true,
				render: (v: string) => (
					<Tooltip title={v}>
						<span>{v || "-"}</span>
					</Tooltip>
				),
			},
			{
				title: "操作",
				key: "actions",
				width: 150,
				fixed: "right",
				hideable: false,
				fixable: false,
				render: (_: unknown, record: IApi.MenuItem) => (
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

	const formFields: FormFieldItem[] = useMemo(
		() => [
			{
				type: "input",
				name: "name",
				label: "路由名称",
				formItemProps: {
					rules: [{ required: true, message: "请输入路由名称" }],
				},
				fieldProps: { placeholder: "如: menu", allowClear: true },
			},
			{
				type: "input",
				name: "title",
				label: "菜单标题",
				formItemProps: {
					rules: [{ required: true, message: "请输入菜单标题" }],
				},
				fieldProps: { placeholder: "如: 菜单管理", allowClear: true },
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
				type: "select",
				name: "type",
				label: "类型",
				formItemProps: { rules: [{ required: true, message: "请选择类型" }] },
				fieldProps: {
					placeholder: "请选择",
					options: [
						{ label: "目录", value: 1 },
						{ label: "菜单", value: 2 },
					],
				},
			},
			{
				type: "input",
				name: "path",
				label: "路由路径",
				formItemProps: {
					rules: [{ required: true, message: "请输入路由路径" }],
				},
				fieldProps: { placeholder: "如: /system/menu", allowClear: true },
			},
			{
				type: "select",
				name: "icon",
				label: "图标",
				fieldProps: {
					placeholder: "选择图标",
					showSearch: true,
					allowClear: true,
					options: ICON_OPTIONS,
				},
			},
			{
				type: "input",
				name: "componentPath",
				label: "组件路径",
				fieldProps: { placeholder: "如: /System/Menu", allowClear: true },
			},
			{
				type: "input",
				name: "permission",
				label: "权限标识",
				fieldProps: { placeholder: "权限标识符", allowClear: true },
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
				fieldProps: { placeholder: "菜单描述", rows: 2, allowClear: true },
			},
		],
		[],
	);

	const tableProps: ProTableProps<IApi.MenuItem> = useMemo(() => {
		return {
			index: true,
			indexWidth: 100,
			ref: TableRef,
			title: "菜单管理",
			dragSort: true,
			rowKey: "id" as const,
			columns,
			api: async () => {
				const allMenus = await Api.getMenuList();
				return { data: cleanEmptyChildren(allMenus), total: allMenus.length };
			},
			toolbarExtra: (
				<Button type="primary" icon={<IconPlus size={16} />} onClick={openAdd}>
					新增菜单
				</Button>
			),
		};
	}, [columns, openAdd]);

	return (
		<div className="flex flex-col gap-4">
			<ProTable<IApi.MenuItem> {...tableProps} />

			<ProForm
				ref={modalRef}
				type="drawer"
				fields={formFields}
				width={700}
				labelCol={{ style: { width: 90 } }}
				onConfirm={handleConfirm}
			/>
		</div>
	);
};

export default Menu;
