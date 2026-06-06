import React, { useState, useCallback } from "react";
import { Card, Input, Space, Tag, Rate, TreeSelect } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { ProForm, type ProFormFields } from "@/components/ProForm";
import type { FormValues } from "@/components/ProForm/type";
import {
	TreeSelector,
	type TreeSelectorNode,
	type TreeNodeData,
	TableSelector,
	type TableSelectorNode,
} from "@/components/Selector";
import type {
	ProTableColumnType,
	ProTablePagination,
} from "@/components/ProTable";
import type { ProTableSearchConfig } from "@/components/ProTable/type";

async function handleSubmit(_: string, values: FormValues) {
	await new Promise((resolve) => setTimeout(resolve, 600));
	window.$message.success(JSON.stringify(values, null, 2));
}

const disabledFutureDate = (current: unknown) => {
	const dayjs = current as { isAfter?: (d: unknown) => boolean } | null;
	if (dayjs?.isAfter) {
		return dayjs.isAfter(
			(window as unknown as { dayjs?: () => unknown }).dayjs?.(),
		);
	}
	return false;
};

const case1Fields: ProFormFields = [
	{
		name: "username",
		label: "用户名",
		rules: [{ required: true, message: "请输入用户名" }],
		render: (value, form) => (
			<Input
				placeholder="请输入用户名"
				prefix={<UserOutlined />}
				value={(value as string) ?? ""}
				onChange={(e) => form.setFieldValue("username", e.target.value)}
			/>
		),
	},
	{
		name: "email",
		label: "邮箱",
		rules: [
			{ required: true, message: "请输入邮箱" },
			{ type: "email", message: "请输入正确的邮箱格式" },
		],
		render: (value, form) => (
			<Input
				placeholder="请输入邮箱地址"
				prefix={<MailOutlined />}
				value={(value as string) ?? ""}
				onChange={(e) => form.setFieldValue("email", e.target.value)}
			/>
		),
	},
	{
		type: "select",
		name: "department",
		label: "所属部门",
		rules: [{ required: true, message: "请选择部门" }],
		fieldProps: {
			showSearch: true,
			placeholder: "请选择部门",
			filterOption: (input, option) =>
				String(option?.label ?? "")
					.toLowerCase()
					.includes(input.toLowerCase()),
			options: [
				{ label: "技术部", value: "tech" },
				{ label: "产品部", value: "product" },
				{ label: "设计部", value: "design" },
				{ label: "市场部", value: "marketing" },
				{ label: "运营部", value: "operations" },
			],
		},
	},
	{
		type: "radio",
		name: "role",
		label: "角色权限",
		rules: [{ required: true, message: "请选择角色" }],
		fieldProps: {
			optionType: "button",
			buttonStyle: "solid",
			options: [
				{ label: "管理员", value: "admin" },
				{ label: "编辑者", value: "editor" },
				{ label: "访客", value: "guest" },
			],
		},
	},
	{
		type: "date-picker",
		name: "joinDate",
		label: "入职日期",
		fieldProps: {
			format: "YYYY-MM-DD",
			placeholder: "请选择入职日期",
			disabledDate: disabledFutureDate,
			style: { width: "100%" },
		},
	},
	{
		type: "tree-select",
		name: "org",
		label: "所属机构",
		fieldProps: {
			placeholder: "请选择所属机构",
			treeDefaultExpandAll: true,
			multiple: true,
			treeCheckable: true,
			showCheckedStrategy: TreeSelect.SHOW_ALL,
			treeData: [
				{
					title: "总公司",
					value: "headquarters",
					children: [
						{ title: "研发中心", value: "rd-center" },
						{ title: "销售中心", value: "sales-center" },
						{
							title: "华东分部",
							value: "east-branch",
							children: [
								{ title: "上海办", value: "shanghai" },
								{ title: "杭州办", value: "hangzhou" },
							],
						},
					],
				},
			],
		},
	},
	{
		type: "upload",
		name: "attachment",
		label: "附件上传",
		fieldProps: {
			listType: "picture",
			maxCount: 3,
			accept: ".jpg,.jpeg,.png",
			defaultFileList: [
				{
					uid: "1",
					name: "logo.png",
					status: "done",
					url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
				},
			],
		},
	},
	{
		type: "textarea",
		name: "remark",
		label: "备注",
		fieldProps: {
			placeholder: "请输入备注信息（选填）",
			rows: 3,
			maxLength: 200,
			showCount: true,
		},
	},
];

const case2Fields: ProFormFields = [
	{
		type: "input",
		name: "username",
		label: "用户名",
		rules: [{ required: true, message: "请输入用户名" }],
		fieldProps: { placeholder: "请输入用户名" },
	},
	{
		type: "input",
		name: "email",
		label: "邮箱",
		rules: [
			{ required: true, message: "请输入邮箱" },
			{ type: "email", message: "请输入正确的邮箱格式" },
		],
		fieldProps: { placeholder: "请输入邮箱地址" },
	},
	{
		type: "select",
		name: "department",
		label: "所属部门",
		rules: [{ required: true, message: "请选择部门" }],
		fieldProps: {
			showSearch: true,
			placeholder: "请选择部门",
			filterOption: (input, option) =>
				String(option?.label ?? "")
					.toLowerCase()
					.includes(input.toLowerCase()),
			options: [
				{ label: "技术部", value: "tech" },
				{ label: "产品部", value: "product" },
				{ label: "设计部", value: "design" },
				{ label: "市场部", value: "marketing" },
				{ label: "运营部", value: "operations" },
			],
		},
	},
	{
		type: "radio",
		name: "role",
		label: "角色权限",
		rules: [{ required: true, message: "请选择角色" }],
		fieldProps: {
			optionType: "button",
			buttonStyle: "solid",
			options: [
				{ label: "管理员", value: "admin" },
				{ label: "编辑者", value: "editor" },
			],
		},
	},
	{
		type: "date-picker",
		name: "joinDate",
		label: "入职日期",
		fieldProps: {
			format: "YYYY-MM-DD",
			placeholder: "请选择入职日期",
			disabledDate: disabledFutureDate,
			style: { width: "100%" },
		},
	},
	{
		type: "tree-select",
		name: "org",
		label: "所属机构",
		fieldProps: {
			placeholder: "请选择所属机构",
			treeDefaultExpandAll: true,
			treeData: [
				{
					title: "总公司",
					value: "headquarters",
					children: [
						{ title: "研发中心", value: "rd-center" },
						{ title: "销售中心", value: "sales-center" },
						{
							title: "华东分部",
							value: "east-branch",
							children: [
								{ title: "上海办", value: "shanghai" },
								{ title: "杭州办", value: "hangzhou" },
							],
						},
					],
				},
			],
		},
	},
	{
		type: "textarea",
		name: "remark",
		label: "备注",
		fieldProps: {
			placeholder: "请输入备注信息（选填）",
			rows: 2,
			maxLength: 200,
			showCount: true,
		},
	},
];

const TAG_COLORS: Record<string, string> = {
	react: "cyan",
	vue: "green",
	angular: "gold",
	svelte: "lime",
};

const case3Fields: ProFormFields = [
	{
		type: "select",
		name: "tags",
		label: "技能标签",
		rules: [{ required: true, message: "请选择技能标签" }],
		fieldProps: {
			mode: "multiple",
			placeholder: "请选择技能标签",
			options: [
				{ label: "React", value: "react" },
				{ label: "Vue", value: "vue" },
				{ label: "Angular", value: "angular" },
				{ label: "Svelte", value: "svelte" },
			],
			tagRender: (props) => (
				<Tag
					color={TAG_COLORS[props.value as string] || "default"}
					closable={props.closable}
					onClose={props.onClose}
					style={{ marginRight: 3 }}
				>
					{props.label}
				</Tag>
			),
		},
	},
	{
		name: "rating",
		label: "综合评分",
		render: (value, form) => (
			<Rate
				value={(value as number) ?? 0}
				onChange={(val) => form.setFieldValue("rating", val)}
			/>
		),
	},
	{
		type: "switch",
		name: "status",
		label: "账号状态",
		fieldProps: {
			checkedChildren: "开启",
			unCheckedChildren: "关闭",
		},
	},
	{
		name: "phone",
		label: "联系电话",
		rules: [{ required: true, message: "请输入联系电话" }],
		render: (value, form) => (
			<Space.Compact style={{ width: "100%" }}>
				<Input
					style={{ width: "25%" }}
					placeholder="区号"
					defaultValue="0571"
				/>
				<Input
					style={{ width: "75%" }}
					placeholder="电话号码"
					value={(value as string) ?? ""}
					onChange={(e) => form.setFieldValue("phone", e.target.value)}
				/>
			</Space.Compact>
		),
	},
	{
		name: "website",
		label: "个人网站",
		render: (value, form) => (
			<Space.Compact style={{ width: "100%" }}>
				<Input style={{ width: "25%" }} value="https://" disabled />
				<Input.Search
					style={{ width: "75%" }}
					placeholder="请输入搜索关键词"
					allowClear
					value={(value as string) ?? ""}
					onChange={(e) => form.setFieldValue("website", e.target.value)}
				/>
			</Space.Compact>
		),
	},
	{
		type: "select",
		name: "city",
		label: "所在城市",
		fieldProps: {
			placeholder: "请选择城市",
			options: [
				{ label: "北京", value: "beijing" },
				{ label: "上海", value: "shanghai" },
				{ label: "杭州", value: "hangzhou" },
				{ label: "深圳", value: "shenzhen" },
				{ label: "成都", value: "chengdu" },
			],
		},
	},
	{
		type: "textarea",
		name: "bio",
		label: "个人简介",
		fieldProps: {
			placeholder: "介绍一下自己（选填）",
			rows: 4,
			maxLength: 500,
			showCount: true,
		},
	},
];

const case4Fields: ProFormFields = [
	{
		type: "select",
		name: "needDetail",
		label: "显示详细信息？",
		rules: [{ required: true, message: "请选择" }],
		fieldProps: {
			placeholder: "请选择",
			options: [
				{ label: "是", value: "yes" },
				{ label: "否", value: "no" },
			],
		},
	},
	{
		type: "input",
		name: "address",
		label: "详细地址",
		visible: (values: FormValues) => values.needDetail === "yes",
		rules: [{ required: true, message: "请输入详细地址" }],
		fieldProps: { placeholder: "请输入详细地址" },
	},
	{
		type: "input",
		name: "zipCode",
		label: "邮政编码",
		visible: (values: FormValues) => values.needDetail === "yes",
		fieldProps: { placeholder: "请输入邮政编码" },
	},
	{
		type: "radio",
		name: "delivery",
		label: "收货方式",
		rules: [{ required: true, message: "请选择收货方式" }],
		fieldProps: {
			options: [
				{ label: "快递", value: "express" },
				{ label: "自取", value: "pickup" },
			],
		},
	},
	{
		type: "select",
		name: "expressCompany",
		label: "快递公司",
		visible: (values: FormValues) => values.delivery === "express",
		rules: [{ required: true, message: "请选择快递公司" }],
		fieldProps: {
			placeholder: "请选择快递公司",
			options: [
				{ label: "顺丰速运", value: "sf" },
				{ label: "中通快递", value: "zto" },
				{ label: "圆通速递", value: "yto" },
				{ label: "韵达快递", value: "yunda" },
			],
		},
	},
	{
		type: "time-picker",
		name: "pickupTime",
		label: "自取时间",
		visible: (values: FormValues) => values.delivery === "pickup",
		rules: [{ required: true, message: "请选择自取时间" }],
		fieldProps: {
			format: "HH:mm",
			placeholder: "请选择自取时间",
			style: { width: "100%" },
		},
	},
];

const CASES = [
	{
		title: "案例一：基础表单控件",
		description:
			"演示带图标前缀的输入框、搜索选择器、按钮样式单选组、日期限制、树选择、上传等控件。",
		fields: case1Fields,
		initialValues: {
			department: "tech",
			role: "editor",
		},
	},
	{
		title: "案例二：折叠表单",
		description:
			"与案例一结构相同的表单，启用折叠功能（默认显示 3 个字段，点击展开查看全部）。采用 inline 布局。",
		fields: case2Fields,
		layout: "vertical" as const,
		collapsible: { defaultShowCount: 4 },
		initialValues: {
			department: "product",
		},
	},
	{
		title: "案例三：自定义组件",
		description:
			"演示多选标签自定义颜色渲染、Rate 评分、Switch 开关、Space.Compact 紧凑输入组等非标准控件。",
		fields: case3Fields,
		initialValues: {
			status: true,
			rating: 3,
		},
	},
	{
		title: "案例四：表单联动",
		description:
			"演示表单字段根据其他字段的值动态显示/隐藏。选择「是」显示详细信息字段，选择收货方式后显示对应的后续字段。",
		fields: case4Fields,
		initialValues: {
			needDetail: "no",
			delivery: "express",
		},
	},
];

// TreeSelector 演示数据
const AREA_TREE_DATA: TreeNodeData[] = [
	{
		value: 1,
		title: "东部协同区",
		info: "区域经理：顾南星",
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
		info: "区域经理：程知予",
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

// TableSelector 演示数据
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
	{ title: "邮箱", dataIndex: "email", key: "email" },
];

// 模拟 API 请求（带筛选 + 分页）
const fetchEmployees = async (
	params: ProTablePagination & Record<string, unknown>,
) => {
	// 模拟网络延迟
	await new Promise((resolve) => setTimeout(resolve, 600));

	let list = [...EMPLOYEE_DATA];

	// 按姓名筛选
	if (params.name) {
		const kw = String(params.name).toLowerCase();
		list = list.filter((e) => e.name.toLowerCase().includes(kw));
	}
	// 按部门筛选
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

// ProTable 搜索表单配置
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

const BasicForm: React.FC = () => {
	const [areaSelected, setAreaSelected] = useState<TreeSelectorNode[]>([]);

	const handleAreaChange = useCallback((selected: TreeSelectorNode[]) => {
		setAreaSelected(selected);
		window.$message?.success?.(
			`已选择: ${selected.map((s) => s.title).join("、")}`,
		);
	}, []);

	// TableSelector 状态
	const [employeeSelected, setEmployeeSelected] = useState<TableSelectorNode[]>(
		[],
	);

	const handleEmployeeChange = useCallback((selected: TableSelectorNode[]) => {
		setEmployeeSelected(selected);
		window.$message?.success?.(
			`已选择: ${selected.map((s) => s.title).join("、")}`,
		);
	}, []);

	// TableSelector 单选状态
	const [employeeRadioSelected, setEmployeeRadioSelected] = useState<
		TableSelectorNode[]
	>([]);

	const handleEmployeeRadioChange = useCallback(
		(selected: TableSelectorNode[]) => {
			setEmployeeRadioSelected(selected);
			window.$message?.success?.(
				`已选择: ${selected.map((s) => s.title).join("、")}`,
			);
		},
		[],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{CASES.map((c, i) => (
					<Card
						key={i}
						title={c.title}
						className={i >= 2 ? "lg:col-span-1" : ""}
					>
						<p className="text-gray-500 text-sm mb-4">{c.description}</p>
						<ProForm
							type="pure"
							fields={c.fields}
							initialValues={c.initialValues}
							layout={"layout" in c ? c.layout : undefined}
							collapsible={"collapsible" in c ? c.collapsible : undefined}
							onConfirm={handleSubmit}
							className={
								c.title === "案例二：折叠表单" ? "grid grid-cols-2 gap-4	" : ""
							}
						/>
					</Card>
				))}
			</div>

			{/* TreeSelector 演示 */}
			<Card title="案例五：树形选择器">
				<p className="text-gray-500 text-sm mb-4">
					演示树形多选选择器，支持父子联动、搜索过滤。选中后回调打印已选数据。
				</p>
				<TreeSelector
					title="选择经营区域"
					treeData={AREA_TREE_DATA}
					checkedKeys={areaSelected}
					onChange={handleAreaChange}
					placeholder="请选择经营区域"
				/>
			</Card>

			{/* TableSelector 多选演示 */}
			<Card title="案例六：表格选择器（多选）" className="mb-4">
				<p className="text-gray-500 text-sm mb-4">
					演示表格多选选择器，基于 ProTable + Mock API
					实现，带搜索表单（姓名/部门筛选）。
				</p>
				<TableSelector<EmployeeRow>
					title="选择员工"
					api={fetchEmployees}
					columns={EMPLOYEE_COLUMNS}
					checkedKeys={employeeSelected}
					onChange={handleEmployeeChange}
					placeholder="请选择员工"
					search={EMPLOYEE_SEARCH_CONFIG}
				/>
			</Card>

			{/* TableSelector 单选演示 */}
			<Card title="案例七：表格选择器（单选）" className="mb-36">
				<p className="text-gray-500 text-sm mb-4">
					演示表格单选选择器，selectionType="radio"，其他功能与多选一致。
				</p>
				<TableSelector<EmployeeRow>
					title="选择负责人"
					api={fetchEmployees}
					columns={EMPLOYEE_COLUMNS}
					checkedKeys={employeeRadioSelected}
					onChange={handleEmployeeRadioChange}
					placeholder="请选择负责人"
					search={EMPLOYEE_SEARCH_CONFIG}
					selectionType="radio"
				/>
			</Card>
		</div>
	);
};

export default BasicForm;
