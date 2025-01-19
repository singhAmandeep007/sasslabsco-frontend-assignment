import { renderHook, act } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, value: `Item ${i + 1}` }));

  test("should initialize with correct values", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentItems.length).toBe(10);
    expect(result.current.startIndex).toBe(1);
    expect(result.current.endIndex).toBe(10);
    expect(result.current.totalItems).toBe(25);
  });

  test("should handle next page navigation", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems.length).toBe(10);
    expect(result.current.startIndex).toBe(11);
    expect(result.current.endIndex).toBe(20);
  });

  test("should handle previous page navigation", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

    // Move to page 2 first
    act(() => {
      result.current.nextPage();
    });

    // Then move back to page 1
    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems.length).toBe(10);
    expect(result.current.startIndex).toBe(1);
    expect(result.current.endIndex).toBe(10);
  });

  test("should not go beyond first page when pressing previous", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  test("should not go beyond last page when pressing next", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

    // Try to go beyond last page
    act(() => {
      result.current.goToPage(3);
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.currentItems.length).toBe(5); // Last page has 5 items
  });

  test("should handle goToPage correctly", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.startIndex).toBe(11);
    expect(result.current.endIndex).toBe(20);
  });

  test("should handle invalid goToPage values", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 10 }));

    act(() => {
      result.current.goToPage(-1); // Try negative page
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.goToPage(999); // Try page beyond total pages
    });
    expect(result.current.currentPage).toBe(3); // Should go to last page
  });

  test("should handle empty items array", () => {
    const { result } = renderHook(() => usePagination({ items: [], itemsPerPage: 10 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentItems).toEqual([]);
    expect(result.current.startIndex).toBe(1);
    expect(result.current.endIndex).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  test("should handle itemsPerPage greater than total items", () => {
    const { result } = renderHook(() => usePagination({ items: mockItems, itemsPerPage: 30 }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentItems.length).toBe(25);
    expect(result.current.startIndex).toBe(1);
    expect(result.current.endIndex).toBe(25);
  });

  test("should update when items prop changes", () => {
    const { result, rerender } = renderHook(({ items, itemsPerPage }) => usePagination({ items, itemsPerPage }), {
      initialProps: { items: mockItems, itemsPerPage: 10 },
    });

    expect(result.current.totalItems).toBe(25);

    const newItems = mockItems.slice(0, 15);
    rerender({ items: newItems, itemsPerPage: 10 });

    expect(result.current.totalItems).toBe(15);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentItems.length).toBe(10);
  });
});
