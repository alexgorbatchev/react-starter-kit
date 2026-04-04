import { OtpEmail } from "../templates/otp-email";

export function OtpSignIn() {
  return (
    <OtpEmail
      otp="123456"
      type="sign-in"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
