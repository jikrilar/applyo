import { describe, expect, it } from "vitest";
import {
  createApplicationSchema,
  moveApplicationSchema,
  updateApplicationSchema,
} from "./applications";
import { createEventSchema, updateEventSchema } from "./events";
import { preferencesSchema } from "./preferences";
import { searchFiltersSchema } from "./search";
import { offerSchema } from "./offers";

const id = "550e8400-e29b-41d4-a716-446655440000";
describe("application schemas", () => {
  it("accepts a minimal application", () =>
    expect(
      createApplicationSchema.safeParse({ company: "Acme", position: "Engineer", stageId: id })
        .success,
    ).toBe(true));
  it("rejects an inverted salary range", () =>
    expect(
      createApplicationSchema.safeParse({
        company: "Acme",
        position: "Engineer",
        stageId: id,
        salaryMin: 10,
        salaryMax: 5,
      }).success,
    ).toBe(false));
  it("does not allow stage changes through generic update", () =>
    expect(updateApplicationSchema.safeParse({ applicationId: id, stageId: id }).success).toBe(
      false,
    ));
  it("rejects a self-referencing move neighbor", () =>
    expect(
      moveApplicationSchema.safeParse({
        applicationId: id,
        destinationStageId: id,
        beforeApplicationId: id,
      }).success,
    ).toBe(false));
  it("rejects unsupported work arrangement values", () =>
    expect(
      createApplicationSchema.safeParse({
        company: "Acme",
        position: "Engineer",
        stageId: id,
        workArrangement: "sometimes-home",
      }).success,
    ).toBe(false));
  it("rejects non-http job URLs", () =>
    expect(
      createApplicationSchema.safeParse({
        company: "Acme",
        position: "Engineer",
        stageId: id,
        jobUrl: "javascript:alert(1)",
      }).success,
    ).toBe(false));
});
describe("other schemas", () => {
  it("requires completion time for completed events", () =>
    expect(
      createEventSchema.safeParse({
        applicationId: id,
        category: "follow_up",
        title: "Email dikirim",
        status: "completed",
      }).success,
    ).toBe(false));
  it("rejects completion time for scheduled events", () =>
    expect(
      createEventSchema.safeParse({
        applicationId: id,
        category: "follow_up",
        title: "Email dikirim",
        status: "scheduled",
        completedAt: "2026-08-28T10:00:00Z",
      }).success,
    ).toBe(false));
  it("rejects subtypes on categories that do not support them", () =>
    expect(
      createEventSchema.safeParse({
        applicationId: id,
        category: "follow_up",
        subtype: "other",
        title: "Email dikirim",
        status: "scheduled",
      }).success,
    ).toBe(false));
  it("keeps omitted event update fields undefined", () => {
    const result = updateEventSchema.parse({ eventId: id, title: "Judul baru" });
    expect(result).toEqual({ eventId: id, title: "Judul baru" });
  });
  it("rejects empty event updates", () =>
    expect(updateEventSchema.safeParse({ eventId: id }).success).toBe(false));
  it("rejects non-http event URLs", () =>
    expect(
      createEventSchema.safeParse({
        applicationId: id,
        category: "other",
        title: "Agenda",
        status: "scheduled",
        url: "file:///tmp/test",
      }).success,
    ).toBe(false));
  it("accepts supported contextual event subtypes", () => {
    expect(
      createEventSchema.safeParse({
        applicationId: id,
        category: "interview",
        subtype: "technical",
        title: "Wawancara teknis",
        scheduledAt: "2026-09-01T03:00:00.000Z",
        status: "scheduled",
      }).success,
    ).toBe(true);
    expect(
      createEventSchema.safeParse({
        applicationId: id,
        category: "assessment",
        subtype: "case_study",
        title: "Studi kasus",
        deadlineAt: "2026-09-03T10:00:00.000Z",
        status: "scheduled",
      }).success,
    ).toBe(true);
  });
  it("normalizes an empty offer salary", () =>
    expect(
      offerSchema.parse({ applicationId: id, salary: "", currency: "IDR" }).salary,
    ).toBeNull());
  it("coerces a numeric offer salary", () =>
    expect(
      offerSchema.parse({ applicationId: id, salary: "12500000", currency: "IDR" }).salary,
    ).toBe(12_500_000));
  it("validates IANA timezones", () =>
    expect(
      preferencesSchema.safeParse({
        currency: "IDR",
        dateFormat: "DD MMM YYYY",
        timezone: "not/a-zone",
      }).success,
    ).toBe(false));
  it("validates date range order", () =>
    expect(
      searchFiltersSchema.safeParse({ dateFrom: "2026-09-01", dateTo: "2026-08-01" }).success,
    ).toBe(false));
  it("accepts multiple application stages and locations", () =>
    expect(
      searchFiltersSchema.safeParse({ stageId: [id], location: ["Bandung", "Jakarta"] }).success,
    ).toBe(true));
  it("accepts table header sorting and rejects removed sorting options", () => {
    for (const sort of ["applied_desc", "applied_asc", "upcoming_asc", "upcoming_desc"]) {
      expect(searchFiltersSchema.safeParse({ sort }).success).toBe(true);
    }
    expect(searchFiltersSchema.safeParse({ sort: "updated_desc" }).success).toBe(false);
  });
});
