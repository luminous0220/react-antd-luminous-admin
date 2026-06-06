import { useState, useCallback, useMemo, useEffect } from "react";
import { Tree, Input, Button, Card } from "antd";
import { IconSearch } from "@tabler/icons-react";
import { ProModal } from "@/components/ProModal";
import { SelectorTrigger } from "./SelectorTrigger";
import { SelectedPanel, type SelectedItem } from "./SelectedPanel";
import { SelectorFooter } from "./SelectorFooter";
import type { TreeNodeData, TreeSelectorNode, TreeSelectorProps } from "./type";

export type { TreeNodeData, TreeSelectorNode, TreeSelectorProps } from "./type";

// ---- 树操作工具函数 ----

/** 递归获取某节点的所有子孙 key */
function getDescendantKeys(
	treeData: TreeNodeData[],
	targetValue: React.Key,
): React.Key[] {
	const keys: React.Key[] = [];
	const walk = (nodes: TreeNodeData[]) => {
		for (const node of nodes) {
			if (node.value === targetValue) {
				collectAll(node, keys);
				return;
			}
			if (node.children?.length) walk(node.children);
		}
	};
	walk(treeData);
	return keys;
}

function collectAll(node: TreeNodeData, keys: React.Key[]) {
	keys.push(node.value);
	if (node.children?.length) {
		for (const child of node.children) collectAll(child, keys);
	}
}

/** 查找节点 */
function findNode(
	treeData: TreeNodeData[],
	value: React.Key,
): TreeNodeData | null {
	for (const node of treeData) {
		if (node.value === value) return node;
		if (node.children?.length) {
			const found = findNode(node.children, value);
			if (found) return found;
		}
	}
	return null;
}

/** 查找父节点 */
function findParentNode(
	treeData: TreeNodeData[],
	childValue: React.Key,
): TreeNodeData | null {
	for (const node of treeData) {
		if (node.children?.length) {
			for (const child of node.children) {
				if (child.value === childValue) return node;
			}
			const found = findParentNode(node.children, childValue);
			if (found) return found;
		}
	}
	return null;
}

/** 搜索过滤树数据，保留匹配节点及其祖先 */
function filterTree(nodes: TreeNodeData[], keyword: string): TreeNodeData[] {
	if (!keyword.trim()) return nodes;

	const kw = keyword.toLowerCase();

	const filter = (list: TreeNodeData[]): TreeNodeData[] => {
		const result: TreeNodeData[] = [];
		for (const node of list) {
			const titleMatch = node.title.toLowerCase().includes(kw);
			const filteredChildren = node.children?.length
				? filter(node.children)
				: undefined;

			if (titleMatch || (filteredChildren && filteredChildren.length > 0)) {
				result.push({
					...node,
					children: filteredChildren ?? node.children,
				});
			}
		}
		return result;
	};

	return filter(nodes);
}

/** 收集匹配关键字节点的所有祖先 key（用于自动展开） */
function getMatchedAncestorKeys(
	nodes: TreeNodeData[],
	keyword: string,
): React.Key[] {
	if (!keyword.trim()) return [];
	const keys: React.Key[] = [];
	const kw = keyword.toLowerCase();

	const walk = (list: TreeNodeData[], ancestors: React.Key[]) => {
		for (const node of list) {
			const titleMatch = node.title.toLowerCase().includes(kw);
			const hasChildren = node.children?.length;

			if (titleMatch || hasChildren) {
				if (titleMatch) {
					// 展开所有祖先
					for (const k of ancestors) {
						if (!keys.includes(k)) keys.push(k);
					}
				}
				if (hasChildren && node.children) {
					walk(node.children, [...ancestors, node.value]);
				}
			}
		}
	};

	walk(nodes, []);
	return keys;
}

/** 根据 checkedKeys 构建已选列表 */
function buildSelectedFromKeys(
	checkedKeys: React.Key[],
	treeData: TreeNodeData[],
): TreeSelectorNode[] {
	const result: TreeSelectorNode[] = [];
	for (const key of checkedKeys) {
		const node = findNode(treeData, key);
		if (node) {
			const parent = findParentNode(treeData, key);
			result.push({
				value: node.value,
				title: node.title,
				desc: node.desc,
				type: parent ? "child" : "parent",
				pid: parent?.value,
			});
		}
	}
	return result;
}

/**
 * @description TreeSelector 树形多选选择器
 * 展示区域为输入框样式，点击打开 ProModal 弹窗，
 * 左侧 Tree 多选，右侧已选清单可删除
 */
export const TreeSelector: React.FC<TreeSelectorProps> = ({
	title: modalTitle = "选择经营区域",
	checkedKeys: controlledCheckedKeys = [],
	onChange,
	treeData = [],
	placeholder = "请选择",
	disabled = false,
	width = 820,
}) => {
	// 弹窗状态
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [modalCheckedKeys, setModalCheckedKeys] = useState<React.Key[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

	// 弹窗内已选数据（从 modalCheckedKeys 派生）
	const modalSelected = useMemo<TreeSelectorNode[]>(
		() => buildSelectedFromKeys(modalCheckedKeys, treeData),
		[modalCheckedKeys, treeData],
	);

	// 过滤后的树数据
	const filteredTreeData = useMemo<TreeNodeData[]>(
		() => filterTree(treeData, searchText),
		[treeData, searchText],
	);

	// 搜索时自动展开匹配节点父级
	useEffect(() => {
		if (searchText.trim()) {
			const ancestorKeys = getMatchedAncestorKeys(treeData, searchText);
			setExpandedKeys((prev) => {
				const merged = new Set([...prev, ...ancestorKeys]);
				return Array.from(merged);
			});
		}
	}, [searchText, treeData]);

	// 打开弹窗
	const handleOpen = useCallback(() => {
		if (disabled) return;
		const keys = controlledCheckedKeys.map((item) => item.value);
		setModalCheckedKeys(keys);
		setSearchText("");
		setExpandedKeys([]);
		setIsOpen(true);
	}, [disabled, controlledCheckedKeys]);

	// 取消
	const handleCancel = useCallback(() => {
		setIsOpen(false);
		setSearchText("");
	}, []);

	// 确认
	const handleConfirm = useCallback(() => {
		const selected = buildSelectedFromKeys(modalCheckedKeys, treeData);
		onChange?.(selected);
		setIsOpen(false);
		setSearchText("");
	}, [modalCheckedKeys, treeData, onChange]);

	// 树节点选中变化（父子联动）
	const handleTreeCheck = useCallback(
		(checkedKeys: any, desc: any) => {
			const { node, checked } = desc;
			const key = node.key;
			// checkedKeys 可能是 Key[] 或 { checked: Key[], halfChecked: Key[] }
			const currentKeys: React.Key[] = Array.isArray(checkedKeys)
				? checkedKeys
				: ((checkedKeys as { checked: React.Key[] }).checked ?? []);
			let newKeys = [...currentKeys];

			if (checked) {
				// 勾选：如果是父节点，自动勾选所有子节点
				const descendantKeys = getDescendantKeys(treeData, key);
				for (const dk of descendantKeys) {
					if (!newKeys.includes(dk)) newKeys.push(dk);
				}
				// 如果所有子节点都选中，自动勾选父节点
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
				// 取消勾选
				const nodeData = findNode(treeData, key);
				if (nodeData?.children?.length) {
					// 父节点取消 → 取消所有子节点
					const descendantKeys = getDescendantKeys(treeData, key);
					newKeys = newKeys.filter((k) => !descendantKeys.includes(k));
				} else {
					// 子节点取消 → 同时取消父节点
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

	// 清空所有选择
	const handleClearAll = useCallback(() => {
		setModalCheckedKeys([]);
	}, []);

	// 右侧已选列表单项删除
	const removeSelectedItem = useCallback(
		(item: TreeSelectorNode) => {
			let newKeys = modalCheckedKeys.filter((k) => k !== item.value);
			// 如果删除的是父节点，同时删除所有子节点
			const nodeData = findNode(treeData, item.value);
			if (nodeData?.children?.length) {
				const descendantKeys = getDescendantKeys(treeData, item.value);
				newKeys = newKeys.filter((k) => !descendantKeys.includes(k));
			}
			// 如果删除的是子节点，同时删除父节点
			if (item.type === "child" && item.pid) {
				newKeys = newKeys.filter((k) => k !== item.pid);
			}
			setModalCheckedKeys(newKeys);
		},
		[modalCheckedKeys, treeData],
	);

	// 触发器 Tag 快捷删除
	const removeTag = useCallback(
		(item: TreeSelectorNode) => {
			let newSelected = controlledCheckedKeys.filter(
				(s) => s.value !== item.value,
			);
			// 同步联动逻辑
			const nodeData = findNode(treeData, item.value);
			if (nodeData?.children?.length) {
				const descendantKeys = getDescendantKeys(treeData, item.value);
				newSelected = newSelected.filter(
					(s) => !descendantKeys.includes(s.value),
				);
			}
			if (item.type === "child" && item.pid) {
				newSelected = newSelected.filter((s) => s.value !== item.pid);
			}
			onChange?.(newSelected);
		},
		[controlledCheckedKeys, treeData, onChange],
	);

	// 全选/取消全选
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
		if (isAllSelected) {
			setModalCheckedKeys([]);
		} else {
			setModalCheckedKeys([...allTreeKeys]);
		}
	}, [isAllSelected, allTreeKeys]);

	// 树节点自定义渲染
	const renderTreeNode = useCallback((nodeData: TreeNodeData) => {
		return (
			<div className="flex items-center gap-2 py-0.5">
				<span className="text-sm">{nodeData.title}</span>
				{nodeData.desc && (
					<span className="text-xs text-gray-400">— {nodeData.desc}</span>
				)}
			</div>
		);
	}, []);

	return (
		<>
			{/* 触发器 */}
			<SelectorTrigger
				selectedItems={controlledCheckedKeys}
				placeholder={placeholder}
				disabled={disabled}
				onOpen={handleOpen}
				onRemoveTag={removeTag}
			/>

			{/* 弹窗 */}
			<ProModal
				open={isOpen}
				onCancel={handleCancel}
				title={modalTitle}
				width={width}
				footer={null}
				destroyOnHidden
			>
				<div className="flex flex-col">
					{/* 搜索框 */}
					<Input
						placeholder="请输入关键词"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
						prefix={<IconSearch size={16} className="text-gray-400" />}
						className="mb-4"
						size="large"
					/>

					{/* 左右布局 */}
					<div className="gap-5 min-h-0 grid grid-cols-2 max-md:grid-cols-1">
						{/* 左侧树 */}
						<Card
							classNames={{
								header: "!bg-[var(--ant-color-bg-layout)]",
							}}
							styles={{
								body: {
									padding: 12,
									overflow: "auto",
									maxHeight: "400px",
								},
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
							{filteredTreeData.length === 0 ? (
								<div className="text-gray-400 text-center py-12">
									无匹配结果
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
						</Card>

						{/* 右侧已选列表 */}
						<SelectedPanel
							selectedItems={modalSelected}
							onRemove={removeSelectedItem as (item: SelectedItem) => void}
							onClearAll={handleClearAll}
						/>
					</div>

					{/* 底部操作栏 */}
					<SelectorFooter
						selectedCount={modalSelected.length}
						onCancel={handleCancel}
						onConfirm={handleConfirm}
					/>
				</div>
			</ProModal>
		</>
	);
};
