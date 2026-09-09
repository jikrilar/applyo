import { describe, expect, it } from "vitest";
import { localDay, monthRangeUtc, utcToZonedLocal, zonedLocalToUtc } from "./dates";

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

  it("formats a UTC instant as wall time in the selected timezone", () => {
    expect(utcToZonedLocal("2026-09-11T02:00:00.000Z", "Asia/Jakarta")).toBe("2026-09-11T09:00");
    expect(utcToZonedLocal("2026-09-11T02:00:00.000Z", "Asia/Makassar")).toBe("2026-09-11T10:00");
  });

  it("round-trips an edited datetime without shifting the instant", () => {
    const stored = "2026-09-11T02:00:00.000Z";
    expect(zonedLocalToUtc(utcToZonedLocal(stored, "Asia/Jakarta"), "Asia/Jakarta")).toBe(stored);
  });
});
