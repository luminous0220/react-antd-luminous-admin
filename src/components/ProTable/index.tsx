import { memo, forwardRef } from "react";
import type { ProTableProps, ProTableRef } from "./types.d";
import { ProTableInner } from "./components/ProTableInner";

/**
 * ProTable 增强表格组件（forwardRef + memo）
 * 通过 ref 可调用 refresh() / getDataSource() / reset() 等
 */
export const ProTable = memo(forwardRef(ProTableInner)) as <T extends object>(
	props: ProTableProps<T> & { ref?: React.Ref<ProTableRef<T>> },
) => React.ReactElement | null;

export type { ProTableRef };

export * from "./types.d";
export * from "./CopyableCell";
