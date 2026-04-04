import { PasswordReset as PasswordResetTemplate } from "../templates/password-reset";

export function PasswordReset() {
  return (
    <PasswordResetTemplate
      userName="John Doe"
      resetUrl="https://example.com/reset?token=xyz789"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
