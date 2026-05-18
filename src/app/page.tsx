import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-foreground text-background grid size-7 place-items-center rounded-md font-mono text-xs font-semibold tracking-tighter">
            CS
          </div>
          <span className="text-sm font-medium tracking-tight">Cohabispace</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-24 sm:px-8">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <span className="text-muted-foreground rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-widest uppercase">
            Beta · Invite only
          </span>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            A calmer way to run a household.
          </h1>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed text-balance sm:text-lg">
            Chores, projects, and reminders for couples, families, and roommates — without the
            spreadsheet, sticky notes, or shared docs that nobody reads.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
              Get started
            </Link>
            <Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              I have an account
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 px-6 pb-6 font-mono text-[11px] tracking-wide sm:px-8">
        <span>© 2026 Joinue LLC</span>
        <nav className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <a href="mailto:marc@joinue.com" className="hover:text-foreground">
            Contact
          </a>
        </nav>
      </footer>
    </div>
  );
}
