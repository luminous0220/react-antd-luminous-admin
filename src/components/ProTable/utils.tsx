import Text from "antd/es/typography/Text";
import type {
	ProTableColumnType,
	ProTableColumnConfig,
	ProTableColumnFixed,
} from "./types.d";

/** 默认分页大小 */
export const DEFAULT_PAGE_SIZE = 20;

/** 分页大小选项 */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 70, 100];

/** 获取列的唯一 key */
export function getColumnKey(
	column: ProTableColumnType<any>,
	index: number,
): string {
	if (column.key) return column.key;
	if (column.dataIndex) return String(column.dataIndex);
	return `column-${index}`;
}

/** 初始化列配置 */
export function initColumnConfigs(
	columns: ProTableColumnType<any>[],
): ProTableColumnConfig[] {
	return columns.map((col, index) => ({
		key: getColumnKey(col, index),
		show: col.show !== false,
		fixed: col.fixed,
		order: index,
	}));
}

/** 根据配置过滤并排序列 */
export function getOrderedColumns<T>(
	columns: ProTableColumnType<T>[],
	configs: ProTableColumnConfig[],
): ProTableColumnType<T>[] {
	// 按 order 排序
	const sortedConfigs = [...configs].sort((a, b) => a.order - b.order);

	return sortedConfigs
		.filter((config) => config.show)
		.map((config) => {
			const column = columns.find(
				(col, index) => getColumnKey(col, index) === config.key,
			);
			if (!column) return null;

			// 应用固定配置
			return {
				...column,
				fixed: config.fixed,
			};
		})
		.filter(Boolean) as ProTableColumnType<T>[];
}

/** 更新列配置（显示/隐藏） */
export function updateColumnVisibility(
	configs: ProTableColumnConfig[],
	key: string,
	show: boolean,
): ProTableColumnConfig[] {
	return configs.map((config) =>
		config.key === key ? { ...config, show } : config,
	);
}

/** 更新列配置（固定） */
export function updateColumnFixed(
	configs: ProTableColumnConfig[],
	key: string,
	fixed: ProTableColumnFixed,
): ProTableColumnConfig[] {
	return configs.map((config) =>
		config.key === key ? { ...config, fixed } : config,
	);
}

/** 更新列配置（排序） */
export function updateColumnOrder(
	configs: ProTableColumnConfig[],
	oldIndex: number,
	newIndex: number,
): ProTableColumnConfig[] {
	const result = [...configs];
	const [removed] = result.splice(oldIndex, 1);
	result.splice(newIndex, 0, removed);

	// 更新所有列的 order
	return result.map((config, index) => ({ ...config, order: index }));
}

/** 创建序号列 */
export function createIndexColumn<T>(
	pageNumber: number,
	pageSize: number,
	width: number,
): ProTableColumnType<T> {
	return {
		key: "__index__",
		title: "序号",
		width, // 👈 减小到 50，更紧凑
		align: "center", // 明确对齐
		hideable: false,
		fixable: false,
		fixed: "left",
		render: (_, __, index) => {
			const idx = (pageNumber - 1) * pageSize + index + 1;
			return (
				<div className="flex-center">
					<Text className="flex-center min-w-5 min-h-5 rounded-[100%] bg-[var(--ant-color-primary-hover)] !text-white !text-[11px]">
						{idx}
					</Text>
				</div>
			);
		},
	};
}

/** 计算表格高度（用于自适应滚动） */
export function calcTableHeight(
	containerHeight: number,
	toolbarHeight: number,
	selectInfoHeight: number,
	headerHeight: number,
	paginationHeight: number,
): number {
	return (
		containerHeight -
		toolbarHeight -
		selectInfoHeight -
		headerHeight -
		paginationHeight
	);
}
