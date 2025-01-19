import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { PaginationControls } from "./PaginationControls";

describe("PaginationControls", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    nextPage: vi.fn(),
    prevPage: vi.fn(),
    goToPage: vi.fn(),
    startIndex: 1,
    endIndex: 10,
    totalItems: 100,
  };

  test("renders basic pagination information correctly", () => {
    render(<PaginationControls {...defaultProps} />);

    expect(screen.getByText("Showing 1 to 10 of 100 entries")).toBeInTheDocument();
  });

  test("renders navigation buttons with correct disabled states", () => {
    render(<PaginationControls {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous page");
    const nextButton = screen.getByLabelText("Next page");

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  test("handles next and previous page clicks", () => {
    const props = {
      ...defaultProps,
      currentPage: 2,
    };

    render(<PaginationControls {...props} />);

    fireEvent.click(screen.getByLabelText("Next page"));
    expect(props.nextPage).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(props.prevPage).toHaveBeenCalled();
  });

  test("handles direct page selection", () => {
    render(<PaginationControls {...defaultProps} />);

    fireEvent.click(screen.getByText("2"));
    expect(defaultProps.goToPage).toHaveBeenCalledWith(2);
  });

  test("shows correct page numbers for start of pagination range", () => {
    render(<PaginationControls {...defaultProps} />);

    // Should show 1, 2, 3, 4, 5, ..., 10
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getAllByText("...").length).toBe(1);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("shows correct page numbers for middle of pagination range", () => {
    const props = {
      ...defaultProps,
      currentPage: 5,
    };

    render(<PaginationControls {...props} />);

    // Should show 1, ..., 4, 5, 6, ..., 10
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getAllByText("...").length).toBe(2);
  });

  test("shows correct page numbers for end of pagination range", () => {
    const props = {
      ...defaultProps,
      currentPage: 8,
    };

    render(<PaginationControls {...props} />);

    // Should show 1, ..., 6, 7, 8, 9, 10
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("...").length).toBe(1);
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("handles small number of pages correctly", () => {
    const props = {
      ...defaultProps,
      totalPages: 5,
    };

    render(<PaginationControls {...props} />);

    // Should show all pages without ellipsis
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  test("applies active state to current page button", () => {
    render(<PaginationControls {...defaultProps} />);

    const currentPageButton = screen.getByText("1");
    expect(currentPageButton).toHaveClass("active");
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  test("ellipsis buttons are disabled", () => {
    const props = {
      ...defaultProps,
      currentPage: 5,
    };

    render(<PaginationControls {...props} />);

    const ellipsisButtons = screen.getAllByText("...");
    ellipsisButtons.forEach((button) => {
      expect(button.closest("button")).toBeDisabled();
    });
  });

  test("handles edge case of single page", () => {
    const props = {
      ...defaultProps,
      currentPage: 1,
      totalPages: 1,
      startIndex: 1,
      endIndex: 5,
      totalItems: 5,
    };

    render(<PaginationControls {...props} />);

    expect(screen.getByText("Showing 1 to 5 of 5 entries")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeDisabled();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  test("handles last page correctly", () => {
    const props = {
      ...defaultProps,
      currentPage: 10,
      startIndex: 91,
      endIndex: 100,
    };

    render(<PaginationControls {...props} />);

    expect(screen.getByText("Showing 91 to 100 of 100 entries")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeDisabled();
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
  });
});
