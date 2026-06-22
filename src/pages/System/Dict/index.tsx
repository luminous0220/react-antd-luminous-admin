import React, { useState, useCallback, useMemo, useRef } from "react";
import { Tag, Button, Space, Popconfirm, Switch } from "antd";
import { IconPlus, IconList } from "@tabler/icons-react";
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
import { AnimatePresence, motion } from "framer-motion";
import DictData from "./DictData";

const typeSearchConfig: ProTableSearchConfig = {
	fields: [
		{
			type: "input",
			name: "name",
			label: "类型名称",
			fieldProps: { placeholder: "请输入类型名称", allowClear: true },
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

const Dict: React.FC = () => {
	const typeModalRef = useRef<ProFormInstance>(null);
	const [refreshKey, setRefreshKey] = useState(0);
	const [selectedType, setSelectedType] = useState<IApi.DictTypeItem | null>(
		null,
	);

	// ===== 字典类型 CRUD =====
	const openAddType = useCallback(() => {
		typeModalRef.current?.open({
			title: "新增字典类型",
			initialValues: { status: true, sort: 10 },
		});
	}, []);

	const openEditType = useCallback((record: IApi.DictTypeItem) => {
		typeModalRef.current?.open({
			title: "编辑字典类型",
			initialValues: { ...record, status: record.status === 1 },
			extraParams: { id: record.id },
		});
	}, []);

	const handleTypeConfirm = useCallback(
		async (
			title: string,
			values: FormValues,
			extraParams?: Record<string, any>,
		) => {
			const payload = { ...values, status: values.status ? 1 : 0 };
			if (title === "新增字典类型") {
				await Api.saveDictType(payload as IApi.DictTypeReq);
				window.$message?.success?.("新增成功");
			} else {
				await Api.saveDictType({
					...payload,
					id: extraParams?.id,
				} as IApi.DictTypeReq);
				window.$message?.success?.("编辑成功");
			}
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	const handleDeleteType = useCallback(
		async (id: string) => {
			await Api.deleteDictType(id);
			window.$message?.success?.("删除成功");
			if (selectedType?.id === id) setSelectedType(null);
			setRefreshKey((k) => k + 1);
		},
		[selectedType],
	);

	const handleStatusChange = useCallback(
		async (record: IApi.DictTypeItem, checked: boolean) => {
			await Api.saveDictType({
				...record,
				status: checked ? 1 : 0,
			} as IApi.DictTypeReq);
			window.$message?.success?.(
				`已${checked ? "启用" : "禁用"}: ${record.name}`,
			);
			setRefreshKey((k) => k + 1);
		},
		[],
	);

	// ===== 字典类型表格列 =====
	const typeColumns: ProTableColumnType<IApi.DictTypeItem>[] = useMemo(
		() => [
			{
				title: "类型名称",
				dataIndex: "name",
				key: "name",
				width: 130,
				render: (v: string) => <Tag color="blue">{v}</Tag>,
			},
			{
				title: "类型编码",
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
				render: (_: unknown, record: IApi.DictTypeItem) => (
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
				hideable: false,
				fixable: false,
				render: (_: unknown, record: IApi.DictTypeItem) => (
					<Space>
						<Button
							type="link"
							size="small"
							icon={<IconList size={14} />}
							onClick={() => setSelectedType(record)}
						>
							数据
						</Button>
						<Button
							type="link"
							size="small"
							onClick={() => openEditType(record)}
						>
							编辑
						</Button>
						<Popconfirm
							title="确定删除？"
							onConfirm={() => handleDeleteType(record.id)}
						>
							<Button type="link" size="small" danger>
								删除
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[handleStatusChange, handleDeleteType, openEditType],
	);

	// ===== 表单字段 =====
	const typeFormFields: FormFieldItem[] = useMemo(
		() => [
			{
				type: "input",
				name: "name",
				label: "类型名称",
				formItemProps: {
					rules: [{ required: true, message: "请输入类型名称" }],
				},
				fieldProps: { placeholder: "如: 用户性别", allowClear: true },
			},
			{
				type: "input",
				name: "code",
				label: "类型编码",
				formItemProps: {
					rules: [{ required: true, message: "请输入类型编码" }],
				},
				fieldProps: { placeholder: "如: user_gender", allowClear: true },
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
				fieldProps: { placeholder: "类型描述", rows: 2, allowClear: true },
			},
		],
		[],
	);

	const typeTableProps: ProTableProps<IApi.DictTypeItem> = useMemo(
		() => ({
			key: refreshKey,
			title: "字典类型",
			rowKey: "id" as const,
			columns: typeColumns,
			search: typeSearchConfig,
			api: async (params) => {
				const res = await Api.getDictTypeList(params);
				return { data: res.data, total: res.total };
			},
			toolbarExtra: (
				<Button
					type="primary"
					icon={<IconPlus size={16} />}
					onClick={openAddType}
				>
					新增类型
				</Button>
			),
		}),
		[refreshKey, typeColumns, openAddType],
	);

	// 返回类型列表
	const handleBack = useCallback(() => setSelectedType(null), []);

	return (
		<div className="flex flex-col gap-4">
			<AnimatePresence mode="wait">
				{selectedType ? (
					<motion.div
						key="dict-data"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.25 }}
					>
						<DictData dictType={selectedType} onBack={handleBack} />
					</motion.div>
				) : (
					<motion.div
						key="type-list"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.25 }}
					>
						<ProTable<IApi.DictTypeItem> {...typeTableProps} />
					</motion.div>
				)}
			</AnimatePresence>

			<ProForm
				ref={typeModalRef}
				type="modal"
				fields={typeFormFields}
				onConfirm={handleTypeConfirm}
			/>
		</div>
	);
};

export default Dict;
