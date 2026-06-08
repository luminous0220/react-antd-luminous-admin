import React, { useCallback, useRef } from "react";
import { Button, Card } from "antd";
import {
	TreeSelector,
	type TreeSelectorNode,
	type TreeNodeData,
} from "@/components/ModalSelector/TreeSelector";
import {
	TableSelector,
	type TableSelectorNode,
} from "@/components/ModalSelector/TableSelector";
import { TableModalView, TableModalViewRef } from "@/components/TableModalView";
import type {
	ProTableColumnType,
	ProTablePagination,
} from "@/components/ProTable";
import type { ProTableSearchConfig } from "@/components/ProTable";
import {
	ListSelector,
	type ListSelectorNode,
	type ListItemData,
	type ListSelectorApi,
} from "@/components/ModalSelector";

// ==================== TreeSelector 演示数据 ====================

const AREA_TREE_DATA: TreeNodeData[] = [
	{
		value: 1,
		title: "东部协同区",
		desc: "区域经理：顾南星",
		children: [
			{ value: 11, title: "宁波湾组", desc: "负责人：谢闻舟" },
			{ value: 12, title: "嘉禾组", desc: "负责人：乔若溪" },
			{ value: 13, title: "太湖组", desc: "负责人：秦砚" },
			{ value: 14, title: "温州组" },
			{ value: 15, title: "台州组" },
			{ value: 16, title: "福州组" },
			{ value: 17, title: "莆田组" },
		],
	},
	{
		value: 2,
		title: "中原运营区",
		desc: "区域经理：程知予",
		children: [
			{ value: 21, title: "洛阳组" },
			{ value: 22, title: "郑州组" },
			{ value: 23, title: "合肥组" },
		],
	},
	{
		value: 3,
		title: "枢纽支援区",
		children: [
			{ value: 31, title: "郑州组" },
			{ value: 32, title: "合肥组" },
			{ value: 33, title: "南阳组" },
			{ value: 34, title: "蚌埠组" },
		],
	},
];

// ==================== TableSelector 演示数据 ====================

interface EmployeeRow {
	id: number;
	name: string;
	department: string;
	role: string;
	email: string;
}

const EMPLOYEE_DATA: EmployeeRow[] = [
	{
		id: 1,
		name: "顾南星",
		department: "技术部",
		role: "前端架构师",
		email: "gunanxing@example.com",
	},
	{
		id: 2,
		name: "谢闻舟",
		department: "技术部",
		role: "后端工程师",
		email: "xiewenzhou@example.com",
	},
	{
		id: 3,
		name: "乔若溪",
		department: "产品部",
		role: "产品经理",
		email: "qiaoruoxi@example.com",
	},
	{
		id: 4,
		name: "秦砚",
		department: "设计部",
		role: "UI 设计师",
		email: "qinyan@example.com",
	},
	{
		id: 5,
		name: "程知予",
		department: "市场部",
		role: "市场总监",
		email: "chengzhiyu@example.com",
	},
	{
		id: 6,
		name: "林黛玉",
		department: "运营部",
		role: "运营专员",
		email: "lindaiyu@example.com",
	},
	{
		id: 7,
		name: "贾宝玉",
		department: "技术部",
		role: "全栈工程师",
		email: "jiabaoyu@example.com",
	},
	{
		id: 8,
		name: "薛宝钗",
		department: "产品部",
		role: "产品运营",
		email: "xuebaochai@example.com",
	},
	{
		id: 9,
		name: "王熙凤",
		department: "市场部",
		role: "品牌经理",
		email: "wangxifeng@example.com",
	},
	{
		id: 10,
		name: "史湘云",
		department: "设计部",
		role: "交互设计师",
		email: "shixiangyun@example.com",
	},
	{
		id: 11,
		name: "贾探春",
		department: "运营部",
		role: "数据分析师",
		email: "jiatanchun@example.com",
	},
	{
		id: 12,
		name: "妙玉",
		department: "技术部",
		role: "测试工程师",
		email: "miaoyu@example.com",
	},
];

const EMPLOYEE_COLUMNS: ProTableColumnType<EmployeeRow>[] = [
	{ title: "姓名", dataIndex: "name", key: "name", width: 120 },
	{ title: "部门", dataIndex: "department", key: "department", width: 100 },
	{ title: "角色", dataIndex: "role", key: "role", width: 140 },
	{ title: "邮箱", dataIndex: "email", key: "email", width: 140 },
];

const fetchEmployees = async (
	params: ProTablePagination & Record<string, unknown>,
) => {
	await new Promise((resolve) => setTimeout(resolve, 600));
	let list = [...EMPLOYEE_DATA];
	if (params.name) {
		const kw = String(params.name).toLowerCase();
		list = list.filter((e) => e.name.toLowerCase().includes(kw));
	}
	if (params.department) {
		list = list.filter((e) => e.department === params.department);
	}
	const listMap = list.map((e) => ({
		...e,
		desc: `部门：${e.department} 角色：${e.role}`,
	}));
	const { pageNumber, pageSize } = params;
	const start = (pageNumber - 1) * pageSize;
	return {
		data: listMap.slice(start, start + pageSize),
		total: listMap.length,
	};
};

const EMPLOYEE_SEARCH_CONFIG: ProTableSearchConfig = {
	fields: [
		{
			type: "input",
			name: "name",
			label: "姓名",
			fieldProps: { placeholder: "请输入姓名" },
		},
		{
			type: "select",
			name: "department",
			label: "部门",
			fieldProps: {
				placeholder: "请选择部门",
				allowClear: true,
				options: [
					{ label: "技术部", value: "技术部" },
					{ label: "产品部", value: "产品部" },
					{ label: "设计部", value: "设计部" },
					{ label: "市场部", value: "市场部" },
					{ label: "运营部", value: "运营部" },
				],
			},
		},
	],
	defaultShowCount: 2,
};

// ==================== ListSelector 演示数据 ====================

const ALL_DEPARTMENTS: ListItemData[] = [
	{ value: 1, title: "技术部", desc: "负责产品研发与技术架构" },
	{ value: 2, title: "产品部", desc: "负责需求分析与产品设计" },
	{ value: 3, title: "设计部", desc: "负责 UI/UX 设计" },
	{ value: 4, title: "市场部", desc: "负责品牌推广与市场营销" },
	{ value: 5, title: "运营部", desc: "负责日常运营与数据分析" },
	{ value: 6, title: "财务部", desc: "负责财务管理与成本控制" },
	{ value: 7, title: "人事部", desc: "负责招聘与员工管理" },
	{ value: 8, title: "法务部", desc: "负责法律合规事务" },
	{ value: 9, title: "行政部", desc: "负责后勤保障与行政管理" },
	{ value: 10, title: "客服部", desc: "负责客户服务与售后支持" },
];

const fetchDepartments: ListSelectorApi = async (params) => {
	await new Promise((r) => setTimeout(r, 400));
	let list = [...ALL_DEPARTMENTS];
	if (params.keyword) {
		const kw = params.keyword.toLowerCase();
		list = list.filter(
			(item) =>
				item.title.toLowerCase().includes(kw) ||
				(item.desc && item.desc.toLowerCase().includes(kw)),
		);
	}
	const start = (params.pageNumber - 1) * params.pageSize;
	return {
		data: list.slice(start, start + params.pageSize),
		total: list.length,
	};
};
const SelectorDemo: React.FC = () => {
	const tableViewRef = useRef<TableModalViewRef<EmployeeRow>>(null);
	const handleAreaChange = useCallback((selected: TreeSelectorNode[]) => {
		window.$message?.success?.(
			`已选择: ${selected.map((s) => s.title).join("、")}`,
		);
	}, []);

	// TableSelector 多选
	const handleEmployeeChange = useCallback((selected: TableSelectorNode[]) => {
		window.$message?.success?.(
			`已选择: ${selected.map((s) => s.title).join("、")}`,
		);
	}, []);

	// TableSelector 自定义触发器状态
	const handleEmployeeCustomChange = useCallback(
		(selected: TableSelectorNode[]) => {
			window.$message?.success?.(
				`已选择: ${selected.map((s) => s.title).join("、")}`,
			);
		},
		[],
	);
	const handleEmployeeRadioChange = useCallback(
		(selected: TableSelectorNode[]) => {
			window.$message?.success?.(
				`已选择: ${selected.map((s) => s.title).join("、")}`,
			);
		},
		[],
	);

	const handleDeptChange = useCallback((selected: ListSelectorNode[]) => {
		window.$message?.success?.(
			`已选择: ${selected.map((s) => s.title).join("、")}`,
		);
	}, []);

	return (
		<div className="grid grid-cols-2 gap-4">
			{/* ====== 选择器案例 ====== */}
			<Card title="案例一：树形选择器">
				<p className="text-gray-500 text-sm mb-4">
					演示树形多选选择器，支持父子联动、搜索过滤。选中后回调打印已选数据。
				</p>
				<TreeSelector
					title="选择经营区域"
					treeData={AREA_TREE_DATA}
					onChange={handleAreaChange}
					placeholder="请选择经营区域"
				/>
			</Card>

			<Card title="案例二：表格选择器（多选）">
				<p className="text-gray-500 text-sm mb-4">
					基于 ProTable + Mock API，带搜索表单（姓名/部门筛选），多选模式。
				</p>
				<TableSelector<EmployeeRow>
					title="选择员工"
					api={fetchEmployees}
					columns={EMPLOYEE_COLUMNS}
					onChange={handleEmployeeChange}
					placeholder="请选择员工"
					search={EMPLOYEE_SEARCH_CONFIG}
				/>
			</Card>

			<Card title="案例三：表格选择器（单选）">
				<p className="text-gray-500 text-sm mb-4">
					selectionType="radio"，表格占满宽度，不显示右侧已选面板。
				</p>
				<TableSelector<EmployeeRow>
					title="选择负责人"
					api={fetchEmployees}
					columns={EMPLOYEE_COLUMNS}
					onChange={handleEmployeeRadioChange}
					placeholder="请选择负责人"
					search={EMPLOYEE_SEARCH_CONFIG}
					selectionType="radio"
				/>
			</Card>

			<Card title="案例四: 表格弹窗查看">
				<p className="text-gray-500 text-sm mb-4">
					通过 ref.open() 编程式打开弹窗，传入表格参数渲染 ProTable。ref.close()
					关闭弹窗。
				</p>
				<Button
					type="primary"
					onClick={() =>
						tableViewRef.current?.open({
							title: "员工列表",
							api: fetchEmployees,
							columns: EMPLOYEE_COLUMNS,
							search: EMPLOYEE_SEARCH_CONFIG,
						})
					}
				>
					打开员工列表
				</Button>
				<TableModalView<EmployeeRow> ref={tableViewRef} title="员工列表" />
			</Card>

			<Card title="案例五：表格选择器（自定义触发器）">
				<p className="text-gray-500 text-sm mb-4">
					通过 renderTrigger 自定义触发器为
					Button，显示已选数量。点击按钮打开弹窗进行选择。
				</p>
				<TableSelector<EmployeeRow>
					title="选择员工"
					api={fetchEmployees}
					columns={EMPLOYEE_COLUMNS}
					onChange={handleEmployeeCustomChange}
					placeholder="请选择员工"
					search={EMPLOYEE_SEARCH_CONFIG}
					renderTrigger={(props) => (
						<Button
							type={props.selectedItems.length > 0 ? "primary" : "default"}
							onClick={props.onClick}
							disabled={props.disabled}
						>
							{props.selectedItems.length > 0
								? `已选 ${props.selectedItems.length} 人`
								: "点击选择员工"}
						</Button>
					)}
				/>
			</Card>

			<Card title="案例六: 列表选择器">
				<p className="text-gray-500 text-sm mb-4">
					演示列表式多选选择器，基于 Checkbox 列表实现。与 TreeSelector
					结构一致，但数据源为扁平列表（无层级）。
				</p>
				<ListSelector
					title="选择部门"
					api={fetchDepartments}
					onChange={handleDeptChange}
					placeholder="请选择部门"
				/>
			</Card>
		</div>
	);
};

export default SelectorDemo;
