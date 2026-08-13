import React, { useState, useMemo, useCallback, useRef } from "react";
import {
	Tag,
	Avatar,
	Progress,
	Badge,
	Rate,
	Tooltip,
	Table,
	Space,
	Button,
	Checkbox,
	Popconfirm,
} from "antd";
import { IconPlus } from "@tabler/icons-react";
import {
	ProTable,
	CopyableCell,
	ProTableColumnType,
	ProTablePagination,
	ProTableSearchConfig,
} from "@/components/ProTable";
import { ProForm } from "@/components/ProForm";
import type {
	ProFormInstance,
	FormFieldItem,
	FormValues,
} from "@/components/ProForm";
import dayjs from "dayjs";

interface DemoRecord {
	id: number;
	name: string;
	email: string;
	age: number;
	status: "active" | "inactive" | "pending";
	department: "tech" | "product" | "design" | "marketing" | "operations";
	joinDate: string;
	amount: number;
	completion: number;
	description: string;
	phone: string;
	address: string;
	rating: number;
}

const DEPT_MAP: Record<string, string> = {
	tech: "技术部",
	product: "产品部",
	design: "设计部",
	marketing: "市场部",
	operations: "运营部",
};

const STATUS_MAP: Record<string, string> = {
	active: "启用",
	inactive: "禁用",
	pending: "待审核",
};

const STATUS_COLORS: Record<string, string> = {
	active: "green",
	inactive: "red",
	pending: "orange",
};

function generateMockData(count: number): DemoRecord[] {
	const surnames = ["张", "李", "王", "赵", "陈", "杨", "黄", "周", "吴", "郑"];
	const givenNames = [
		"伟",
		"芳",
		"娜",
		"敏",
		"静",
		"丽",
		"强",
		"磊",
		"洋",
		"勇",
		"军",
		"杰",
		"娟",
		"艳",
		"涛",
		"明",
		"超",
		"秀兰",
		"鹏",
		"宇",
	];
	const statuses: DemoRecord["status"][] = ["active", "inactive", "pending"];
	const depts: DemoRecord["department"][] = [
		"tech",
		"product",
		"design",
		"marketing",
		"operations",
	];
	const cities = ["北京市", "上海市", "杭州市", "深圳市", "成都市"];
	const districts = ["朝阳区", "浦东新区", "西湖区", "南山区", "武侯区"];

	return Array.from({ length: count }, (_, i) => {
		const idx = i + 1;
		return {
			id: idx,
			name: `${surnames[i % surnames.length]}${givenNames[i % givenNames.length]}`,
			email: `user${idx}@example.com`,
			age: 22 + ((idx * 7) % 35),
			status: statuses[i % statuses.length],
			department: depts[i % depts.length],
			joinDate: dayjs()
				.subtract(idx * 13, "day")
				.format("YYYY-MM-DD"),
			amount: +(Math.random() * 9000 + 1000).toFixed(2),
			completion: (idx * 17 + 5) % 101,
			description: `${surnames[i % surnames.length]}${givenNames[i % givenNames.length]}的详细描述信息，用于演示长文本省略及 Tooltip 悬浮提示功能，可查看更多内容。`,
			phone: `138${String(10000000 + idx).slice(0, 8)}`,
			address: `${cities[i % 5]}${districts[i % 5]}科技园路${idx}号`,
			rating: (idx % 5) + 1,
		};
	});
}

const allMockData = generateMockData(50);

async function mockApi(
	params: ProTablePagination & Record<string, unknown>,
): Promise<{ data: DemoRecord[]; total: number }> {
	await new Promise((r) => setTimeout(r, 300));
	let filtered = [...allMockData];

	if (params.username) {
		const kw = (params.username as string).toLowerCase();
		filtered = filtered.filter((d) => d.name.toLowerCase().includes(kw));
	}
	if (params.status) {
		filtered = filtered.filter((d) => d.status === params.status);
	}
	if (params.department) {
		filtered = filtered.filter((d) => d.department === params.department);
	}

	const start = (params.pageNumber - 1) * params.pageSize;
	return {
		data: filtered.slice(start, start + params.pageSize),
		total: filtered.length,
	};
}

const searchConfig = {
	fields: [
		{
			type: "input" as const,
			name: "username",
			label: "用户名",
			fieldProps: { placeholder: "请输入用户名", allowClear: true },
		},
		{
			type: "select" as const,
			name: "status",
			label: "状态",
			fieldProps: {
				placeholder: "请选择状态",
				allowClear: true,
				options: [
					{ label: "启用", value: "active" },
					{ label: "禁用", value: "inactive" },
					{ label: "待审核", value: "pending" },
				],
			},
		},
		{
			type: "select" as const,
			name: "department",
			label: "部门",
			fieldProps: {
				placeholder: "请选择部门",
				allowClear: true,
				options: Object.entries(DEPT_MAP).map(([v, l]) => ({
					label: l,
					value: v,
				})),
			},
		},
	],
	defaultShowCount: 3,
} satisfies ProTableSearchConfig;

// 表单字段配置（2列布局）
const formFields: FormFieldItem[] = [
	{
		type: "input",
		name: "name",
		label: "用户名",
		formItemProps: { rules: [{ required: true, message: "请输入用户名" }] },
		fieldProps: { placeholder: "请输入用户名", allowClear: true },
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
		type: "input-number",
		name: "age",
		label: "年龄",
		fieldProps: {
			placeholder: "请输入年龄",
			min: 1,
			max: 120,
			style: { width: "100%" },
		},
	},
	{
		type: "select",
		name: "status",
		label: "状态",
		formItemProps: { rules: [{ required: true, message: "请选择状态" }] },
		fieldProps: {
			placeholder: "请选择状态",
			options: [
				{ label: "启用", value: "active" },
				{ label: "禁用", value: "inactive" },
				{ label: "待审核", value: "pending" },
			],
		},
	},
	{
		type: "select",
		name: "department",
		label: "部门",
		formItemProps: { rules: [{ required: true, message: "请选择部门" }] },
		fieldProps: {
			placeholder: "请选择部门",
			options: Object.entries(DEPT_MAP).map(([v, l]) => ({
				label: l,
				value: v,
			})),
		},
	},
	{
		type: "input-number",
		name: "amount",
		label: "金额",
		fieldProps: {
			min: 0,
			precision: 2,
			prefix: "¥",
			placeholder: "请输入金额",
			style: { width: "100%" },
		},
	},
	{
		type: "input-number",
		name: "completion",
		label: "完成率(%)",
		fieldProps: {
			min: 0,
			max: 100,
			placeholder: "请输入完成率",
			style: { width: "100%" },
		},
	},
	{
		type: "input-number",
		name: "rating",
		label: "评分",
		fieldProps: {
			min: 1,
			max: 5,
			placeholder: "1-5分",
			style: { width: "100%" },
		},
	},
	{
		type: "date-picker",
		name: "joinDate",
		label: "入职日期",
		fieldProps: { placeholder: "请选择日期", style: { width: "100%" } },
	},
	{
		type: "input",
		name: "phone",
		label: "电话",
		fieldProps: { placeholder: "请输入电话", allowClear: true },
	},
	{
		type: "input",
		name: "address",
		label: "地址",
		formItemProps: {
			className: "col-span-2",
		},
		fieldProps: {
			placeholder: "请输入地址",
			allowClear: true,
		},
	},
];

// 嵌套表格列
const nestedColumns = [
	{ title: "电话", dataIndex: "phone", key: "phone" },
	{ title: "地址", dataIndex: "address", key: "address" },
	{
		title: "描述",
		dataIndex: "description",
		key: "description",
		ellipsis: true,
		render: (v: string) => (
			<Tooltip title={v}>
				<span>{v}</span>
			</Tooltip>
		),
	},
	{
		title: "状态",
		dataIndex: "status",
		key: "status",
		render: (v: string) => (
			<Badge
				status={
					v === "active" ? "success" : v === "inactive" ? "error" : "processing"
				}
				text={STATUS_MAP[v]}
			/>
		),
	},
];

const expandedRowRender = (record: DemoRecord) => (
	<Table
		rowKey="id"
		columns={nestedColumns}
		dataSource={[record]}
		pagination={false}
		size="small"
		className="ml-16 mr-8 my-2"
	/>
);

const bigMockData = generateMockData(200);

// 删除模块级变量 useBasicTableActions

const BasicTable: React.FC = () => {
	const [virtualMode, setVirtualMode] = useState(false);
	const modalRef = useRef<ProFormInstance>(null);

	const openAddModal = useCallback(() => {
		modalRef.current?.open({ title: "新增用户" });
	}, []);

	const openEditModal = useCallback((record: DemoRecord) => {
		modalRef.current?.open({
			title: "编辑用户",
			initialValues: {
				...record,
				joinDate: record.joinDate ? dayjs(record.joinDate) : undefined,
			},
			extraParams: { id: record.id },
		});
	}, []);

	// ✅ 使用 useMemo 包裹 columns，并直接引用 openEditModal
	const columns = useMemo<ProTableColumnType<DemoRecord>[]>(
		() => [
			{
				title: "用户",
				dataIndex: "name",
				key: "name",
				width: 180,
				render: (v: string) => (
					<CopyableCell text={String(v)}>
						<Space>
							<Avatar style={{ backgroundColor: "#1677ff" }} size="small">
								{v[0]}
							</Avatar>
							<span>{v}</span>
						</Space>
					</CopyableCell>
				),
			},
			{
				title: "邮箱",
				dataIndex: "email",
				key: "email",
				width: 220,
				ellipsis: true,
				render: (v: string) => <CopyableCell text={v} />,
			},
			{
				title: "年龄",
				dataIndex: "age",
				key: "age",
				width: 80,
				sorter: (a, b) => a.age - b.age,
			},
			{
				title: "状态",
				dataIndex: "status",
				key: "status",
				width: 100,
				filters: [
					{ text: "启用", value: "active" },
					{ text: "禁用", value: "inactive" },
					{ text: "待审核", value: "pending" },
				],
				onFilter: (value, record) => record.status === value,
				render: (v: string) => (
					<Tag color={STATUS_COLORS[v]}>{STATUS_MAP[v]}</Tag>
				),
			},
			{
				title: "部门",
				dataIndex: "department",
				key: "department",
				width: 100,
				filters: Object.entries(DEPT_MAP).map(([v, l]) => ({
					text: l,
					value: v,
				})),
				onFilter: (value, record) => record.department === value,
				render: (v: string) => DEPT_MAP[v],
			},
			{
				title: "金额",
				dataIndex: "amount",
				key: "amount",
				width: 130,
				sorter: (a, b) => a.amount - b.amount,
				render: (v: number) => (
					<span className="font-mono text-blue-600">
						¥
						{v.toLocaleString("zh-CN", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
				),
			},
			{
				title: "完成率",
				dataIndex: "completion",
				key: "completion",
				width: 160,
				render: (v: number) => (
					<Progress
						percent={v}
						size="small"
						status={v >= 80 ? "success" : v >= 50 ? "active" : "exception"}
					/>
				),
			},
			{
				title: "评分",
				dataIndex: "rating",
				key: "rating",
				width: 180,
				render: (v: number) => <Rate disabled value={v} />,
			},
			{
				title: "入职日期",
				dataIndex: "joinDate",
				key: "joinDate",
				width: 120,
			},
			{
				title: "操作",
				key: "actions",
				width: 160,
				fixed: "right",
				hideable: false,
				fixable: false,
				render: (_: unknown, record: DemoRecord) => (
					<Space>
						<Button
							type="link"
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								openEditModal(record); // ✅ 直接调用稳定化的函数
							}}
						>
							编辑
						</Button>
						<Popconfirm
							title="确定删除？"
							onConfirm={(e) => {
								e?.stopPropagation();
								window.$message?.success?.(`已删除: ${record.name}`);
							}}
						>
							<Button
								type="link"
								size="small"
								danger
								onClick={(e) => e.stopPropagation()}
							>
								删除
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[openEditModal],
	); // 依赖 openEditModal，它已被 useCallback 稳定

	const handleConfirm = useCallback(
		async (title: string, values: FormValues) => {
			await new Promise((r) => setTimeout(r, 500));
			const joinDateStr = values.joinDate
				? dayjs(values.joinDate as string).format("YYYY-MM-DD")
				: "";
			if (title.includes("编辑")) {
				window.$message?.success?.(
					`已编辑: ${values.name}（入职: ${joinDateStr}）`,
				);
			} else {
				window.$message?.success?.(
					`已新增: ${values.name}（入职: ${joinDateStr}）`,
				);
			}
		},
		[],
	);

	const tableProps = useMemo(
		() =>
			virtualMode
				? {
						dataSource: bigMockData,
						total: bigMockData.length,
						search: searchConfig,
						expandable: { expandedRowRender },
						virtual: true,
					}
				: {
						api: mockApi,
						search: searchConfig,
						expandable: { expandedRowRender },
						virtual: false,
						scroll: { x: "max-content", y: "calc(100vh - 480px)" },
					},
		[virtualMode],
	);

	const toolbarExtra = useMemo(
		() => (
			<Space>
				<Button
					type="primary"
					icon={<IconPlus size={16} />}
					onClick={openAddModal}
				>
					新增
				</Button>
				<Checkbox
					checked={virtualMode}
					onChange={(e) => setVirtualMode(e.target.checked)}
				>
					开启虚拟列表 (200条)
				</Checkbox>
			</Space>
		),
		[virtualMode, openAddModal],
	);

	return (
		<div className="flex flex-col gap-4">
			<ProTable<DemoRecord>
				title="用户数据管理"
				index
				dragSort
				exportable
				exportFileName="用户数据"
				columns={columns}
				rowKey="id"
				{...tableProps}
				toolbarExtra={toolbarExtra}
			/>

			<ProForm
				ref={modalRef}
				type="modal"
				fields={formFields}
				width={900}
				className="grid grid-cols-2 gap-x-4"
				onConfirm={handleConfirm}
			/>
		</div>
	);
};

export default BasicTable;
