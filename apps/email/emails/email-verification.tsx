import { EmailVerification as EmailVerificationTemplate } from "../templates/email-verification";

export function EmailVerification() {
  return (
    <EmailVerificationTemplate
      userName="John Doe"
      verificationUrl="https://example.com/verify?token=abc123"
      appName="React Starter Kit"
      appUrl="https://example.com"
    />
  );
}
