import { OtpEmail } from "../templates/otp-email";

export function OtpPasswordReset() {
  return (
    <OtpEmail
      otp="456789"
      type="forget-password"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
