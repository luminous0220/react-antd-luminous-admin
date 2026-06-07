import { useContext, createContext, useMemo } from "react";
import { Button } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface RowContextProps {
	setActivatorNodeRef?: (element: HTMLElement | null) => void;
	listeners?: SyntheticListenerMap;
}

const RowContext = createContext<RowContextProps>({});



interface RowContextProps {
	setActivatorNodeRef?: (element: HTMLElement | null) => void;
	listeners?: SyntheticListenerMap;
}

const RowContext = createContext<RowContextProps>({});

export const DragHandle: React.FC = () => {
	const { setActivatorNodeRef, listeners } = useContext(RowContext);
	return (
		<Button
			type="text"
			size="small"
			icon={<HolderOutlined />}
			style={{ cursor: "move" }}
			ref={setActivatorNodeRef}
			{...listeners}
		/>
	);
};

interface SortableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	"data-row-key": string;
}

export const SortableRow: React.FC<SortableRowProps> = (props) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: props["data-row-key"],
		animateLayoutChanges: () => false, // 👈 关键：必须是函数返回 false
	});

	const style: React.CSSProperties = {
		...props.style,
		transform: CSS.Transform.toString(transform),
		transition,
		...(isDragging
			? {
					position: "relative",
					zIndex: 9999,
					opacity: 0.2,
					background: "var(--ant-color-bg-container)",
				}
			: {}),
	};

	const contextValue = useMemo<RowContextProps>(
		() => ({ setActivatorNodeRef, listeners }),
		[setActivatorNodeRef, listeners],
	);

	return (
		<RowContext.Provider value={contextValue}>
			<tr {...props} ref={setNodeRef} style={style} {...attributes} />
		</RowContext.Provider>
	);
};

