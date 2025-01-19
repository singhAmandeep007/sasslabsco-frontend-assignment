import { ReactNode } from 'react';

interface TableHeadProps {
  children: ReactNode;
  className?: string;
  scope?: 'col' | 'row';
}

export function TableHead({
  children,
  className = '',
  scope = 'col',
}: TableHeadProps) {
  return (
    <th className={className} scope={scope} role="columnheader">
      {children}
    </th>
  );
}
