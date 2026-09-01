import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("server environment", () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it("validates public Supabase values lazily", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    const { getServerEnv } = await import("./server");

    expect(getServerEnv()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-key",
    });
  });

  it("keeps the service role key behind an explicit server accessor", async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    const { getServiceRoleKey } = await import("./server");

    expect(getServiceRoleKey()).toBe("service-role-key");
  });
});
