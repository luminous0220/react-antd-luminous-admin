import {
	useState,
	useCallback,
	useMemo,
	forwardRef,
	useImperativeHandle,
	useEffect,
	useRef,
} from "react";
import { Checkbox, Input, Button, Card, Spin, Pagination } from "antd";
import { IconSearch } from "@tabler/icons-react";
import { ProModal } from "@/components/ProModal";
import { SelectedPanel } from "./components/SelectedPanel";
import { SelectorFooter } from "./components/SelectorFooter";
import type {
	ListItemData,
	ListSelectorNode,
	ListSelectorApi,
	ListSelectorModalOpenProps,
	ListSelectorModalRef,
	ListSelectorModalProps,
} from "./types";

export type {
	ListSelectorModalOpenProps,
	ListSelectorModalRef,
	ListSelectorModalProps,
} from "./types";

const PAGE_SIZE = 20;

/**
 * @description ListSelectorModal 列表选择弹窗（无触发器，编程式控制）
 * 数据通过 api 分页获取，支持搜索过滤。
 * 通过 ref.open(props) 打开弹窗，ref.close() 关闭。
 */
function ListSelectorModalInner(
	{
		title: defaultTitle = "选择数据",
		width = 820,
		api: defaultApi,
		onConfirm,
	}: ListSelectorModalProps,
	ref: React.ForwardedRef<ListSelectorModalRef>,
) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	// 已选项列表（单一状态源，跨页保留）
	const [selectedItems, setSelectedItems] = useState<ListSelectorNode[]>([]);
	const [data, setData] = useState<ListItemData[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [modalTitle, setModalTitle] = useState(defaultTitle);
	const apiRef = useRef<ListSelectorApi | null>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	// 同步 api prop 到 ref
	useEffect(() => {
		apiRef.current = defaultApi ?? null;
	}, [defaultApi]);

	// 当前页已选 key 集合（用于 Checkbox checked 判断）
	const checkedKeySet = useMemo<Set<React.Key>>(() => {
		return new Set(selectedItems.map((item) => item.value));
	}, [selectedItems]);

	// 当前页全选状态
	const isAllSelected = useMemo(
		() => data.length > 0 && data.every((item) => checkedKeySet.has(item.value)),
		[data, checkedKeySet],
	);

	// 请求数据
	const fetchData = useCallback(
		async (api: ListSelectorApi, pageNumber: number, keyword: string) => {
			setLoading(true);
			try {
				const result = await api({
					pageNumber,
					pageSize: PAGE_SIZE,
					keyword: keyword || undefined,
				});
				if (result) {
					setData(result.data ?? []);
					setTotal(result.total ?? 0);
				}
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	// 搜索防抖
	const handleSearch = useCallback(
		(value: string) => {
			setSearchText(value);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				if (apiRef.current) {
					setPage(1);
					fetchData(apiRef.current, 1, value);
				}
			}, 300);
		},
		[fetchData],
	);

	// 翻页
	const handlePageChange = useCallback(
		(p: number) => {
			setPage(p);
			if (apiRef.current) fetchData(apiRef.current, p, searchText);
		},
		[fetchData, searchText],
	);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const handleCancel = useCallback(() => setIsOpen(false), []);

	const handleConfirm = useCallback(() => {
		onConfirm?.(selectedItems);
		setIsOpen(false);
	}, [selectedItems, onConfirm]);

	const handleClearAll = useCallback(() => setSelectedItems([]), []);

	const removeSelectedItem = useCallback((item: ListSelectorNode) => {
		setSelectedItems((prev) => prev.filter((s) => s.value !== item.value));
	}, []);

	const handleSelectAll = useCallback(() => {
		if (isAllSelected) {
			// 取消全选：移除当前页所有项
			const keySet = new Set(data.map((d) => d.value));
			setSelectedItems((prev) => prev.filter((s) => !keySet.has(s.value)));
		} else {
			// 全选：合并当前页（已有项保留，仅新增未选的）
			const existingKeys = new Set(selectedItems.map((s) => s.value));
			const newItems = data
				.filter((d) => !existingKeys.has(d.value))
				.map((d) => ({ value: d.value, title: d.title, desc: d.desc }));
			setSelectedItems((prev) => [...prev, ...newItems]);
		}
	}, [isAllSelected, data, selectedItems]);

	const handleCheckboxChange = useCallback(
		(item: ListItemData, checked: boolean) => {
			if (checked) {
				setSelectedItems((prev) => {
					if (prev.some((s) => s.value === item.value)) return prev;
					return [...prev, { value: item.value, title: item.title, desc: item.desc }];
				});
			} else {
				setSelectedItems((prev) => prev.filter((s) => s.value !== item.value));
			}
		},
		[],
	);

	const open = useCallback(
		(props: ListSelectorModalOpenProps) => {
			setModalTitle(props.title ?? defaultTitle);
			setSearchText("");
			setSelectedItems(props.checkedKeys ?? []);
			setIsOpen(true);

			// 优先使用静态数据，其次使用 api 获取
			if (props.data) {
				setData(props.data);
				setTotal(props.data.length);
				setPage(1);
				setLoading(false);
			} else if (apiRef.current) {
				setPage(1);
				fetchData(apiRef.current, 1, "");
			}
		},
		[defaultTitle, fetchData],
	);

	const close = useCallback(() => setIsOpen(false), []);

	useImperativeHandle(ref, () => ({ open, close }), [open, close]);

	return (
		<ProModal
			open={isOpen}
			onCancel={handleCancel}
			title={modalTitle}
			width={width}
			footer={null}
			destroyOnHidden
		>
			<div className="flex flex-col">
				<Input
					placeholder="请输入关键词"
					value={searchText}
					onChange={(e) => handleSearch(e.target.value)}
					allowClear
					prefix={<IconSearch size={16} className="text-gray-400" />}
					className="mb-4"
					size="large"
				/>

				<div className="gap-5 min-h-0 grid grid-cols-10 max-md:grid-cols-1">
					<div className="col-span-6">
						<Card
							classNames={{ header: "!bg-[var(--ant-color-bg-layout)]" }}
							styles={{ body: { padding: 12, overflow: "auto", maxHeight: "400px" } }}
							title={
								<div className="flex justify-between items-center">
									<span className="text-base">列表选择区域</span>
									<Button type="link" size="small" onClick={handleSelectAll}>
										{isAllSelected ? "取消全选" : "全选"}
									</Button>
								</div>
							}
						>
							<Spin spinning={loading}>
								{data.length === 0 ? (
									<div className="text-gray-400 text-center py-12">暂无数据</div>
								) : (
									<div className="flex flex-col gap-1">
										{data.map((item) => (
											<div
												key={item.value}
												className="flex items-center gap-2 py-1.5 px-1 rounded
													hover:bg-[var(--ant-color-bg-layout)] transition-colors cursor-pointer"
												onClick={() => handleCheckboxChange(item, !checkedKeySet.has(item.value))}
											>
												<Checkbox
													checked={checkedKeySet.has(item.value)}
													onChange={(e) => handleCheckboxChange(item, e.target.checked)}
													onClick={(e) => e.stopPropagation()}
												/>
												<div className="flex items-center gap-2 min-w-0">
													<span className="text-sm truncate">{item.title}</span>
													{item.desc && (
														<span className="text-xs text-gray-400 truncate">— {item.desc}</span>
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</Spin>
							{total > PAGE_SIZE && (
								<div className="flex justify-center mt-3">
									<Pagination
										current={page}
										pageSize={PAGE_SIZE}
										total={total}
										size="small"
										showSizeChanger={false}
										onChange={handlePageChange}
									/>
								</div>
							)}
						</Card>
					</div>

					<div className="col-span-4">
						<SelectedPanel
							selectedItems={selectedItems}
							onRemove={removeSelectedItem}
							onClearAll={handleClearAll}
						/>
					</div>
				</div>

				<SelectorFooter
					selectedCount={selectedItems.length}
					onCancel={handleCancel}
					onConfirm={handleConfirm}
				/>
			</div>
		</ProModal>
	);
}

export const ListSelectorModal = forwardRef(ListSelectorModalInner) as (
	props: ListSelectorModalProps & { ref?: React.Ref<ListSelectorModalRef> },
) => React.ReactElement | null;
