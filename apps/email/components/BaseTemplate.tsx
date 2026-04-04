import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { baseTemplateColors } from "./constants";

interface IBaseTemplateProps {
  preview: string;
  children: ReactNode;
  appName?: string;
  appUrl?: string;
}

export function BaseTemplate({
  preview,
  children,
  appName = "React Starter Kit",
  appUrl = "https://example.com",
}: IBaseTemplateProps) {
  // Embedded SVG logo as data URI for better email compatibility
  const logoDataUri =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzAwN2JmZiIvPgogIDx0ZXh0IHg9IjIwIiB5PSIyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCwnU2Vnb2UgVUknLFJvYm90bywnSGVsdmV0aWNhIE5ldWUnLFVidW50dSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIj5SPC90ZXh0Pgo8L3N2Zz4K";

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={logoDataUri}
              width="40"
              height="40"
              alt={appName}
              style={logo}
            />
            <Text style={headerText}>{appName}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent by {appName}. If you didn't expect this email,
              you can safely ignore it.
            </Text>
            {/* NOTE: Links assume standard /unsubscribe and /privacy routes exist */}
            {appUrl && (
              <Text style={footerText}>
                <Link href={`${appUrl}/unsubscribe`} style={footerLink}>
                  Unsubscribe
                </Link>{" "}
                |{" "}
                <Link href={`${appUrl}/privacy`} style={footerLink}>
                  Privacy Policy
                </Link>
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: baseTemplateColors.background,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: baseTemplateColors.white,
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "0 48px",
  textAlign: "center" as const,
  borderBottom: `1px solid ${baseTemplateColors.border}`,
  paddingBottom: "20px",
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto 8px auto",
  display: "block",
};

const headerText = {
  fontSize: "24px",
  fontWeight: "600",
  color: baseTemplateColors.text,
  margin: "0",
  textAlign: "center" as const,
};

const content = {
  padding: "0 48px",
};

const hr = {
  borderColor: baseTemplateColors.border,
  margin: "20px 0",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  color: baseTemplateColors.textLight,
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const footerLink = {
  color: baseTemplateColors.primary,
  textDecoration: "underline",
};
