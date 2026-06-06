import { useGlobalStore } from "@/stores";

export * from "./storage";
export * from "./request";
export * from "./iconMap";
export * from "./assetUrl";


/**
 * @description 递归函数来遍历树形数组，并将 children 字段长度为 0 的节点的 children 设置为 undefined（或直接删除该字段）
 */
export function cleanEmptyChildren<T extends { children?: T[] }>(
	tree: T[],
): T[] {
	return tree.map((node) => {
		const { children, ...rest } = node;
		if (Array.isArray(children) && children.length > 0) {
			return {
				...rest,
				children: cleanEmptyChildren(children),
			} as T; // 安全断言：此时 children 存在且非空，符合 T 结构
		}
		// 当 children 为空或不存在时，rest 不含 children，但仍需满足 T（其中 children 是可选的）
		// 因为 T 的 children 本身就是可选的（T extends { children?: T[] }），所以 rest 符合 T
		return rest as T;
	});
}

/**
 * @description 递归排序树形数据
 * @param data 树形数据数组
 * @param sortKey 排序字段名，默认 'sort'
 * @param childrenKey 子节点字段名，默认 'subs'
 * @returns 排序后的树形数据
 */
export const sortTree = <T extends Record<string, any>>(
	data: T[],
	sortKey: keyof T = "sort",
	childrenKey: keyof T = "children",
): T[] => {
	return data
		.sort((a, b) => (a[sortKey] ?? 0) - (b[sortKey] ?? 0))
		.map((item) => ({
			...item,
			[childrenKey]: item[childrenKey]?.length
				? sortTree(item[childrenKey] as T[], sortKey, childrenKey)
				: undefined,
		}));
};

/**
 * @description 平铺数组转树形结构
 * @param list 平铺的数组数据
 * @param idKey 唯一标识字段名（如 'id'）
 * @param parentKey 父级字段名（如 'parentId'）
 * @param transformFn 字段映射关系函数
 * @returns 树形结构数组
 */
export const flattenToTree = <T extends Record<string, any>, R = any>(params: {
	list: T[];
	key: keyof T;
	parentKey: keyof T;
	transformFn?: (item: T) => R;
}): any[] => {
	const { list, key, parentKey, transformFn } = params;
	// 构建 Map，用于快速查找节点
	const nodeMap = new Map<T[keyof T], any>();

	// 初始化每个节点并放入 Map 中
	list.forEach((item) => {
		const nodeId = item[key];
		let node: any;

		if (transformFn) {
			// 使用 transformFn 处理项目
			node = transformFn(item);
		} else {
			// 保留所有字段
			node = { ...item };
		}

		node.children = []; // 初始化 children 为空数组
		nodeMap.set(nodeId, node);
	});

	// 构建树形结构
	const tree: Array<any> = [];
	list.forEach((item) => {
		const nodeId = item[key];
		const node = nodeMap.get(nodeId)!;
		if (item[parentKey] === 0 || item[parentKey] === null) {
			// 根节点直接加入树中
			tree.push(node);
		} else {
			// 非根节点挂载到父节点的 children 中
			const parentId = item[parentKey];
			const parent = nodeMap.get(parentId);
			if (parent) {
				parent.children.push(node);
			}
			// 如果父节点不存在则直接加入树中
			else {
				tree.push(node);
			}
		}
	});

	// 将叶子节点的 children 设置为 null
	const processNode = (node: any) => {
		if (node.children && node.children.length === 0) {
			node.children = null;
		} else if (node.children && node.children.length > 0) {
			node.children.forEach(processNode);
		}
	};

	tree.forEach(processNode);

	return tree;
};

/**
 * @description 去除img标签
 */
export function removeImgTag(text: string) {
	return text.replace(/<img[^>]*>/g, "").replace(/&nbsp;|&\#160;/g, "");
}

/**
 * @description 监听屏幕分辨率变化
 * @description 屏幕断点遵循tailwindcss breakpoint方式
 */
export const initResize = () => {
	// 下面的断点按照tailwindcss的配置，md：768px，lg：1024px，xl：1280px
	let resizeTimer: number | null = null;

	const resize = () => {
		// 使用防抖避免频繁更新
		if (resizeTimer !== null) {
			clearTimeout(resizeTimer);
		}

		resizeTimer = window.setTimeout(() => {
			const docEI = document.documentElement;
			const clientWidth = docEI.clientWidth;
			const rootValue = 16;
			const setState = useGlobalStore.setState;

			let baseWidth = 1920;
			// PC
			if (clientWidth > 1280) {
				docEI.style.fontSize = rootValue + "px";
				setState({ isMobile: false });
				return;
			}
			// PC
			else if (clientWidth <= 1280 && clientWidth >= 1024) {
				docEI.style.fontSize = rootValue * (clientWidth / baseWidth) + "px";
				setState({ isMobile: false });
				return;
			}

			// PAD
			if (clientWidth <= 1024 && clientWidth >= 768) baseWidth = 1000;
			// MOBILE
			else if (clientWidth < 768) baseWidth = 425;

			docEI.style.fontSize = rootValue * (clientWidth / baseWidth) + "px";
			setState({ isMobile: true });

			resizeTimer = null;
		}, 150);
	};

	resize();

	window.addEventListener("resize", resize);
};
