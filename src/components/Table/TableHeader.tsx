import { ReactNode } from "react";

type TableHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead
      className={className}
      role="rowgroup"
    >
      {children}
    </thead>
  );
}
