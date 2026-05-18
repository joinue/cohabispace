import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Cohabispace.",
};

const LAST_UPDATED = "May 17, 2026";

export default function TermsPage() {
  return (
    <>
      <header className="mb-10 flex flex-col gap-2">
        <p className="text-muted-foreground font-mono text-[11px] tracking-widest uppercase">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="text-foreground/90 flex flex-col gap-8 text-[15px] leading-7">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement between you and{" "}
          <strong>Joinue LLC</strong> (&ldquo;Joinue,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;),
          the operator of <strong>Cohabispace</strong> (the &ldquo;Service&rdquo;). By creating an
          account or using the Service, you agree to these Terms. If you do not agree, do not use
          the Service.
        </p>

        <Section title="1. Beta service">
          <p>
            Cohabispace is currently in a private beta. Features may be added, changed, or removed
            at any time. The Service is provided for your convenience and is not a system of record.
            Do not rely on it for legally required recordkeeping, medical reminders, safety-critical
            scheduling, or any purpose where a missed or lost item could cause material harm.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least 13 years old to create an account. If you are between 13 and 18,
            you may use the Service only with the involvement and consent of a parent or guardian
            who is also a member of your household. You are responsible for any individuals you
            invite to a household you administer.
          </p>
        </Section>

        <Section title="3. Your account">
          <p>
            You are responsible for everything that happens under your account, including for
            keeping your password confidential and for the actions of anyone you invite to a
            household. Notify us at{" "}
            <a className="underline underline-offset-4" href="mailto:marc@joinue.com">
              marc@joinue.com
            </a>{" "}
            if you suspect unauthorized access. We may suspend or terminate accounts that we
            believe, in good faith, violate these Terms or pose a risk to the Service or other
            users.
          </p>
        </Section>

        <Section title="4. Acceptable use">
          <p>You agree not to:</p>
          <ul className="ml-6 list-disc space-y-1.5">
            <li>Use the Service to harass, threaten, defraud, or harm any person.</li>
            <li>
              Upload content that is unlawful, infringing, defamatory, or that violates the privacy
              of others.
            </li>
            <li>
              Attempt to access another household&apos;s data without authorization, probe for
              vulnerabilities, or interfere with the Service&apos;s operation or security.
            </li>
            <li>
              Reverse engineer, scrape, or use automated means to access the Service except as
              expressly permitted.
            </li>
            <li>Resell, sublicense, or commercially redistribute the Service.</li>
          </ul>
        </Section>

        <Section title="5. Your content">
          <p>
            You retain ownership of the household data you put into the Service (tasks, lists,
            household names, member details, and similar content). You grant Joinue a limited,
            non-exclusive license to host, store, transmit, back up, and display that content solely
            to operate and improve the Service for you and the members of your household.
          </p>
          <p>
            You represent that you have the right to share any personal information about other
            people that you enter (for example, when inviting a household member or assigning a
            task).
          </p>
        </Section>

        <Section title="6. Availability and changes">
          <p>
            We do not guarantee that the Service will be available, uninterrupted, error-free, or
            permanently retained. We may modify, suspend, or discontinue any part of the Service at
            any time. We will use reasonable efforts to provide advance notice of material changes
            or discontinuation when feasible.
          </p>
        </Section>

        <Section title="7. No warranty">
          <p>
            THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS,
            WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR
            UNINTERRUPTED OR ERROR-FREE OPERATION. YOU USE THE SERVICE AT YOUR OWN RISK.
          </p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOINUE LLC AND ITS OWNERS, EMPLOYEES, AND
            CONTRACTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
            EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR
            BUSINESS, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, EVEN IF ADVISED
            OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            OUR TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE
            WILL NOT EXCEED THE GREATER OF (a) THE AMOUNTS YOU PAID US FOR THE SERVICE IN THE TWELVE
            MONTHS BEFORE THE CLAIM AROSE, OR (b) ONE HUNDRED U.S. DOLLARS ($100).
          </p>
        </Section>

        <Section title="9. Indemnification">
          <p>
            You agree to indemnify and hold harmless Joinue LLC and its owners, employees, and
            contractors from any claim, loss, liability, or expense (including reasonable
            attorneys&apos; fees) arising out of your content, your use of the Service, or your
            violation of these Terms or any applicable law.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            You may stop using the Service at any time and request that we delete your account by
            emailing{" "}
            <a className="underline underline-offset-4" href="mailto:marc@joinue.com">
              marc@joinue.com
            </a>
            . We may suspend or terminate your access at any time, with or without notice, if we
            reasonably believe you have violated these Terms or that suspension is necessary to
            protect the Service or other users. Sections that by their nature should survive
            termination (including ownership, disclaimers, liability limits, indemnification, and
            governing law) will survive.
          </p>
        </Section>

        <Section title="11. Changes to these Terms">
          <p>
            We may update these Terms from time to time. If we make a material change, we will
            update the &ldquo;Last updated&rdquo; date and, where appropriate, notify you in-app or
            by email. Continued use of the Service after changes take effect constitutes acceptance
            of the updated Terms.
          </p>
        </Section>

        <Section title="12. Governing law and disputes">
          <p>
            These Terms and any dispute arising out of or related to them or the Service are
            governed by the laws of the State of Delaware, USA, without regard to its conflict of
            laws principles. Any dispute will be resolved exclusively in the state or federal courts
            located in Delaware, and you consent to personal jurisdiction there. Nothing in these
            Terms waives any non-waivable rights you may have under the laws of your place of
            residence.
          </p>
        </Section>

        <Section title="13. Contact">
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
