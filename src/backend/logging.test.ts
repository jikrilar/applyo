import { describe, expect, it } from "vitest";
import { redactLogData } from "./logging";

describe("structured logging", () => { it("redacts nested secrets and sensitive notes", () => expect(redactLogData({ userId: "u1", token: "secret", nested: { password: "pw", notes: "private" } })).toEqual({ userId: "u1", token: "[REDACTED]", nested: { password: "[REDACTED]", notes: "[REDACTED]" } })); });
