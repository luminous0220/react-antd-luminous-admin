import { IconCopy } from "@tabler/icons-react";
import { Button } from "antd";
import React, { useCallback } from "react";

export const CopyableCell: React.FC<{
	text: string;
	children?: React.ReactNode;
	className?: string;
}> = React.memo(({ text, children, className = "" }) => {
	const handleCopy = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			try {
				await navigator.clipboard.writeText(String(text));
				window.$message?.success?.("复制成功");
			} catch {
				window.$message?.error?.("复制失败");
			}
		},
		[text],
	);

	return (
		<div
			className={`flex items-center justify-between gap-1 group/row ${className}`}
		>
			{children || <span className="truncate">{text}</span>}
			<Button
				type="text"
				size="small"
				className="opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0"
				icon={<IconCopy size={14} stroke={1.5} />}
				onClick={handleCopy}
			/>
		</div>
	);
});
