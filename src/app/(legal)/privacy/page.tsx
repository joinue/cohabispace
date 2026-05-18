import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Cohabispace handles your personal information.",
};

const LAST_UPDATED = "May 17, 2026";

export default function PrivacyPage() {
  return (
    <>
      <header className="mb-10 flex flex-col gap-2">
        <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="text-foreground/90 flex flex-col gap-8 text-[15px] leading-7">
        <p>
          This Privacy Policy explains what information <strong>Joinue LLC</strong>{" "}
          (&ldquo;Joinue,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects when you use{" "}
          <strong>Cohabispace</strong> (the &ldquo;Service&rdquo;), why we collect it, and the
          choices you have. We try to keep this policy short and plain.
        </p>

        <Section title="1. The short version">
          <ul className="ml-6 list-disc space-y-1.5">
            <li>We collect what we need to run the Service for you and your household.</li>
            <li>We don&apos;t sell your data, and we don&apos;t use it for advertising.</li>
            <li>
              We use a small set of trusted infrastructure providers (Supabase, Resend, Vercel) to
              host the app and send transactional email.
            </li>
            <li>
              You can ask for a copy of your data, or for your account and data to be deleted, at
              any time by emailing{" "}
              <a className="underline underline-offset-4" href="mailto:marc@joinue.com">
                marc@joinue.com
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="2. Information we collect">
          <p>
            <strong>Account information.</strong> When you sign up, we collect your email address, a
            hashed password, and the display name you provide. We do not store your password in
            plain text.
          </p>
          <p>
            <strong>Household content.</strong> Anything you put into the Service: household names,
            invitations, tasks, subtasks, recurrence rules, tags, spaces, assignments, completion
            history, and similar content. Members of a household can see the content shared in that
            household.
          </p>
          <p>
            <strong>Email confirmation and password reset.</strong> We send transactional emails
            (for example, sign-up confirmation, password reset, household invitations) using Resend.
          </p>
          <p>
            <strong>Cookies.</strong> We use a small number of <em>essential</em> cookies and do not
            use advertising or analytics cookies. Specifically:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              Supabase authentication cookies that keep you signed in and refresh your session.
            </li>
            <li>
              An <code className="font-mono text-[13px]">httpOnly</code> preference cookie
              (&ldquo;cohabispace.active_household&rdquo;) that remembers which of your households
              you were last viewing.
            </li>
            <li>A cookie for your light / dark theme preference.</li>
          </ul>
          <p>
            <strong>Server and platform logs.</strong> Our hosting provider (Vercel) and database
            provider (Supabase) automatically log information such as IP address, user-agent, and
            request paths for security, abuse prevention, and reliability. These logs have limited
            retention windows set by those providers.
          </p>
          <p>
            We do not knowingly collect precise location data, biometric data, or special categories
            of personal data. We do not use third-party analytics or advertising trackers.
          </p>
        </Section>

        <Section title="3. How we use information">
          <p>We use the information described above to:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>Provide, maintain, and improve the Service.</li>
            <li>
              Authenticate you, secure your account, and prevent abuse, fraud, and policy
              violations.
            </li>
            <li>
              Send transactional emails about your account, household invitations, and password
              resets.
            </li>
            <li>
              Communicate with you when you contact us, or to send rare service announcements (for
              example, a material change to these terms).
            </li>
            <li>Comply with legal obligations and enforce our Terms of Service.</li>
          </ul>
        </Section>

        <Section title="4. Service providers">
          <p>
            We rely on a small number of vetted infrastructure providers (&ldquo;processors&rdquo;)
            to operate the Service. They access information only to perform the services we ask them
            to perform.
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>
              <strong>Supabase</strong> &mdash; Postgres database, authentication, and file storage.
            </li>
            <li>
              <strong>Resend</strong> &mdash; transactional email delivery.
            </li>
            <li>
              <strong>Vercel</strong> &mdash; web application hosting and edge serving.
            </li>
          </ul>
          <p>
            Each of these providers may process data in the United States or other countries. We do
            not sell your personal information, and we do not share it with third parties for their
            own marketing.
          </p>
        </Section>

        <Section title="5. Data retention">
          <p>
            We retain your account and household content for as long as your account is active. If
            you ask us to delete your account, we will delete or anonymize your personal data within
            a reasonable period, except where we are required to keep it for legal, accounting,
            security, or fraud-prevention reasons. Content you contributed to a shared household may
            remain visible to other members of that household after your account is deleted, unless
            you remove it first.
          </p>
          <p>
            Backups taken by our infrastructure providers may persist for a limited period after
            deletion before being overwritten.
          </p>
        </Section>

        <Section title="6. Security">
          <p>
            We take reasonable technical and organizational measures to protect your information:
            data is transmitted over HTTPS, passwords are hashed by our auth provider, and access to
            household data is enforced both at the application layer and by Postgres
            row-level-security policies. No system is perfectly secure, however, and we cannot
            guarantee absolute security.
          </p>
        </Section>

        <Section title="7. Your rights and choices">
          <p>
            You can access, update, or correct most of your profile and household content directly
            in the Service. You can email{" "}
            <a className="underline underline-offset-4" href="mailto:marc@joinue.com">
              marc@joinue.com
            </a>{" "}
            to:
          </p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>Request a copy of the personal data we hold about you.</li>
            <li>Ask us to correct inaccurate information.</li>
            <li>Ask us to delete your account and associated personal data.</li>
            <li>Object to or restrict certain uses of your personal data.</li>
          </ul>
          <p>
            Depending on where you live, you may have additional rights under laws such as the
            California Consumer Privacy Act (CCPA) or the EU/UK General Data Protection Regulation
            (GDPR). To exercise any of those rights, email us at the address above and we will
            respond within a reasonable period.
          </p>
        </Section>

        <Section title="8. Children">
          <p>
            The Service is not directed to children under 13, and we do not knowingly collect
            personal information from children under 13. If you are a parent or guardian and believe
            a child under 13 has provided us with personal information, please contact us and we
            will delete it.
          </p>
        </Section>

        <Section title="9. International users">
          <p>
            Joinue LLC is based in the United States, and our infrastructure providers operate
            primarily from the United States. If you access the Service from outside the U.S., you
            understand that your information will be transferred to, stored in, and processed in the
            United States, which may have different data-protection laws than your country.
          </p>
        </Section>

        <Section title="10. Changes to this Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the
            &ldquo;Last updated&rdquo; date above, and for material changes we will notify you
            in-app or by email where appropriate.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Joinue LLC
            <br />
            <a className="underline underline-offset-4" href="mailto:marc@joinue.com">
              marc@joinue.com
            </a>
          </p>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-foreground text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
