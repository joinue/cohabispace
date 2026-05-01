import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { requireUser } from "@/lib/dal";
import { HouseholdSwitcher } from "@/features/households/components/household-switcher";
import {
  getActiveHousehold,
  getHouseholdMembers,
  getMyHouseholds,
} from "@/features/households/queries";
import { getActiveSpaces } from "@/features/spaces/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [households, active] = await Promise.all([getMyHouseholds(), getActiveHousehold()]);
  const [spaces, members] = active
    ? await Promise.all([getActiveSpaces(active.id), getHouseholdMembers(active.id)])
    : [[], []];

  const displayName =
    typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : null;

  return (
    <AppShell
      sidebar={<AppSidebar spaces={spaces} members={members} />}
      topBarLeft={
        <>
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
        </>
      }
      topBarRight={
        <>
          <ThemeToggle />
          <UserMenu displayName={displayName} email={user.email ?? ""} />
        </>
      }
    >
      {children}
    </AppShell>
  );
}
