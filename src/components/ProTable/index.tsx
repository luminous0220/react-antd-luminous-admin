import { memo, forwardRef } from "react";
import type { ProTableProps, ProTableInstance } from "./types";
import { ProTableInner } from "./components/ProTableInner";

/**
 * ProTable 增强表格组件（forwardRef + memo）
 * 通过 ref 可调用 refresh() / getDataSource() / reset() 等
 */
export const ProTable = memo(forwardRef(ProTableInner)) as <T extends object>(
	props: ProTableProps<T> & { ref?: React.Ref<ProTableInstance<T>> },
) => React.ReactElement | null;

export type { ProTableInstance };

export * from "./types";
export * from "./CopyableCell";
