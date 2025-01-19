import { ReactNode } from "react";

import { Data, TableContext } from "./context";

import styles from "./Table.module.css";

type TableProps<T> = {
  data: T[];
  children: ReactNode;
  caption?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

export function Table<T extends Data = Data>({
  data,
  children,
  className = "",
  caption,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: TableProps<T>) {
  return (
    <TableContext.Provider value={{ data }}>
      <table
        className={`${styles.tableContainer} ${className}`}
        role="grid"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <>
          {children}
          {caption && <caption>{caption}</caption>}
        </>
      </table>
    </TableContext.Provider>
  );
}
