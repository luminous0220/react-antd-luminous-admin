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
import { SelectedPanel, type SelectedItem } from "./components/SelectedPanel";
import { SelectorFooter } from "./components/SelectorFooter";
import type { ListItemData, ListSelectorNode, ListSelectorApi } from "./types";

/** open() 可传入的参数 */
export interface ListSelectorModalOpenProps {
	title?: string;
	api: ListSelectorApi;
	checkedKeys?: ListSelectorNode[];
}

/** ListSelectorModal 实例方法 */
export interface ListSelectorModalRef {
	open: (props: ListSelectorModalOpenProps) => void;
	close: () => void;
}

/** ListSelectorModal Props */
export interface ListSelectorModalProps {
	title?: string;
	width?: number;
	onConfirm?: (selected: ListSelectorNode[]) => void;
}

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
		onConfirm,
	}: ListSelectorModalProps,
	ref: React.ForwardedRef<ListSelectorModalRef>,
) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [modalCheckedKeys, setModalCheckedKeys] = useState<React.Key[]>([]);
	const [data, setData] = useState<ListItemData[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [modalTitle, setModalTitle] = useState(defaultTitle);
	const apiRef = useRef<ListSelectorApi | null>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	const modalSelected = useMemo<ListSelectorNode[]>(() => {
		return modalCheckedKeys
			.map((k) => data.find((d) => d.value === k))
			.filter(Boolean)
			.map((item) => ({
				value: item!.value,
				title: item!.title,
				desc: item!.desc,
			}));
	}, [modalCheckedKeys, data]);

	const allKeys = useMemo<React.Key[]>(
		() => data.map((item) => item.value),
		[data],
	);

	const isAllSelected = useMemo(
		() =>
			data.length > 0 &&
			data.every((item) => modalCheckedKeys.includes(item.value)),
		[data, modalCheckedKeys],
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
		const selected = modalCheckedKeys
			.map((k) => data.find((d) => d.value === k))
			.filter(Boolean)
			.map((item) => ({
				value: item!.value,
				title: item!.title,
				desc: item!.desc,
			}));
		onConfirm?.(selected);
		setIsOpen(false);
	}, [modalCheckedKeys, data, onConfirm]);

	const handleClearAll = useCallback(() => setModalCheckedKeys([]), []);

	const removeSelectedItem = useCallback((item: ListSelectorNode) => {
		setModalCheckedKeys((prev) => prev.filter((k) => k !== item.value));
	}, []);

	const handleSelectAll = useCallback(() => {
		if (isAllSelected) {
			const keySet = new Set(data.map((d) => d.value));
			setModalCheckedKeys((prev) => prev.filter((k) => !keySet.has(k as any)));
		} else {
			setModalCheckedKeys((prev) => {
				const keySet = new Set(prev);
				for (const key of allKeys) keySet.add(key);
				return Array.from(keySet);
			});
		}
	}, [isAllSelected, allKeys, data]);

	const handleCheckboxChange = useCallback(
		(value: React.Key, checked: boolean) => {
			setModalCheckedKeys((prev) =>
				checked ? [...prev, value] : prev.filter((k) => k !== value),
			);
		},
		[],
	);

	const open = useCallback(
		(props: ListSelectorModalOpenProps) => {
			apiRef.current = props.api;
			setModalTitle(props.title ?? defaultTitle);
			setSearchText("");
			setPage(1);
			if (props.checkedKeys?.length) {
				setModalCheckedKeys(props.checkedKeys.map((item) => item.value));
			} else {
				setModalCheckedKeys([]);
			}
			fetchData(props.api, 1, "");
			setIsOpen(true);
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

				<div className="gap-5 min-h-0 grid grid-cols-2 max-md:grid-cols-1">
					<Card
						classNames={{ header: "!bg-[var(--ant-color-bg-layout)]" }}
						styles={{
							body: { padding: 12, overflow: "auto", maxHeight: "400px" },
						}}
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
											onClick={() =>
												handleCheckboxChange(
													item.value,
													!modalCheckedKeys.includes(item.value),
												)
											}
										>
											<Checkbox
												checked={modalCheckedKeys.includes(item.value)}
												onChange={(e) =>
													handleCheckboxChange(item.value, e.target.checked)
												}
												onClick={(e) => e.stopPropagation()}
											/>
											<div className="flex items-center gap-2 min-w-0">
												<span className="text-sm truncate">{item.title}</span>
												{item.desc && (
													<span className="text-xs text-gray-400 truncate">
														— {item.desc}
													</span>
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

					<SelectedPanel
						selectedItems={modalSelected}
						onRemove={removeSelectedItem as (item: SelectedItem) => void}
						onClearAll={handleClearAll}
					/>
				</div>

				<SelectorFooter
					selectedCount={modalSelected.length}
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
