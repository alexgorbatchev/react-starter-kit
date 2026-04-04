import { OtpEmail } from "../templates/otp-email";

export function OtpVerification() {
  return (
    <OtpEmail
      otp="789012"
      type="email-verification"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
