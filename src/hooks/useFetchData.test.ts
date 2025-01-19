import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { useFetchData } from "./useFetchData";

// Define type for mocked fetch
type MockFetch = ReturnType<typeof vi.fn>;

// Extend global to include fetch
declare global {
  // @ts-expect-error - Ignore TS error for fetch
  // eslint-disable-next-line
  var fetch: MockFetch;
}

describe("useFetchData", () => {
  const mockData = { id: 1, name: "Test Data" };
  const mockUrl = "https://api.example.com/data";

  // Setup global fetch mock
  beforeEach(() => {
    // @ts-expect-error - Ignore TS error for fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should handle successful data fetching", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve(mockData) };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useFetchData<typeof mockData>(mockUrl));

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the fetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    // @ts-expect-error - Ignore TS error for fetch
    expect(global.fetch).toHaveBeenCalledWith(mockUrl, {});
  });

  test("should handle API error responses", async () => {
    const errorResponse = { ok: false, status: 404 };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValueOnce(errorResponse);

    const { result } = renderHook(() => useFetchData<typeof mockData>(mockUrl));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("HTTP error! status: 404");
  });

  test("should handle network errors", async () => {
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchData<typeof mockData>(mockUrl));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("Network error");
  });

  test("should handle custom request options", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve(mockData) };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValueOnce(mockResponse);

    const customOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    renderHook(() => useFetchData<typeof mockData>(mockUrl, customOptions));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    // @ts-expect-error - Ignore TS error for fetch
    expect(global.fetch).toHaveBeenCalledWith(mockUrl, customOptions);
  });

  test("should refetch data when URL changes", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve(mockData) };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValue(mockResponse);

    const { rerender } = renderHook((props: { url: string }) => useFetchData<typeof mockData>(props.url), {
      initialProps: { url: mockUrl },
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const newUrl = "https://api.example.com/new-data";
    rerender({ url: newUrl });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    // @ts-expect-error - Ignore TS error for fetch
    expect(global.fetch).toHaveBeenCalledTimes(2);
    // @ts-expect-error - Ignore TS error for fetch
    expect(global.fetch).toHaveBeenLastCalledWith(newUrl, {});
  });

  test("should handle manual refetch", async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve(mockData) };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetchData<typeof mockData>(mockUrl));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Initial fetch
    // @ts-expect-error - Ignore TS error for fetch
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Manual refetch
    await act(async () => {
      await result.current.refetch();
    });
    // @ts-expect-error - Ignore TS error for fetch
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("should handle malformed JSON response", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useFetchData<typeof mockData>(mockUrl));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("Invalid JSON");
  });

  test("should maintain previous data while loading new data", async () => {
    // First successful response
    const initialData = { id: 1, name: "Initial Data" };
    const mockResponse1 = { ok: true, json: () => Promise.resolve(initialData) };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValueOnce(mockResponse1);

    const { result } = renderHook(() => useFetchData<typeof mockData>(mockUrl));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(initialData);

    // Trigger refetch
    const newData = { id: 2, name: "New Data" };
    const mockResponse2 = { ok: true, json: () => Promise.resolve(newData) };
    // @ts-expect-error - Ignore TS error for fetch
    (global.fetch as MockFetch).mockResolvedValueOnce(mockResponse2);

    act(() => {
      result.current.refetch();
    });

    // Check that old data is maintained while loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual(initialData);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify new data is loaded
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(newData);
  });
});
