import { createContext, useContext } from "react";

export type Data = Record<string, unknown>;

export type TableContextType<T extends Data = Data> = {
  data: T[];
};

export const TableContext = createContext<TableContextType | undefined>(undefined);

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Table components must be used within a Table component");
  }
  return context;
}
