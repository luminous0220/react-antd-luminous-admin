import { useState, useRef, useCallback } from "react";
import { Card, Typography, Tag, Divider, Switch, Space } from "antd";
import { HolderOutlined, MenuOutlined } from "@ant-design/icons";

const INITIAL_ITEMS = [
	{ id: "1", title: "需求评审会议纪要", tag: "紧急", color: "red" },
	{ id: "2", title: "产品设计规范 v2.0", tag: "设计", color: "blue" },
	{ id: "3", title: "用户增长报告 Q1", tag: "数据", color: "green" },
	{ id: "4", title: "技术方案评审", tag: "技术", color: "purple" },
	{ id: "5", title: "运营活动策划案", tag: "运营", color: "orange" },
	{ id: "6", title: "季度复盘总结", tag: "管理", color: "cyan" },
];

const DRAG_COLORS = ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1"];
const DEFAULT_POSITIONS = DRAG_COLORS.map((_, i) => ({
	x: 20 + i * 55,
	y: 20 + (i % 2) * 100,
}));

const DragPage: React.FC = () => {
	// ---- 排序列表 (HTML5 Drag & Drop) ----
	const [items, setItems] = useState(INITIAL_ITEMS);
	const [dragIndex, setDragIndex] = useState<number | null>(null);

	const handleDragStart = (index: number) => setDragIndex(index);

	const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
		e.preventDefault();
		if (dragIndex === null || dragIndex === targetIndex) return;
		const newItems = [...items];
		const [dragged] = newItems.splice(dragIndex, 1);
		newItems.splice(targetIndex, 0, dragged);
		setItems(newItems);
		setDragIndex(targetIndex);
	};

	const handleDragEnd = () => setDragIndex(null);

	// ---- 自由拖拽 (原生事件，无需 react-draggable) ----
	const [positions, setPositions] = useState(DEFAULT_POSITIONS);
	const [boundsEnabled, setBoundsEnabled] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const dragStateRef = useRef<{
		index: number;
		startX: number;
		startY: number;
		posX: number;
		posY: number;
	} | null>(null);

	const getPointerPos = useCallback(
		(e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
			if ("touches" in e) {
				return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
			}
			return { clientX: e.clientX, clientY: e.clientY };
		},
		[],
	);

	const handlePointerDown = useCallback(
		(index: number) => (e: React.MouseEvent | React.TouchEvent) => {
			e.preventDefault();
			const pos = positions[index];
			const pt = getPointerPos(e.nativeEvent as MouseEvent | TouchEvent);
			dragStateRef.current = {
				index,
				startX: pt.clientX,
				startY: pt.clientY,
				posX: pos.x,
				posY: pos.y,
			};

			const onMove = (ev: MouseEvent | TouchEvent) => {
				if (!dragStateRef.current) return;
				const s = dragStateRef.current;
				const mp = getPointerPos(ev);
				let newX = s.posX + mp.clientX - s.startX;
				let newY = s.posY + mp.clientY - s.startY;

				if (boundsEnabled && containerRef.current) {
					const rect = containerRef.current.getBoundingClientRect();
					const box = 96; // w-24 = 96px
					newX = Math.max(0, Math.min(newX, rect.width - box));
					newY = Math.max(0, Math.min(newY, rect.height - box));
				}

				setPositions((prev) => {
					const next = [...prev];
					next[s.index] = { x: newX, y: newY };
					return next;
				});
			};

			const onUp = () => {
				dragStateRef.current = null;
				document.removeEventListener("mousemove", onMove);
				document.removeEventListener("mouseup", onUp);
				document.removeEventListener("touchmove", onMove);
				document.removeEventListener("touchend", onUp);
			};

			document.addEventListener("mousemove", onMove);
			document.addEventListener("mouseup", onUp);
			document.addEventListener("touchmove", onMove, { passive: false });
			document.addEventListener("touchend", onUp);
		},
		[positions, boundsEnabled, getPointerPos],
	);

	const handleReset = () => setPositions(DEFAULT_POSITIONS);

	return (
		<div className="min-h-full p-6 space-y-6">
			<div>
				<Typography.Title level={4} className="!mb-1">
					拖拽 Drag
				</Typography.Title>
				<Typography.Text type="secondary">
					使用 HTML5 Drag & Drop 实现列表排序 + 原生事件实现自由拖拽
				</Typography.Text>
			</div>

			{/* ===== 列表排序 ===== */}
			<Typography.Title level={5}>列表排序</Typography.Title>
			<Card size="small" className="mb-2">
				<Typography.Text type="secondary" className="text-sm">
					拖拽进行重新排序
				</Typography.Text>
			</Card>
			<div className="space-y-2">
				{items.map((item, index) => (
					<div
						key={item.id}
						draggable
						onDragStart={() => handleDragStart(index)}
						onDragOver={(e) => handleDragOver(e, index)}
						onDragEnd={handleDragEnd}
						className={`rounded-lg border border-gray-200 dark:border-gray-700
							bg-white dark:bg-gray-900 p-4 flex items-center gap-4
							cursor-grab active:cursor-grabbing transition-all duration-200
							${
								dragIndex === index
									? "opacity-50 scale-[1.02] shadow-lg ring-2 ring-blue-400"
									: "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700"
							}`}
					>
						<HolderOutlined className="text-lg text-gray-400 flex-shrink-0" />
						<span className="text-gray-300 dark:text-gray-600 font-mono text-sm flex-shrink-0">
							{index + 1}
						</span>
						<Typography.Text className="flex-1">{item.title}</Typography.Text>
						<Tag color={item.color}>{item.tag}</Tag>
					</div>
				))}
			</div>

			<Divider />

			{/* ===== 自由拖拽 ===== */}
			<div className="flex items-center justify-between">
				<Typography.Title level={5}>自由拖拽</Typography.Title>
				<Space>
					<span className="text-sm text-gray-500">
						限制边界: {boundsEnabled ? "开" : "关"}
					</span>
					<Switch
						size="small"
						checked={boundsEnabled}
						onChange={setBoundsEnabled}
					/>
					<Tag
						className="cursor-pointer select-none"
						onClick={handleReset}
						color="default"
					>
						重置位置
					</Tag>
				</Space>
			</div>
			<Card size="small">
				<Typography.Text type="secondary" className="text-sm">
					在虚线区域内自由拖拽彩色方块
				</Typography.Text>
			</Card>
			<div
				ref={containerRef}
				className="relative border-2 border-dashed border-gray-300 dark:border-gray-600
					rounded-xl min-h-[320px] bg-gray-50 dark:bg-gray-950 overflow-hidden"
			>
				{DRAG_COLORS.map((color, i) => (
					<div
						key={i}
						className="absolute w-24 h-24 rounded-xl flex items-center justify-center
							shadow-lg cursor-grab active:cursor-grabbing active:shadow-xl
							select-none transition-shadow duration-150 touch-none"
						style={{
							background: `linear-gradient(135deg, ${color}, ${color}dd)`,
							transform: `translate(${positions[i].x}px, ${positions[i].y}px)`,
							zIndex: 10 + i,
						}}
						onMouseDown={handlePointerDown(i)}
						onTouchStart={handlePointerDown(i)}
					>
						<div className="text-center">
							<MenuOutlined className="text-white/80 text-lg mb-1 block" />
							<span className="text-white font-bold text-sm">{i + 1}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default DragPage;
