import { ReactNode } from 'react';

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={className} role="rowgroup">
      {children}
    </tbody>
  );
}
