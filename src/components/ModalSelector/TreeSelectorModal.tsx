import { useState, useCallback, useMemo, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
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
} from "./utils";

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
	const fetchData = useCallback(
		async (api: TreeSelectorApi) => {
			setLoading(true);
			try {
				const result = await api();
				if (result && Array.isArray(result)) {
					setTreeData(result);
				}
			} finally {
				setLoading(false);
			}
		},
		[],
	);

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

	const handleTreeCheck = useCallback(
		(checkedKeys: any, info: any) => {
			const { node, checked } = info;
			const key = node.key;
			const currentKeys: React.Key[] = Array.isArray(checkedKeys)
				? checkedKeys
				: (checkedKeys as { checked: React.Key[] }).checked ?? [];
			let newKeys = [...currentKeys];

			if (checked) {
				const descendantKeys = getDescendantKeys(treeData, key);
				for (const dk of descendantKeys) {
					if (!newKeys.includes(dk)) newKeys.push(dk);
				}
				const parent = findParentNode(treeData, key);
				if (parent) {
					const allSiblingsChecked = parent.children!.every(
						(child: TreeNodeData) => newKeys.includes(child.value),
					);
					if (allSiblingsChecked && !newKeys.includes(parent.value)) {
						newKeys.push(parent.value);
					}
				}
			} else {
				const nodeData = findNode(treeData, key);
				if (nodeData?.children?.length) {
					const descendantKeys = getDescendantKeys(treeData, key);
					newKeys = newKeys.filter((k) => !descendantKeys.includes(k));
				} else {
					const parent = findParentNode(treeData, key);
					if (parent) {
						newKeys = newKeys.filter((k) => k !== parent.value);
					}
				}
			}
			setModalCheckedKeys(newKeys);
		},
		[treeData],
	);

	const handleClearAll = useCallback(() => setModalCheckedKeys([]), []);

	const removeSelectedItem = useCallback(
		(item: TreeSelectorNode) => {
			let newKeys = modalCheckedKeys.filter((k) => k !== item.value);
			const nodeData = findNode(treeData, item.value);
			if (nodeData?.children?.length) {
				const descendantKeys = getDescendantKeys(treeData, item.value);
				newKeys = newKeys.filter((k) => !descendantKeys.includes(k));
			}
			if (item.type === "child" && item.pid) {
				newKeys = newKeys.filter((k) => k !== item.pid);
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
			allTreeKeys.length > 0 && allTreeKeys.every((k) => modalCheckedKeys.includes(k)),
		[allTreeKeys, modalCheckedKeys],
	);

	const handleSelectAll = useCallback(() => {
		if (isAllSelected) setModalCheckedKeys([]);
		else setModalCheckedKeys([...allTreeKeys]);
	}, [isAllSelected, allTreeKeys]);

	const renderTreeNode = useCallback((nodeData: TreeNodeData) => {
		return (
			<div className="flex items-center gap-2 py-0.5">
				<span className="text-sm">{nodeData.title}</span>
				{nodeData.info && (
					<span className="text-xs text-gray-400">— {nodeData.info}</span>
				)}
			</div>
		);
	}, []);

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
										fieldNames={{ key: "value", title: "title", children: "children" }}
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
