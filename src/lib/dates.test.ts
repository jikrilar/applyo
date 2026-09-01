import { describe, expect, it } from "vitest";
import { localDay, monthRangeUtc, zonedLocalToUtc } from "./dates";

describe("timezone date helpers", () => {
  it("converts Jakarta local time to UTC", () => {
    expect(zonedLocalToUtc("2026-09-01T00:30", "Asia/Jakarta")).toBe("2026-08-31T17:30:00.000Z");
  });

  it("builds month boundaries in the selected timezone", () => {
    expect(monthRangeUtc("2026-09", "Asia/Makassar")).toEqual({
      start: "2026-08-31T16:00:00.000Z",
      end: "2026-09-30T16:00:00.000Z",
    });
  });

  it("groups an occurrence by local day", () => {
    expect(localDay("2026-08-31T17:30:00.000Z", "Asia/Jakarta")).toBe(1);
  });
});
