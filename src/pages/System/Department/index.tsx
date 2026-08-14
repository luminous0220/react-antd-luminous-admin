import React, {
	useState,
	useCallback,
	useMemo,
	useRef,
	useEffect,
} from "react";
import { Tag, Button, Space, Popconfirm, Switch, Table, Card } from "antd";
import type { TableProps } from "antd";
import { IconPlus } from "@tabler/icons-react";
import { ProForm } from "@/components/ProForm";
import type {
	ProFormInstance,
	FormFieldItem,
	FormValues,
} from "@/components/ProForm";
import { Api } from "@/apis";
import type { IApi } from "@/apis";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

/**
 * @description 将扁平部门列表转为树形结构
 */
function buildDeptTree(list: IApi.DepartmentItem[]): IApi.DepartmentItem[] {
	const map = new Map<string, IApi.DepartmentItem>();
	const roots: IApi.DepartmentItem[] = [];

	for (const item of list) {
		map.set(item.id, { ...item, children: [] });
	}

	for (const item of map.values()) {
		if (item.parentId && map.has(item.parentId)) {
			map.get(item.parentId)!.children!.push(item);
		} else {
			roots.push(item);
		}
	}

	return roots;
}

const Department: React.FC = () => {
	const modalRef = useRef<ProFormInstance>(null);
	const [treeData, setTreeData] = useState<IApi.DepartmentItem[]>([]);
	const [loading, setLoading] = useState(false);

	// 加载部门树
	const loadTree = useCallback(async () => {
		setLoading(true);
		try {
			const list = await Api.getDepartmentList();
			setTreeData(buildDeptTree(list));
		} catch {
			window.$message?.error?.("加载部门数据失败");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadTree();
	}, [loadTree]);

	// 新增子部门（默认 parentId 为当前行）
	const openAdd = useCallback((parent?: IApi.DepartmentItem) => {
		modalRef.current?.open({
			title: parent ? `新增子部门 - ${parent.name}` : "新增根部门",
			initialValues: { status: true, sort: 10, parentId: parent?.id ?? null },
		});
	}, []);

	// 编辑
	const openEdit = useCallback((record: IApi.DepartmentItem) => {
		modalRef.current?.open({
			title: "编辑部门",
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
			if (title?.includes("新增")) {
				await Api.saveDepartment(payload as IApi.DepartmentReq);
				window.$message?.success?.("新增成功");
			} else {
				await Api.saveDepartment({
					...payload,
					id: extraParams?.id,
				} as IApi.DepartmentReq);
				window.$message?.success?.("编辑成功");
			}
			loadTree();
		},
		[loadTree],
	);

	const handleDelete = useCallback(
		async (id: string) => {
			await Api.deleteDepartment(id);
			window.$message?.success?.("删除成功");
			loadTree();
		},
		[loadTree],
	);

	const handleStatusChange = useCallback(
		async (record: IApi.DepartmentItem, checked: boolean) => {
			await Api.saveDepartment({
				...record,
				status: checked ? 1 : 0,
			} as IApi.DepartmentReq);
			window.$message?.success?.(
				`已${checked ? "启用" : "禁用"}: ${record.name}`,
			);
			loadTree();
		},
		[loadTree],
	);

	const columns: TableProps<IApi.DepartmentItem>["columns"] = useMemo(
		() => [
			{
				title: "部门名称",
				dataIndex: "name",
				key: "name",
				width: 200,
				render: (v: string) => <Tag color="blue">{v}</Tag>,
			},
			{
				title: "部门编码",
				dataIndex: "code",
				key: "code",
				width: 150,
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
				render: (_: unknown, record: IApi.DepartmentItem) => (
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
				width: 200,
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
				width: 200,
				fixed: "right",
				render: (_: unknown, record: IApi.DepartmentItem) => (
					<Space>
						<Button
							type="link"
							size="small"
							icon={<IconPlus size={14} />}
							onClick={() => openAdd(record)}
						>
							新增
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
		[handleStatusChange, handleDelete, openEdit, openAdd],
	);

	const formFields: FormFieldItem[] = useMemo(
		() => [
			{
				type: "input",
				name: "name",
				label: "部门名称",
				formItemProps: {
					rules: [{ required: true, message: "请输入部门名称" }],
				},
				fieldProps: { placeholder: "如: 技术部", allowClear: true },
			},
			{
				type: "input",
				name: "code",
				label: "部门编码",
				formItemProps: {
					rules: [{ required: true, message: "请输入部门编码" }],
				},
				fieldProps: { placeholder: "如: tech", allowClear: true },
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
				fieldProps: { placeholder: "部门描述", rows: 2, allowClear: true },
			},
		],
		[],
	);

	return (
		<div className="flex flex-col gap-4">
			<Card
				title="部门管理"
				classNames={{ header: "!bg-[var(--ant-color-bg-layout)]" }}
				extra={
					<Button
						type="primary"
						icon={<IconPlus size={16} />}
						onClick={() => openAdd()}
					>
						新增根部门
					</Button>
				}
			>
				<Table<IApi.DepartmentItem>
					loading={loading}
					rowKey="id"
					columns={columns}
					dataSource={treeData}
					defaultExpandAllRows
					pagination={false}
					size="middle"
					locale={{ emptyText: "暂无部门数据" }}
				/>
			</Card>

			<ProForm
				ref={modalRef}
				type="modal"
				fields={formFields}
				onConfirm={handleConfirm}
			/>
		</div>
	);
};

export default Department;
