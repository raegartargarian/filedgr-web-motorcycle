import { describe, expect, it } from "vitest";
import { readListPage } from "./listPage";

describe("readListPage", () => {
  it("passes a full page through", () => {
    const page = {
      content: [{ id: "a" }],
      total_records: 31,
      current_page: 2,
      total_pages: 3,
    };
    expect(readListPage({ status: 200, data: page }, 2)).toEqual(page);
  });

  it("turns the backend's bodiless 204 on page 1 into an empty single page", () => {
    expect(readListPage({ status: 204, data: "" }, 1)).toEqual({
      content: [],
      total_records: 0,
      current_page: 1,
      total_pages: 1,
    });
  });

  it("closes paging on a 204 for a later page", () => {
    const page = readListPage({ status: 204, data: "" }, 4);
    expect(page.content).toEqual([]);
    expect(page.current_page).toBe(4);
    expect(page.total_pages).toBe(4);
  });

  it("fills in whatever a 200 page leaves out", () => {
    expect(readListPage({ status: 200, data: {} }, 1)).toEqual({
      content: [],
      total_records: 0,
      current_page: 1,
      total_pages: 1,
    });
  });
});
