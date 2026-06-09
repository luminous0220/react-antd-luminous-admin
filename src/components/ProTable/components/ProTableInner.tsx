import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
	useImperativeHandle,
} from "react";
import { Table, Card, Form } from "antd";
import type { TableColumnType } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type {
	ProTableProps,
	ProTableColumnType,
	ProTableColumnConfig,
	ProTableDensity,
	ProTablePagination,
	ProTableRef,
} from "../types.d";
import {
	DEFAULT_PAGE_SIZE,
	PAGE_SIZE_OPTIONS,
	getColumnKey,
	initColumnConfigs,
	getOrderedColumns,
	createIndexColumn,
} from "../utils";
import { useGlobalStore } from "@/stores";
import { ProForm } from "@/components/ProForm";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Toolbar } from "./Toolbar";
import { SelectedInfo } from "./SelectedInfo";
import { DragHandle, SortableRow } from "./DragSortRow";

export function ProTableInner<T>(
	props: ProTableProps<T>,
	ref: React.ForwardedRef<ProTableRef<T>>,
) {
	const {
		api,
		auto = true,
		title,
		toolbarExtra,
		index = true,
		indexWidth = 60,
		onSelectRows,
		onPageChange,
		columns = [],
		dataSource: externalDataSource,
		total: externalTotal,
		scroll,
		defaultPagination = { pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE },
		search,
		exportable = false,
		exportFileName,
		dragSort = false,
		onDragSortEnd,
		rowKey,
		...restProps
	} = props;

	// 内部状态
	const [dataSource, setDataSource] = useState<T[]>(externalDataSource ?? []);
	const [total, setTotal] = useState<number>(externalTotal ?? 0);
	const [loading, setLoading] = useState<boolean>(false);
	const [pagination, setPagination] =
		useState<ProTablePagination>(defaultPagination);
	const [density, setDensity] = useState<ProTableDensity>("middle");
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [selectedRows, setSelectedRows] = useState<T[]>([]);
	const [columnConfigs, setColumnConfigs] = useState<ProTableColumnConfig[]>(
		() => initColumnConfigs(columns),
	);
	// 筛选表单状态
	const [searchValues, setSearchValues] = useState<Record<string, unknown>>(
		search?.initialValues ?? {},
	);
	const [searchForm] = Form.useForm();
	// 响应式状态
	const isMobile = useGlobalStore((s) => s.isMobile);

	// 是否已初始化（防止重复请求）
	const initializedRef = useRef(false);
	// 记录初始分页（避免 mount 时两个 effect 各触发一次 refresh）
	const prevPaginationRef = useRef(pagination);
	// 强制刷新标识
	const forceRefreshRef = useRef(false);

	// 刷新数据（合并筛选参数）
	const refresh = useCallback(async () => {
		if (!api) return;

		setLoading(true);
		try {
			const result = await api({
				pageNumber: pagination.pageNumber,
				pageSize: pagination.pageSize,
				...searchValues,
			});
			if (!result || !result.data) return;
			setDataSource(result.data);
			setTotal(result.total || 0);
		} catch (error) {
			console.error("ProTable fetch error:", error);
			window.$message?.error?.("数据加载失败");
		} finally {
			setLoading(false);
		}
	}, [api, pagination.pageNumber, pagination.pageSize, searchValues]);

	// 暴露实例方法给父组件
	useImperativeHandle(
		ref,
		() => ({
			refresh,
			getDataSource: () => dataSource,
			clearSelected: () => {
				setSelectedRowKeys([]);
				setSelectedRows([]);
				onSelectRows?.([]);
			},
			setSearchValues: (values: Record<string, unknown>) => {
				setSearchValues(values);
			},
			reset: () => {
				setSearchValues(search?.initialValues ?? {});
				setPagination(defaultPagination);
			},
			setLoading,
		}),
		[
			refresh,
			dataSource,
			onSelectRows,
			search?.initialValues,
			defaultPagination,
		],
	);

	// 自动请求
	useEffect(() => {
		if (!api || !auto) return;
		if (initializedRef.current) return;

		initializedRef.current = true;
		refresh();
	}, [api, auto, refresh]);

	// 分页变化时重新请求（跳过初始值，避免与自动请求重复）
	useEffect(() => {
		if (!api || !auto || !initializedRef.current) return;
		const prev = prevPaginationRef.current;
		if (
			prev.pageNumber === pagination.pageNumber &&
			prev.pageSize === pagination.pageSize &&
			!forceRefreshRef.current
		)
			return;
		prevPaginationRef.current = pagination;
		refresh();
		forceRefreshRef.current = false;
	}, [pagination, api, auto, refresh]);

	// 筛选值变化时重新请求（重置分页到第一页）
	useEffect(() => {
		if (!api || !auto || !initializedRef.current) return;
		setPagination((prev) =>
			prev.pageNumber === 1 ? prev : { ...prev, pageNumber: 1 },
		);
		forceRefreshRef.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValues]);

	// 同步外部数据
	useEffect(() => {
		if (externalDataSource !== undefined) {
			setDataSource(externalDataSource);
		}
	}, [externalDataSource]);

	useEffect(() => {
		if (externalTotal !== undefined) {
			setTotal(externalTotal);
		}
	}, [externalTotal]);

	// columns 的稳定 key
	const columnsKey = useMemo(() => {
		return columns.map((col, idx) => getColumnKey(col, idx)).join("|");
	}, [columns]);

	// 同步 columns 配置
	useEffect(() => {
		setColumnConfigs(initColumnConfigs(columns));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnsKey]);

	// 处理分页变化
	const handlePaginationChange = useCallback(
		(page: number, pageSize: number) => {
			const newPagination = { pageNumber: page, pageSize };
			setPagination(newPagination);
			onPageChange?.(newPagination);
		},
		[onPageChange],
	);

	// 处理行选择
	const handleRowSelectionChange = useCallback(
		(newSelectedRowKeys: React.Key[]) => {
			setSelectedRowKeys(newSelectedRowKeys);
			const selected = dataSource.filter((row, idx) =>
				newSelectedRowKeys.includes((row as any)?.id ?? idx),
			);
			setSelectedRows(selected);
			onSelectRows?.(selected);
		},
		[onSelectRows, dataSource],
	);

	// 清空选择
	const handleClearSelection = useCallback(() => {
		setSelectedRowKeys([]);
		setSelectedRows([]);
		onSelectRows?.([]);
	}, [onSelectRows]);

	// 拖拽排序结束回调
	const handleDragEnd = useCallback(
		({ active, over }: DragEndEvent) => {
			if (!over || active.id === over.id) return;
			setDataSource((prev) => {
				const activeIndex = prev.findIndex((record) => {
					const key =
						typeof rowKey === "function"
							? (rowKey as (r: T) => string)(record)
							: rowKey
								? String((record as any)[rowKey])
								: String(prev.indexOf(record));
					return key === String(active.id);
				});
				const overIndex = prev.findIndex((record) => {
					const key =
						typeof rowKey === "function"
							? (rowKey as (r: T) => string)(record)
							: rowKey
								? String((record as any)[rowKey])
								: String(prev.indexOf(record));
					return key === String(over.id);
				});
				const newData = arrayMove(prev, activeIndex, overIndex);
				onDragSortEnd?.(newData);
				return newData;
			});
		},
		[rowKey, onDragSortEnd],
	);

	// 计算拖拽排序所需的 ids
	const sortableIds = useMemo(() => {
		if (typeof rowKey === "function") {
			return dataSource.map((record) => (rowKey as (r: T) => string)(record));
		}
		if (typeof rowKey === "string") {
			return dataSource.map((record) => String((record as any)[rowKey]));
		}
		return dataSource.map((_, i) => String(i));
	}, [dataSource, rowKey]);

	// 计算实际渲染的列
	const renderedColumns = useMemo(() => {
		let result = getOrderedColumns(columns, columnConfigs);

		// 拖拽手柄列（最前面）
		if (dragSort) {
			const dragColumn: ProTableColumnType<T> = {
				key: "__drag_handle__",
				width: 80,
				align: "center",
				hideable: false,
				fixable: false,
				render: () => <DragHandle />,
			};
			result = [dragColumn, ...result];
		}

		if (index) {
			result = [
				createIndexColumn(
					pagination.pageNumber,
					pagination.pageSize,
					indexWidth,
				),
				...result,
			];
		}

		return result as TableColumnType<T>[];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		columnsKey,
		columnConfigs,
		dragSort,
		index,
		pagination.pageNumber,
		pagination.pageSize,
	]);

	// 导出 Excel
	const handleExport = useCallback(async () => {
		if (!selectedRows.length) {
			window.$message?.warning?.("请选择要导出的行");
			return;
		}
		window.$message?.info?.("导出中，请稍后...");
		try {
			// 获取当前可见的列（排除无 dataIndex 的列和序号列）
			const exportColumns = renderedColumns.filter(
				(col: any) => col.dataIndex && col.key !== "__index__",
			);
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("Sheet1");

			const header = worksheet.addRow(
				exportColumns.map((col: any) => col.title ?? ""),
			);
			header.eachCell((cell, colNumber) => {
				cell.font = { bold: true };
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFE6F3FF" },
				};
				cell.border = {
					top: { style: "thin", color: { argb: "FF000000" } },
					left: { style: "thin", color: { argb: "FF000000" } },
					bottom: { style: "thin", color: { argb: "FF000000" } },
					right: { style: "thin", color: { argb: "FF000000" } },
				};
				const col = exportColumns[colNumber - 1] as any;
				worksheet.getColumn(colNumber).width =
					typeof col?.width === "number"
						? Math.max(8, Math.floor(col.width / 8))
						: 20;
			});

			selectedRows.forEach((row) => {
				const dataRow = worksheet.addRow(
					exportColumns.map(
						(col: any) => (row as any)[col.dataIndex as string] ?? "",
					),
				);
				dataRow.eachCell((cell) => {
					cell.border = {
						top: { style: "thin", color: { argb: "FF000000" } },
						left: { style: "thin", color: { argb: "FF000000" } },
						bottom: { style: "thin", color: { argb: "FF000000" } },
						right: { style: "thin", color: { argb: "FF000000" } },
					};
				});
			});

			const buffer = await workbook.xlsx.writeBuffer();
			const fileName = exportFileName
				? `${exportFileName}.xlsx`
				: title
					? `${title}-表格.xlsx`
					: `${new Date().toISOString().slice(0, 10)}.xlsx`;
			saveAs(
				new Blob([buffer], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				}),
				fileName,
			);
		} catch {
			window.$message?.error?.("导出失败，请重试");
		}
	}, [selectedRows, renderedColumns, title, exportFileName]);

	// 密度变化回调
	const handleDensityChange = useCallback(
		(newDensity: ProTableDensity) => setDensity(newDensity),
		[],
	);

	// 列配置变化回调
	const handleColumnConfigsChange = useCallback(
		(newConfigs: ProTableColumnConfig[]) => setColumnConfigs(newConfigs),
		[],
	);

	// 筛选表单查询回调
	const handleSearch = useCallback((values: Record<string, unknown>) => {
		setSearchValues(values);
	}, []);

	// 分页配置
	const paginationConfig = useMemo(() => {
		if (!total || total === 0) return false as const;

		return {
			current: pagination.pageNumber,
			pageSize: pagination.pageSize,
			total,
			pageSizeOptions: PAGE_SIZE_OPTIONS,
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: (total: number, range: [number, number]) =>
				`${range[0]}-${range[1]} 共 ${total} 条`,
			onChange: handlePaginationChange,
		};
	}, [
		total,
		pagination.pageNumber,
		pagination.pageSize,
		handlePaginationChange,
	]);

	// 行选择配置
	const rowSelectionConfig = useMemo(() => {
		if (!onSelectRows && !exportable) return undefined;

		return {
			selectedRowKeys,
			onChange: handleRowSelectionChange,
			type: "checkbox" as const,
		};
	}, [onSelectRows, exportable, selectedRowKeys, handleRowSelectionChange]);

	// 稳定的 Table props（无拖拽时的基础配置，拖拽时在此基础上覆盖 components）
	const baseTableProps = useMemo(
		() => ({
			indentSize: 40,
			...restProps,
			rowKey,
			columns: renderedColumns,
			dataSource,
			loading,
			size: density,
			pagination: paginationConfig,
			...(rowSelectionConfig ? { rowSelection: rowSelectionConfig } : {}),
			scroll: scroll
				? scroll
				: isMobile
					? { x: "max-content", y: "420px" }
					: { y: "calc(100vh - 420px)" },
		}),
		[
			restProps,
			rowKey,
			renderedColumns,
			dataSource,
			loading,
			density,
			paginationConfig,
			rowSelectionConfig,
			scroll,
			isMobile,
		],
	);

	// 拖拽模式下的 Table props（合并 SortableRow）
	const tableProps = useMemo(() => {
		if (!dragSort) return baseTableProps;

		return {
			...baseTableProps,
			components: {
				body: {
					row: SortableRow,
				},
			},
		};
	}, [baseTableProps, dragSort]);

	return (
		<>
			{/* 筛选表单 */}
			{search && (
				<Card className="mb-2">
					<ProForm
						type="pure"
						form={searchForm}
						fields={search.fields}
						initialValues={search.initialValues}
						layout="inline"
						labelCol={{}}
						wrapperCol={{}}
						collapsible={{
							defaultShowCount: search.defaultShowCount ?? 6,
						}}
						disabled={loading}
						footer={{
							confirmText: "查询",
							resetText: "重置",
						}}
						onConfirm={async (_, values: Record<string, unknown>) => {
							handleSearch(values);
						}}
					/>
				</Card>
			)}

			<Card className="flex flex-col">
				{/* 工具栏 */}
				<Toolbar
					title={title}
					toolbarExtra={toolbarExtra}
					density={density}
					onDensityChange={handleDensityChange}
					onRefresh={refresh}
					columns={columns as ProTableColumnType<unknown>[]}
					columnConfigs={columnConfigs}
					onColumnConfigsChange={handleColumnConfigsChange}
					isMobile={isMobile}
					exportable={exportable}
					onExport={handleExport}
					selectedCount={selectedRows.length}
				/>

				{/* 选中信息 */}
				{onSelectRows && (
					<SelectedInfo
						selectedCount={selectedRowKeys.length}
						onClear={handleClearSelection}
					/>
				)}

				{/* 表格容器 */}
				<div className=" mt-1 flex-1 min-h-0 overflow-hidden">
					{dragSort ? (
						<DndContext
							modifiers={[restrictToVerticalAxis]}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={sortableIds}
								strategy={verticalListSortingStrategy}
							>
								<Table<T> {...tableProps} style={{ height: "100%" }} />
							</SortableContext>
						</DndContext>
					) : (
						<Table<T> {...tableProps} style={{ height: "100%" }} />
					)}
				</div>
			</Card>
		</>
	);
}
