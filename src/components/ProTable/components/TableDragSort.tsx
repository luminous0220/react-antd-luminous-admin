import { useCallback, memo, useContext, createContext, useMemo } from "react";
import { Button, Checkbox } from "antd";
import {
	IconArrowBarToLeft,
	IconArrowBarToRight,
	IconGripVertical,
} from "@tabler/icons-react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	SortableContext,
	useSortable,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
	ProTableColumnConfig,
	ProTableColumnFixed,
	ProTableColumnType,
} from "../types.d";

// ---- 拖拽手柄 Context ----

interface DragHandleContextProps {
	listeners?: SyntheticListenerMap;
	setActivatorNodeRef?: (element: HTMLElement | null) => void;
}

const DragHandleContext = createContext<DragHandleContextProps>({});

const DragHandle: React.FC = () => {
	const { listeners, setActivatorNodeRef } = useContext(DragHandleContext);
	return (
		<span ref={setActivatorNodeRef} {...listeners}>
			<IconGripVertical
				size={14}
				stroke={1.5}
				className="text-[var(--color-text-secondary)] cursor-move transition-colors"
			/>
		</span>
	);
};

// ---- 列项组件 ----

const ColumnItem = memo(function ColumnItem({
	config,
	column,
	isDragging,
	onFixedChange,
	onVisibleChange,
}: {
	config: ProTableColumnConfig;
	column: ProTableColumnType<unknown>;
	isDragging?: boolean;
	onFixedChange: (key: string, fixed: ProTableColumnFixed) => void;
	onVisibleChange: (key: string, show: boolean) => void;
}) {
	const isHideable = column.hideable !== false;
	const isFixable = column.fixable !== false;

	return (
		<div
			className={`select-none flex flex-nowrap items-center justify-between py-0.5 px-2 rounded transition-all duration-150 border border-transparent ${
				isDragging
					? "opacity-40 bg-[var(--color-primary-bg)]"
					: "hover:bg-[var(--color-bg-text-hover)]"
			}`}
		>
			<div className="flex items-center gap-2">
				<DragHandle />
				{isHideable && (
					<Checkbox
						checked={config.show}
						onChange={(e) => {
							e.stopPropagation();
							onVisibleChange(config.key, e.target.checked);
						}}
					>
						<span className="text-sm select-none">
							{typeof column.title === "function"
								? column.title({})
								: column.title}
						</span>
					</Checkbox>
				)}
				{!isHideable && (
					<span className="text-sm select-none">
						{typeof column.title === "function"
							? column.title({})
							: column.title}
					</span>
				)}
			</div>

			{isFixable && (
				<div className="flex gap-1">
					<Button
						type={config.fixed === "left" ? "primary" : "text"}
						size="small"
						icon={<IconArrowBarToLeft size={14} stroke={1.5} />}
						onClick={(e) => {
							e.stopPropagation();
							onFixedChange(
								config.key,
								config.fixed === "left" ? undefined : "left",
							);
						}}
					/>
					<Button
						type={config.fixed === "right" ? "primary" : "text"}
						size="small"
						icon={<IconArrowBarToRight size={14} stroke={1.5} />}
						onClick={(e) => {
							e.stopPropagation();
							onFixedChange(
								config.key,
								config.fixed === "right" ? undefined : "right",
							);
						}}
					/>
				</div>
			)}
		</div>
	);
});

// ---- 可排序的列项容器 ----

interface SortableColumnItemProps {
	config: ProTableColumnConfig;
	column: ProTableColumnType<unknown>;
	onFixedChange: (key: string, fixed: ProTableColumnFixed) => void;
	onVisibleChange: (key: string, show: boolean) => void;
}

const SortableColumnItem = memo(function SortableColumnItem({
	config,
	column,
	onFixedChange,
	onVisibleChange,
}: SortableColumnItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
		isOver,
	} = useSortable({
		id: config.key,
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		transitionDuration: "0.5s",
		...(isDragging
			? {
					position: "relative",
					zIndex: 9999,
					opacity: 0.5,
				}
			: {}),
		...(isOver
			? {
					position: "relative",
					zIndex: 9999,
					background: "var(--ant-color-border-secondary)",
				}
			: {}),
	};

	const contextValue = useMemo<DragHandleContextProps>(
		() => ({ listeners, setActivatorNodeRef }),
		[listeners, setActivatorNodeRef],
	);

	return (
		<DragHandleContext.Provider value={contextValue}>
			<div ref={setNodeRef} style={style} {...attributes}>
				<ColumnItem
					config={config}
					column={column}
					isDragging={isDragging}
					onFixedChange={onFixedChange}
					onVisibleChange={onVisibleChange}
				/>
			</div>
		</DragHandleContext.Provider>
	);
});

// ---- 主组件 ----

interface TableDragSortProps {
	/** 原始列定义，用于获取 title 等信息 */
	columns: ProTableColumnType<unknown>[];
	/** 列配置状态 */
	columnConfigs: ProTableColumnConfig[];
	/** 列配置变化回调 */
	onColumnConfigsChange: (configs: ProTableColumnConfig[]) => void;
}

/** 拖拽排序的列设置组件 */
export const TableDragSort = memo(function TableDragSort({
	columns,
	columnConfigs,
	onColumnConfigsChange,
}: TableDragSortProps) {
	const ids = columnConfigs.map((c) => c.key);

	// 根据 key 查找原始列定义
	const getColumnByKey = useCallback(
		(key: string) => {
			return columns.find((col, idx) => {
				const colKey = col.key ?? (col.dataIndex as string) ?? String(idx);
				return colKey === key;
			});
		},
		[columns],
	);

	// 处理列显示/隐藏
	const handleVisibleChange = useCallback(
		(key: string, show: boolean) => {
			const newConfigs = columnConfigs.map((config) =>
				config.key === key ? { ...config, show } : config,
			);
			onColumnConfigsChange(newConfigs);
		},
		[columnConfigs, onColumnConfigsChange],
	);

	// 处理列固定
	const handleFixedChange = useCallback(
		(key: string, fixed: ProTableColumnFixed) => {
			const newConfigs = columnConfigs.map((config) =>
				config.key === key ? { ...config, fixed } : config,
			);
			onColumnConfigsChange(newConfigs);
		},
		[columnConfigs, onColumnConfigsChange],
	);

	// 处理列拖拽排序
	const handleDragEnd = useCallback(
		({ active, over }: DragEndEvent) => {
			if (!over || active.id === over.id) return;

			const oldIndex = columnConfigs.findIndex(
				(c) => c.key === String(active.id),
			);
			const newIndex = columnConfigs.findIndex(
				(c) => c.key === String(over.id),
			);

			if (oldIndex === -1 || newIndex === -1) return;

			const reordered = arrayMove(columnConfigs, oldIndex, newIndex);
			const updatedConfigs = reordered.map((config, idx) => ({
				...config,
				order: idx,
			}));

			onColumnConfigsChange(updatedConfigs);
		},
		[columnConfigs, onColumnConfigsChange],
	);

	return (
		<div className="min-h-6 max-h-60 pb-6 overflow-x-hidden">
			<DndContext
				modifiers={[restrictToVerticalAxis]}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={ids} strategy={verticalListSortingStrategy}>
					{columnConfigs.map((config) => {
						const column = getColumnByKey(config.key);
						if (!column) return null;
						return (
							<SortableColumnItem
								key={config.key}
								config={config}
								column={column}
								onFixedChange={handleFixedChange}
								onVisibleChange={handleVisibleChange}
							/>
						);
					})}
				</SortableContext>
			</DndContext>
		</div>
	);
});
