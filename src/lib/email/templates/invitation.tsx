import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const fontStack =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const styles = {
  body: { backgroundColor: "#fafafa", fontFamily: fontStack, margin: 0, padding: "32px 0" },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e6e6e6",
    margin: "0 auto",
    maxWidth: 480,
    padding: "32px 32px 28px",
  },
  brand: {
    color: "#737373",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11,
    letterSpacing: 2,
    margin: 0,
    textTransform: "uppercase" as const,
  },
  h1: {
    color: "#0a0a0a",
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: 1.25,
    margin: "12px 0 8px",
  },
  body2: { color: "#404040", fontSize: 14, lineHeight: 1.6, margin: "8px 0" },
  button: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    color: "#ffffff",
    display: "inline-block",
    fontSize: 14,
    fontWeight: 500,
    padding: "10px 18px",
    textDecoration: "none",
  },
  hr: { borderColor: "#eee", margin: "24px 0" },
  meta: { color: "#888", fontSize: 12, lineHeight: 1.5, margin: 0 },
  link: { color: "#404040", wordBreak: "break-all" as const },
};

export interface InvitationEmailProps {
  inviterName: string;
  householdName: string;
  acceptUrl: string;
  expiresInDays: number;
}

export function InvitationEmail({
  inviterName,
  householdName,
  acceptUrl,
  expiresInDays,
}: InvitationEmailProps) {
  const preview = `${inviterName} invited you to ${householdName} on Cohabispace`;
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>Cohabispace</Text>
          <Heading style={styles.h1}>
            {inviterName} invited you to {householdName}
          </Heading>
          <Text style={styles.body2}>
            Cohabispace helps households share chores, projects, and reminders without the
            spreadsheet. Tap below to join {householdName}.
          </Text>
          <Section style={{ margin: "20px 0 8px" }}>
            <Button href={acceptUrl} style={styles.button}>
              Accept invitation
            </Button>
          </Section>
          <Text style={styles.meta}>
            This link expires in {expiresInDays} {expiresInDays === 1 ? "day" : "days"}. If the
            button doesn&rsquo;t work, copy and paste this URL:
            <br />
            <span style={styles.link}>{acceptUrl}</span>
          </Text>
          <Hr style={styles.hr} />
          <Text style={styles.meta}>
            Didn&rsquo;t expect this? You can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default InvitationEmail;
