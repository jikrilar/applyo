import { describe, expect, it } from "vitest";
import { BackendError, databaseError, toActionResult } from "./errors";

describe("databaseError", () => {
  it.each([
    ["P0002", "NOT_FOUND"],
    ["42501", "FORBIDDEN"],
    ["40001", "CONFLICT"],
    ["23503", "CONFLICT"],
    ["22023", "VALIDATION"],
    ["23514", "VALIDATION"],
    ["23505", "CONFLICT"],
  ] as const)("maps PostgreSQL code %s to %s", (databaseCode, expectedCode) => {
    expect(databaseError("test", { code: databaseCode }).code).toBe(expectedCode);
  });

  it("does not expose a raw database message", () => {
    const error = databaseError("move_application", {
      code: "XX000",
      message: "secret internal database detail",
    });

    expect(error.message).not.toContain("secret internal database detail");
  });
});

describe("toActionResult", () => {
  it("returns a stable serializable error contract", () => {
    expect(toActionResult(new BackendError("UNAUTHORIZED", "Silakan masuk."))).toEqual({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Silakan masuk." },
    });
  });
});
