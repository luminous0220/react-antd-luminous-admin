import React, { useRef, useCallback } from "react";
import { Modal } from "antd";
import type { ModalProps } from "antd";
import Draggable from "react-draggable";

/** 拖拽手柄的 CSS 选择器 */
const DRAG_HANDLE_CLASS = "pro-modal-drag-handle";

interface ProModalProps extends ModalProps {
	draggable?: boolean;
}

export const ProModal: React.FC<ProModalProps> = ({
	draggable = true,
	title,
	modalRender,
	...rest
}) => {
	const draggleRef = useRef<HTMLDivElement>(null!);

	// 拖拽手柄：带有 CSS 类标记，Draggable 通过 handle 选择器限制仅此处可拖拽
	const titleBar =
		draggable && title ? (
			<div
				style={{ width: "100%", cursor: "move" }}
				className={`py-[20px] px-[24px] mb-[24px] border-b border-[var(--ant-color-border)] ${DRAG_HANDLE_CLASS}`}
			>
				{title as React.ReactNode}
			</div>
		) : (
			title
		);

	// 稳定引用：不依赖任何 state，避免 Draggable 随 renderModal 重建而卸载重挂载
	const renderModal = useCallback(
		(modal: React.ReactNode) => {
			const inner = modalRender ? modalRender(modal) : modal;
			if (!draggable) return inner;
			return (
				<Draggable handle={`.${DRAG_HANDLE_CLASS}`} nodeRef={draggleRef}>
					<div ref={draggleRef}>{inner}</div>
				</Draggable>
			);
		},
		[draggable, modalRender],
	);

	return (
		<Modal
			style={{
				top: 20,
			}}
			classNames={{
				container: "!p-0",
				body: "!px-[32px] !pb-[32px]",
				footer: "!p-[28px] !pt-[0]",
			}}
			title={titleBar}
			modalRender={renderModal}
			{...rest}
		/>
	);
};
