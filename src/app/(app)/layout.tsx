import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { requireUser } from "@/lib/dal";
import { HouseholdSwitcher } from "@/features/households/components/household-switcher";
import { getActiveHousehold, getMyHouseholds } from "@/features/households/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [households, active] = await Promise.all([getMyHouseholds(), getActiveHousehold()]);

  const displayName =
    typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : null;

  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-2.5 backdrop-blur sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-foreground text-background grid size-7 place-items-center rounded-md font-mono text-xs font-semibold tracking-tighter">
              CS
            </div>
            <span className="sr-only sm:not-sr-only sm:text-sm sm:font-medium sm:tracking-tight">
              Cohabispace
            </span>
          </Link>
          {households.length > 0 ? (
            <>
              <span className="text-border" aria-hidden="true">
                /
              </span>
              <HouseholdSwitcher households={households} activeId={active?.id ?? null} />
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <UserMenu displayName={displayName} email={user.email ?? ""} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
