import React, { useState, useCallback, useMemo, useRef } from "react";
import { Tag, Button, Space, Popconfirm, Switch } from "antd";
import { IconPlus, IconSettings } from "@tabler/icons-react";
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
import {
	TreeSelectorModal,
	type TreeSelectorModalRef,
	type TreeNodeData,
} from "@/components/ModalSelector";
import { Api } from "@/apis";
import type { IApi } from "@/apis";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const searchConfig: ProTableSearchConfig = {
	fields: [
		{
			type: "input",
			name: "name",
			label: "角色名称",
			fieldProps: { placeholder: "请输入角色名称", allowClear: true },
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

/**
 * @description 将菜单树数据转换为 TreeSelectorModal 所需的 TreeNodeData 格式
 */
function transformMenuToTreeData(menus: IApi.MenuItem[]): TreeNodeData[] {
	return menus.map((menu) => ({
		value: menu.id,
		title: menu.title,
		children: menu.children?.length
			? transformMenuToTreeData(menu.children)
			: undefined,
	}));
}

const Role: React.FC = () => {
	const modalRef = useRef<ProFormInstance>(null);
	const treeModalRef = useRef<TreeSelectorModalRef>(null);
	const [refreshKey, setRefreshKey] = useState(0);

	// 当前操作的 roleId（权限保存时使用）
	const currentRoleIdRef = useRef<string>("");

	// 新增
	const openAdd = useCallback(() => {
		modalRef.current?.open({
			title: "新增角色",
			initialValues: { status: true, sort: 10 },
		});
	}, []);

	// 编辑
	const openEdit = useCallback((record: IApi.RoleItem) => {
		modalRef.current?.open({
			title: "编辑角色",
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
			if (title === "新增角色") {
				await Api.saveRole({ ...payload, id: extraParams?.id } as IApi.RoleReq);
				window.$message?.success?.("编辑成功");
			} else {
				await Api.saveRole(payload as IApi.RoleReq);
				window.$message?.success?.("新增成功");
			}
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	// 权限确认回调
	const handlePermissionConfirm = useCallback(
		async (selected: { value: string | number }[]) => {
			const menuIds = selected.map((item) => String(item.value));
			try {
				await Api.saveRolePermissions({
					roleId: currentRoleIdRef.current,
					menuIds,
				});
				window.$message?.success?.("权限设置成功");
				setRefreshKey((k) => k + 1);
			} catch {
				window.$message?.error?.("权限设置失败");
			}
		},
		[],
	);

	// 打开权限弹窗（记住 roleId 后调用 TreeSelectorModal）
	const handleOpenPermission = useCallback(async (record: IApi.RoleItem) => {
		currentRoleIdRef.current = record.id;
		try {
			const [menuTree, permissions] = await Promise.all([
				Api.getMenuList(),
				Api.getRolePermissions(record.id),
			]);
			const treeData = transformMenuToTreeData(menuTree);
			const checkedKeys = permissions.menuIds.map((id) => ({
				value: id,
				title: "",
				type: "child" as const,
			}));
			treeModalRef.current?.open({
				title: `设置权限 - ${record.name}`,
				treeData,
				checkedKeys,
			});
		} catch {
			window.$message?.error?.("获取菜单数据失败");
		}
	}, []);

	const handleDelete = useCallback(async (id: string) => {
		await Api.deleteRole(id);
		window.$message?.success?.("删除成功");
		setRefreshKey((k) => k + 1);
	}, []);

	const handleStatusChange = useCallback(
		async (record: IApi.RoleItem, checked: boolean) => {
			await Api.saveRole({
				...record,
				status: checked ? 1 : 0,
			} as IApi.RoleReq);
			window.$message?.success?.(
				`已${checked ? "启用" : "禁用"}: ${record.name}`,
			);
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	const columns: ProTableColumnType<IApi.RoleItem>[] = useMemo(
		() => [
			{
				title: "角色名称",
				dataIndex: "name",
				key: "name",
				width: 130,
				render: (v: string) => <Tag color="blue">{v}</Tag>,
			},
			{
				title: "角色编码",
				dataIndex: "code",
				key: "code",
				width: 120,
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
				render: (_: unknown, record: IApi.RoleItem) => (
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
				width: 260,
				fixed: "right",
				hideable: false,
				fixable: false,
				render: (_: unknown, record: IApi.RoleItem) => (
					<Space>
						<Button
							size="small"
							color="purple"
							variant="filled"
							icon={<IconSettings size={14} />}
							onClick={() => handleOpenPermission(record)}
						>
							设置权限
						</Button>
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
		[handleStatusChange, handleDelete, openEdit, handleOpenPermission],
	);

	const formFields: FormFieldItem[] = useMemo(
		() => [
			{
				type: "input",
				name: "name",
				label: "角色名称",
				formItemProps: {
					rules: [{ required: true, message: "请输入角色名称" }],
				},
				fieldProps: { placeholder: "如: 管理员", allowClear: true },
			},
			{
				type: "input",
				name: "code",
				label: "角色编码",
				formItemProps: {
					rules: [{ required: true, message: "请输入角色编码" }],
				},
				fieldProps: { placeholder: "如: admin", allowClear: true },
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
				fieldProps: { placeholder: "角色描述", rows: 2, allowClear: true },
			},
		],
		[],
	);

	const tableProps: ProTableProps<IApi.RoleItem> = useMemo(() => {
		return {
			key: refreshKey,
			title: "角色管理",
			rowKey: "id" as const,
			columns,
			search: searchConfig,
			api: async (params) => {
				const res = await Api.getRoleList(params);
				return { data: res.data, total: res.total };
			},
			toolbarExtra: (
				<Button type="primary" icon={<IconPlus size={16} />} onClick={openAdd}>
					新增角色
				</Button>
			),
		};
	}, [refreshKey, columns, openAdd]);

	return (
		<div className="flex flex-col gap-4">
			<ProTable<IApi.RoleItem> {...tableProps} />

			<ProForm
				ref={modalRef}
				type="modal"
				fields={formFields}
				onConfirm={handleConfirm}
			/>

			<TreeSelectorModal
				ref={treeModalRef}
				onConfirm={handlePermissionConfirm}
			/>
		</div>
	);
};

export default Role;
