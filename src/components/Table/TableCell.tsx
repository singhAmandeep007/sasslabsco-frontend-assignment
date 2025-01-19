import { ReactNode } from 'react';

interface TableCellProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function TableCell({
  children,
  className = '',
  'aria-label': ariaLabel,
}: TableCellProps) {
  return (
    <td className={className} role="gridcell" aria-label={ariaLabel}>
      {children}
    </td>
  );
}
