import React, { useState, useCallback, useMemo, useRef } from "react";
import { Tag, Button, Space, Popconfirm } from "antd";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import {
	ProTable,
	ProTableColumnType,
	ProTableProps,
} from "@/components/ProTable";
import { ProForm } from "@/components/ProForm";
import type {
	ProFormInstance,
	FormFieldItem,
	FormValues,
} from "@/components/ProForm";
import { Api } from "@/apis";
import type { IApi } from "@/apis";

/**
 * @description 字典数据子表组件 Props
 */
interface DictDataProps {
	/** 当前选中的字典类型 */
	dictType: IApi.DictTypeItem;
	/** 返回字典类型列表的回调 */
	onBack: () => void;
}

/**
 * @description 字典数据管理组件（替换原下方子表区域，独立视图展示）
 */
const DictData: React.FC<DictDataProps> = ({ dictType, onBack }) => {
	const dataModalRef = useRef<ProFormInstance>(null);
	const [refreshKey, setRefreshKey] = useState(0);

	// 刷新列表
	const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

	// 新增字典数据
	const openAddData = useCallback(() => {
		dataModalRef.current?.open({
			title: `新增字典数据 - ${dictType.name}`,
			initialValues: { dictTypeId: dictType.id, status: true, sort: 10 },
		});
	}, [dictType]);

	// 编辑字典数据
	const openEditData = useCallback((record: IApi.DictDataItem) => {
		dataModalRef.current?.open({
			title: "编辑字典数据",
			initialValues: { ...record, status: record.status === 1 },
			extraParams: { id: record.id },
		});
	}, []);

	// 表单确认回调
	const handleDataConfirm = useCallback(
		async (
			title: string,
			values: FormValues,
			extraParams?: Record<string, any>,
		) => {
			const payload = { ...values, status: values.status ? 1 : 0 };
			if (title?.includes("新增")) {
				await Api.saveDictData(payload as IApi.DictDataReq);
				window.$message?.success?.("新增成功");
			} else {
				await Api.saveDictData({
					...payload,
					id: extraParams?.id,
				} as IApi.DictDataReq);
				window.$message?.success?.("编辑成功");
			}
			refresh();
		},
		[refresh],
	);

	// 删除字典数据
	const handleDeleteData = useCallback(
		async (id: string) => {
			await Api.deleteDictData(id);
			window.$message?.success?.("删除成功");
			refresh();
		},
		[refresh],
	);

	// 字典数据表格列
	const dataColumns: ProTableColumnType<IApi.DictDataItem>[] = useMemo(
		() => [
			{
				title: "标签",
				dataIndex: "label",
				key: "label",
				width: 120,
				render: (v: string) => <Tag color="green">{v}</Tag>,
			},
			{
				title: "值",
				dataIndex: "value",
				key: "value",
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
				render: (_: unknown, record: IApi.DictDataItem) => (
					<Tag color={record.status === 1 ? "green" : "default"}>
						{record.status === 1 ? "启用" : "禁用"}
					</Tag>
				),
			},
			{
				title: "描述",
				dataIndex: "desc",
				key: "desc",
				width: 160,
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
				render: (_: unknown, record: IApi.DictDataItem) => (
					<Space>
						<Button
							type="link"
							size="small"
							onClick={() => openEditData(record)}
						>
							编辑
						</Button>
						<Popconfirm
							title="确定删除？"
							onConfirm={() => handleDeleteData(record.id)}
						>
							<Button type="link" size="small" danger>
								删除
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		],
		[handleDeleteData, openEditData],
	);

	// 表单字段配置
	const dataFormFields: FormFieldItem[] = useMemo(
		() => [
			{
				type: "input",
				name: "label",
				label: "标签名",
				formItemProps: { rules: [{ required: true, message: "请输入标签名" }] },
				fieldProps: { placeholder: "如: 男", allowClear: true },
			},
			{
				type: "input",
				name: "value",
				label: "数据值",
				formItemProps: { rules: [{ required: true, message: "请输入数据值" }] },
				fieldProps: { placeholder: "如: male", allowClear: true },
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
				fieldProps: { placeholder: "数据项描述", rows: 2, allowClear: true },
			},
		],
		[],
	);

	// ProTable props
	const dataTableProps: ProTableProps<IApi.DictDataItem> = useMemo(
		() => ({
			key: `data-${refreshKey}`,
			title: (
				<span>
					字典数据：
					<Tag color="blue">{dictType.name}</Tag>
				</span>
			),
			rowKey: "id" as const,
			columns: dataColumns,
			api: async (params) => {
				const res = await Api.getDictDataList({
					...params,
					dictTypeId: dictType.id,
				});
				return { data: res.data, total: res.total };
			},
			toolbarExtra: (
				<Button
					type="primary"
					icon={<IconPlus size={16} />}
					onClick={openAddData}
				>
					新增数据
				</Button>
			),
		}),
		[refreshKey, dataColumns, dictType, openAddData],
	);

	return (
		<div className="flex flex-col gap-4">
			{/* 顶部返回栏 */}
			<div className="flex items-center gap-3">
				<Button
					icon={<IconArrowLeft size={16} />}
					onClick={onBack}
				>
					返回类型列表
				</Button>
				<span className="text-base text-[var(--ant-color-text-secondary)]">
					字典类型：{dictType.name}
					<span className="ml-2 text-xs text-[var(--ant-color-text-tertiary)]">
						({dictType.code})
					</span>
				</span>
			</div>

			<ProTable<IApi.DictDataItem> {...dataTableProps} />

			<ProForm
				ref={dataModalRef}
				type="modal"
				fields={dataFormFields}
				onConfirm={handleDataConfirm}
			/>
		</div>
	);
};

export default DictData;
