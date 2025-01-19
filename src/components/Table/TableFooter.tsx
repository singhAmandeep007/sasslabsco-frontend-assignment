import { ReactNode } from 'react';

type TableFooterProps = {
  children: ReactNode;
  className?: string;
};

export function TableFooter({ children, className = '' }: TableFooterProps) {
  return (
    <tfoot className={className} role="rowgroup">
      {children}
    </tfoot>
  );
}
