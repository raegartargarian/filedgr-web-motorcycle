import { describe, expect, it } from "vitest";
import { mergeRecords } from "./useVaultRecords";

const stream = (id: string, mapping: string) => ({ id, mapping });
const att = (id: string, created_at: string) =>
  ({
    id,
    name: id,
    status: "FILEDGR_DATA_ATTACHMENT_COMPLETED",
    created_at,
  }) as never;

describe("mergeRecords", () => {
  it("orders records newest first across streams and labels them", () => {
    const merged = mergeRecords([
      {
        stream: stream("s1", "service-records"),
        content: [
          att("a", "2026-09-01T10:00:00"),
          att("b", "2026-09-20T10:00:00"),
        ],
      },
      {
        stream: stream("s2", "inspection-reports"),
        content: [att("c", "2026-09-10T10:00:00")],
      },
    ]);
    expect(merged.map((r) => r.attachment.id)).toEqual(["b", "c", "a"]);
    expect(merged[1].streamLabel).toBe("Inspection Reports");
  });

  it("keeps undated records at the end", () => {
    const merged = mergeRecords([
      {
        stream: stream("s1", "x"),
        content: [att("late", ""), att("dated", "2026-01-01")],
      },
    ]);
    expect(merged.map((r) => r.attachment.id)).toEqual(["dated", "late"]);
  });
});
