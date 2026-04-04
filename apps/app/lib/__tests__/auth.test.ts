import { describe, expect, it } from "vitest";

import { getAuthBaseUrl } from "../auth";

describe("getAuthBaseUrl", () => {
  it("returns the local fallback when origin is missing", () => {
    expect(getAuthBaseUrl(undefined)).toBe("http://localhost:5173/api/auth");
  });

  it("returns the local fallback when origin is not http", () => {
    expect(getAuthBaseUrl("null")).toBe("http://localhost:5173/api/auth");
  });

  it("uses the browser origin when it is http", () => {
    expect(getAuthBaseUrl("http://example.com")).toBe(
      "http://example.com/api/auth",
    );
  });

  it("uses the browser origin when it is https", () => {
    expect(getAuthBaseUrl("https://example.com")).toBe(
      "https://example.com/api/auth",
    );
  });
});
