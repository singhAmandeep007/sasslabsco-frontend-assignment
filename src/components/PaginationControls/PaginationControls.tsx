import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./PaginationControls.module.css";

export type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
};

export function PaginationControls({
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  goToPage,
  startIndex,
  endIndex,
  totalItems,
}: PaginationControlsProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 4) {
      return [...pages.slice(0, 5), "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", ...pages.slice(totalPages - 5)];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        Showing {startIndex} to {endIndex} of {totalItems} entries
      </div>

      <div className={styles.paginationControls}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={styles.paginationButton}
        >
          <ChevronLeft size={16} />
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => (typeof page === "number" ? goToPage(page) : undefined)}
            disabled={page === "..."}
            className={`${styles.paginationButton} ${currentPage === page ? `${styles.active}` : ""}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={styles.paginationButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
