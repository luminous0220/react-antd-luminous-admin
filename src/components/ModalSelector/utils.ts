import type { TreeNodeData, TreeSelectorNode } from "./types";




/** 递归获取某节点的所有子孙 key */
export function getDescendantKeys(
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

export function collectAll(node: TreeNodeData, keys: React.Key[]) {
	keys.push(node.value);
	if (node.children?.length) {
		for (const child of node.children) collectAll(child, keys);
	}
}

/** 查找节点 */
export function findNode(
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
export function findParentNode(
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
export function filterTree(nodes: TreeNodeData[], keyword: string): TreeNodeData[] {
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
export function getMatchedAncestorKeys(
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
export function buildSelectedFromKeys(
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
