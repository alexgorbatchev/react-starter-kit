import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { authConfig } from "@/lib/auth-config";
import { PasskeyLogin } from "../passkey-login";

function PasskeyLoginHarness() {
  const [result, setResult] = useState("waiting");

  useEffect(() => {
    const originalPublicKeyCredential = window.PublicKeyCredential;

    Object.defineProperty(window, "PublicKeyCredential", {
      configurable: true,
      value: undefined,
    });

    return () => {
      Object.defineProperty(window, "PublicKeyCredential", {
        configurable: true,
        value: originalPublicKeyCredential,
      });
    };
  }, []);

  return (
    <div className="space-y-3">
      <PasskeyLogin
        onError={(error) => setResult(error ?? authConfig.errors.genericError)}
        onLoadingChange={() => undefined}
        onSuccess={() => setResult("success")}
      />
      <p>Result: {result}</p>
    </div>
  );
}

const meta: Meta<typeof PasskeyLogin> = {
  component: PasskeyLogin,
  parameters: {
    appStory: {
      initialHref: "/login",
    },
    layout: "centered",
  },
  render: () => {
    return <PasskeyLoginHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Log in with passkey" }),
    );
    await expect(
      canvas.getByText(`Result: ${authConfig.errors.passkeyNotSupported}`),
    ).toBeInTheDocument();
  },
};

export { Default as PasskeyLogin };
