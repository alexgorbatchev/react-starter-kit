import { Button, Heading, Section, Text } from "@react-email/components";
import { BaseTemplate } from "../components/BaseTemplate";
import { baseTemplateColors } from "../components/constants";

interface IEmailVerificationProps {
  userName?: string;
  verificationUrl: string;
  appName?: string;
  appUrl?: string;
}

export function EmailVerification({
  userName,
  verificationUrl,
  appName,
  appUrl,
}: IEmailVerificationProps) {
  const preview = `Verify your email address for ${appName || "your account"}`;

  return (
    <BaseTemplate preview={preview} appName={appName} appUrl={appUrl}>
      <Heading style={heading}>Verify your email address</Heading>

      <Text style={paragraph}>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={paragraph}>
        Thanks for signing up! Please click the button below to verify your
        email address and complete your account setup.
      </Text>

      <Section style={buttonContainer}>
        <Button href={verificationUrl} style={button}>
          Verify Email Address
        </Button>
      </Section>

      <Text style={paragraph}>
        Or copy and paste this URL into your browser:
      </Text>

      <Text style={linkText}>{verificationUrl}</Text>

      <Text style={paragraph}>
        This verification link will expire in 24 hours for security reasons.
      </Text>

      <Text style={paragraph}>
        If you didn't create an account with us, you can safely ignore this
        email.
      </Text>
    </BaseTemplate>
  );
}

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: baseTemplateColors.text,
  margin: "0 0 24px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: baseTemplateColors.textMuted,
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: baseTemplateColors.primary,
  borderRadius: "6px",
  color: baseTemplateColors.white,
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  lineHeight: "20px",
};

const linkText = {
  fontSize: "14px",
  color: baseTemplateColors.textLight,
  wordBreak: "break-all" as const,
  margin: "0 0 16px",
  padding: "12px",
  backgroundColor: "#f8f9fa",
  borderRadius: "4px",
  border: "1px solid #e9ecef",
};
