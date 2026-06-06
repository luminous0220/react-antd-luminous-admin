export interface AnimateTransitionProps {
	/** 是否显示 */
	visible: boolean;
	/** 子内容 */
	children: ReactNode;
	/** 入场动画类名 */
	enter?: string;
	/** 退场动画类名 */
	leave?: string;
	/** 动画时长（毫秒） */
	duration?: number;
	/** 自定义class */
	className?: string;
	/** 退场后是否卸载DOM（默认true） */
	unmountOnExit?: boolean;
}
