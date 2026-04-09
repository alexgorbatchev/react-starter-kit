import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAuthForm } from "../use-auth-form";

describe("useAuthForm", () => {
  it("returns the initial login state", () => {
    const onSuccess = async (): Promise<void> => {};

    const { result } = renderHook(() => useAuthForm({ onSuccess }));

    expect(result.current).toMatchObject({
      email: "",
      error: null,
      isDisabled: false,
      isLoading: false,
      mode: "login",
      step: "method",
    });
  });

  it("moves to the email step and updates the email", () => {
    const onSuccess = async (): Promise<void> => {};

    const { result } = renderHook(() =>
      useAuthForm({ mode: "signup", onSuccess }),
    );

    act(() => {
      result.current.goToEmailStep();
    });

    act(() => {
      result.current.changeEmail("user@example.com");
    });

    expect(result.current.step).toBe("email");
    expect(result.current.email).toBe("user@example.com");
    expect(result.current.mode).toBe("signup");
  });

  it("does not submit OTP flow without an email", async () => {
    const onSuccess = async (): Promise<void> => {};

    const { result } = renderHook(() => useAuthForm({ onSuccess }));

    await act(async () => {
      await result.current.sendOtp();
    });

    expect(result.current.step).toBe("method");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
