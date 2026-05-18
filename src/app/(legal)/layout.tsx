import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-foreground text-background grid size-7 place-items-center rounded-md font-mono text-xs font-semibold tracking-tighter">
            CS
          </div>
          <span className="text-sm font-medium tracking-tight">Cohabispace</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 justify-center px-6 pb-24 sm:px-8">
        <article className="w-full max-w-2xl pt-6 leading-relaxed sm:pt-12">{children}</article>
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
