import {
	useState,
	useCallback,
	useMemo,
	useEffect,
	forwardRef,
	useImperativeHandle,
	useRef,
} from "react";
import { Tree, Input, Button, Card, Spin } from "antd";
import { IconSearch } from "@tabler/icons-react";
import { ProModal } from "@/components/ProModal";
import { SelectedPanel } from "./components/SelectedPanel";
import { SelectorFooter } from "./components/SelectorFooter";
import type {
	TreeNodeData,
	TreeSelectorNode,
	SelectedItem,
	TreeSelectorApi,
	TreeSelectorModalOpenProps,
	TreeSelectorModalRef,
	TreeSelectorModalProps,
} from "./types";
import {
	getDescendantKeys,
	findNode,
	findParentNode,
	filterTree,
	getMatchedAncestorKeys,
	buildSelectedFromKeys,
	getAncestorKeys,
} from "./utils";
import {
	CaretDownOutlined,
	CaretRightOutlined,
} from "@ant-design/icons";
export type {
	TreeSelectorModalOpenProps,
	TreeSelectorModalRef,
	TreeSelectorModalProps,
} from "./types";

/**
 * @description TreeSelectorModal 树形选择弹窗（无触发器，编程式控制）
 * 支持 treeData 静态数据或 api 动态获取数据。
 * 通过 ref.open(props) 打开弹窗并渲染 Tree，ref.close() 关闭。
 */
function TreeSelectorModalInner(
	{
		title: defaultTitle = "选择经营区域",
		treeData: externalTreeData = [],
		api: defaultApi,
		width = 820,
		onConfirm,
	}: TreeSelectorModalProps,
	ref: React.ForwardedRef<TreeSelectorModalRef>,
) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [modalCheckedKeys, setModalCheckedKeys] = useState<React.Key[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
	const [treeData, setTreeData] = useState<TreeNodeData[]>(externalTreeData);
	const [modalTitle, setModalTitle] = useState(defaultTitle);
	const [loading, setLoading] = useState(false);
	const apiRef = useRef<TreeSelectorApi | null>(null);

	// 同步 api prop 到 ref
	useEffect(() => {
		apiRef.current = defaultApi ?? null;
	}, [defaultApi]);

	// 重置树数据
	const resetTreeData = useCallback((data: TreeNodeData[]) => {
		setTreeData(data);
		setExpandedKeys([]);
	}, []);

	// 请求数据
	const fetchData = useCallback(async (api: TreeSelectorApi) => {
		setLoading(true);
		try {
			const result = await api();
			if (result && Array.isArray(result)) {
				setTreeData(result);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	const modalSelected = useMemo<TreeSelectorNode[]>(
		() => buildSelectedFromKeys(modalCheckedKeys, treeData),
		[modalCheckedKeys, treeData],
	);

	const filteredTreeData = useMemo<TreeNodeData[]>(
		() => filterTree(treeData, searchText),
		[treeData, searchText],
	);

	useEffect(() => {
		if (searchText.trim()) {
			const ancestorKeys = getMatchedAncestorKeys(treeData, searchText);
			setExpandedKeys((prev) => {
				const merged = new Set([...prev, ...ancestorKeys]);
				return Array.from(merged);
			});
		}
	}, [searchText, treeData]);

	const handleCancel = useCallback(() => {
		setIsOpen(false);
		setSearchText("");
	}, []);

	const handleConfirm = useCallback(() => {
		const selected = buildSelectedFromKeys(modalCheckedKeys, treeData);
		onConfirm?.(selected);
		setIsOpen(false);
		setSearchText("");
	}, [modalCheckedKeys, treeData, onConfirm]);

	/**
	 * 纯函数：在 currentKeys 基础上勾选/取消 key，返回新的 keys。
	 * 勾选时联动选中子孙与祖先，取消时按「父节点仅在无其他已选子节点时才取消」的规则回退。
	 * 勾选框与 label 点击共用此逻辑，保证二者行为一致。
	 */
	const applyCheck = useCallback(
		(currentKeys: React.Key[], key: React.Key, checked: boolean) => {
			let newKeys = [...currentKeys];

			if (checked) {
				// 1. 选中所有子孙节点
				const descendantKeys = getDescendantKeys(treeData, key);
				for (const dk of descendantKeys) {
					if (!newKeys.includes(dk)) newKeys.push(dk);
				}
				// 2. 选中所有祖先节点（任意子节点选中 → 父节点选中）
				const ancestorKeys = getAncestorKeys(treeData, key);
				for (const ak of ancestorKeys) {
					if (!newKeys.includes(ak)) newKeys.push(ak);
				}
			} else {
				const nodeData = findNode(treeData, key);
				if (nodeData?.children?.length) {
					// 取消父节点 → 同时取消所有子孙节点
					const descendantKeys = getDescendantKeys(treeData, key);
					newKeys = newKeys.filter((k) => !descendantKeys.includes(k));
					// 检查祖先：如果当前父节点被取消后祖先无任何已选子节点，则取消祖先
					const ancestorKeys = getAncestorKeys(treeData, key);
					for (const ak of ancestorKeys) {
						const akNode = findNode(treeData, ak);
						if (akNode?.children) {
							const hasCheckedChild = akNode.children.some((c) =>
								newKeys.includes(c.value),
							);
							if (!hasCheckedChild) {
								newKeys = newKeys.filter((k) => k !== ak);
							}
						}
					}
				} else {
					// 取消叶子节点
					const parent = findParentNode(treeData, key);
					if (parent) {
						// 仅当父节点下无任何其他已选兄弟时，才取消父节点
						const siblingsChecked = parent.children!.some(
							(c) => c.value !== key && newKeys.includes(c.value),
						);
						if (!siblingsChecked) {
							newKeys = newKeys.filter((k) => k !== parent.value);
							// 继续向上检查祖先
							const ancestorKeys = getAncestorKeys(treeData, parent.value);
							for (const ak of ancestorKeys) {
								const akNode = findNode(treeData, ak);
								if (akNode?.children) {
									const hasCheckedChild = akNode.children.some((c) =>
										newKeys.includes(c.value),
									);
									if (!hasCheckedChild) {
										newKeys = newKeys.filter((k) => k !== ak);
									}
								}
							}
						}
					}
				}
			}
			return newKeys;
		},
		[treeData],
	);

	const handleTreeCheck = useCallback(
		(checkedKeys: any, info: any) => {
			const { node, checked } = info;
			const key = node.key;
			const currentKeys: React.Key[] = Array.isArray(checkedKeys)
				? checkedKeys
				: ((checkedKeys as { checked: React.Key[] }).checked ?? []);
			setModalCheckedKeys(applyCheck(currentKeys, key, checked));
		},
		[applyCheck],
	);

	// 点击节点 label 时切换勾选状态（复用与勾选框一致的联动逻辑）
	const handleNodeTitleClick = useCallback(
		(nodeData: TreeNodeData) => {
			const key = nodeData.value;
			setModalCheckedKeys((prev) => {
				const isChecked = prev.includes(key);
				return applyCheck(prev, key, !isChecked);
			});
		},
		[applyCheck],
	);

	const handleClearAll = useCallback(() => setModalCheckedKeys([]), []);

	const removeSelectedItem = useCallback(
		(item: TreeSelectorNode) => {
			let newKeys = modalCheckedKeys.filter((k) => k !== item.value);
			const nodeData = findNode(treeData, item.value);
			// 如果删除的是父节点，同时删除所有子孙
			if (nodeData?.children?.length) {
				const descendantKeys = getDescendantKeys(treeData, item.value);
				newKeys = newKeys.filter((k) => !descendantKeys.includes(k));
			}
			// 如果是子节点，检查父节点是否还有其他已选子节点
			if (item.type === "child" && item.pid) {
				const parentNode = findNode(treeData, item.pid);
				if (parentNode?.children) {
					const hasCheckedSibling = parentNode.children.some(
						(c) => c.value !== item.value && newKeys.includes(c.value),
					);
					if (!hasCheckedSibling) {
						newKeys = newKeys.filter((k) => k !== item.pid);
						// 继续向上检查祖先
						const ancestorKeys = getAncestorKeys(treeData, item.pid);
						for (const ak of ancestorKeys) {
							const akNode = findNode(treeData, ak);
							if (akNode?.children) {
								const hasCheckedChild = akNode.children.some((c) =>
									newKeys.includes(c.value),
								);
								if (!hasCheckedChild) {
									newKeys = newKeys.filter((k) => k !== ak);
								}
							}
						}
					}
				}
			}
			setModalCheckedKeys(newKeys);
		},
		[modalCheckedKeys, treeData],
	);

	const allTreeKeys = useMemo<React.Key[]>(() => {
		const keys: React.Key[] = [];
		const walk = (nodes: TreeNodeData[]) => {
			for (const node of nodes) {
				keys.push(node.value);
				if (node.children?.length) walk(node.children);
			}
		};
		walk(treeData);
		return keys;
	}, [treeData]);

	const isAllSelected = useMemo(
		() =>
			allTreeKeys.length > 0 &&
			allTreeKeys.every((k) => modalCheckedKeys.includes(k)),
		[allTreeKeys, modalCheckedKeys],
	);

	const handleSelectAll = useCallback(() => {
		if (isAllSelected) setModalCheckedKeys([]);
		else setModalCheckedKeys([...allTreeKeys]);
	}, [isAllSelected, allTreeKeys]);

	// 当前可见树中所有可展开节点（父节点）的 key，用于「展开/折叠全部」
	const allParentKeys = useMemo<React.Key[]>(() => {
		const keys: React.Key[] = [];
		const walk = (nodes: TreeNodeData[]) => {
			for (const node of nodes) {
				if (node.children?.length) {
					keys.push(node.value);
					walk(node.children);
				}
			}
		};
		walk(filteredTreeData);
		return keys;
	}, [filteredTreeData]);

	const isAllExpanded = useMemo(
		() =>
			allParentKeys.length > 0 &&
			allParentKeys.every((k) => expandedKeys.includes(k)),
		[allParentKeys, expandedKeys],
	);

	const handleToggleExpandAll = useCallback(() => {
		if (isAllExpanded) setExpandedKeys([]);
		else setExpandedKeys([...allParentKeys]);
	}, [isAllExpanded, allParentKeys]);

	const renderTreeNode = useCallback(
		(nodeData: TreeNodeData) => {
			return (
				<div
					className="flex items-center gap-2 py-0.5 cursor-pointer select-none"
					onClick={(e) => {
						// 阻止冒泡，避免触发 Tree 默认的选中/展开行为
						e.stopPropagation();
						handleNodeTitleClick(nodeData);
					}}
				>
					<span className="text-sm">{nodeData.title}</span>
					{nodeData.info && (
						<span className="text-xs text-gray-400">— {nodeData.info}</span>
					)}
				</div>
			);
		},
		[handleNodeTitleClick],
	);

	const open = useCallback(
		(props: TreeSelectorModalOpenProps) => {
			setModalTitle(props.title ?? defaultTitle);
			setSearchText("");

			// 恢复已选状态
			if (props.checkedKeys?.length) {
				setModalCheckedKeys(props.checkedKeys.map((item) => item.value));
			} else {
				setModalCheckedKeys([]);
			}

			setIsOpen(true);

			// 优先使用 api 获取数据，其次使用 treeData
			if (apiRef.current) {
				fetchData(apiRef.current);
			} else {
				const td = props.treeData ?? externalTreeData;
				resetTreeData(td);
			}
		},
		[externalTreeData, defaultTitle, fetchData, resetTreeData],
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
					onChange={(e) => setSearchText(e.target.value)}
					allowClear
					prefix={<IconSearch size={16} className="text-gray-400" />}
					className="mb-4"
					size="large"
				/>

				<div className="gap-5 min-h-0 grid grid-cols-10 max-md:grid-cols-1">
					<div className="col-span-6">
						<Card
							classNames={{ header: "!bg-[var(--ant-color-bg-layout)]" }}
							styles={{
								body: { padding: 12, overflow: "auto", maxHeight: "400px" },
							}}
							title={
								<div className="flex justify-between items-center">
									<div className="flex-center">
										<span className="text-base mr-4">列表选择区域</span>
										<Button
											shape="circle"
											size="small"
											disabled={allParentKeys.length === 0}
											onClick={handleToggleExpandAll}
												
										>
											{isAllExpanded ? (
												<CaretDownOutlined />
											) : (
												<CaretRightOutlined />
											)}
										</Button>
									</div>

									<Button type="link" size="small" onClick={handleSelectAll}>
										{isAllSelected ? "取消全选" : "全选"}
									</Button>
								</div>
							}
						>
							<Spin spinning={loading}>
								{filteredTreeData.length === 0 ? (
									<div className="text-gray-400 text-center py-12">
										{loading ? "加载中..." : "无匹配结果"}
									</div>
								) : (
									<Tree
										checkable
										checkStrictly
										checkedKeys={modalCheckedKeys}
										onCheck={handleTreeCheck as any}
										treeData={filteredTreeData as any}
										expandedKeys={expandedKeys}
										onExpand={(keys) => setExpandedKeys(keys as React.Key[])}
										fieldNames={{
											key: "value",
											title: "title",
											children: "children",
										}}
										titleRender={renderTreeNode as any}
									/>
								)}
							</Spin>
						</Card>
					</div>

					<div className="col-span-4">
						<SelectedPanel
							selectedItems={modalSelected}
							onRemove={removeSelectedItem as (item: SelectedItem) => void}
							onClearAll={handleClearAll}
						/>
					</div>
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

export const TreeSelectorModal = forwardRef(TreeSelectorModalInner) as (
	props: TreeSelectorModalProps & { ref?: React.Ref<TreeSelectorModalRef> },
) => React.ReactElement | null;
