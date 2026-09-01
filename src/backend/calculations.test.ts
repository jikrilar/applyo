import { describe, expect, it } from "vitest";
import { calculateConversions, conversion, waitingState } from "./calculations";

describe("backend calculations", () => {
  it("uses the latest meaningful activity for waiting time", () => expect(waitingState({ createdAt: "2026-08-01T00:00:00Z", appliedAt: "2026-08-05", activityDates: ["2026-08-20T00:00:00Z"] }, new Date("2026-08-28T00:00:00Z")).waitingDays).toBe(8));
  it("never suggests follow-up for closed applications", () => expect(waitingState({ createdAt: "2026-08-01T00:00:00Z", isClosed: true }, new Date("2026-08-28T00:00:00Z")).followUpSuggested).toBe(false));
  it("handles zero denominators", () => expect(conversion(4, 0)).toBe(0));
  it("calculates percentage conversions", () => expect(calculateConversions({ applied: 10, interview: 5, offer: 2, hired: 1 })).toEqual({ appliedToInterview: 50, interviewToOffer: 40, offerToHired: 50 }));
});
