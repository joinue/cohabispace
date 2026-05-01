"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquareIcon, FolderIcon, SettingsIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { SPACE_COLOR_TOKENS } from "@/features/spaces/colors";
import type { SpaceRow } from "@/features/spaces/queries";

export function AppSidebar({
  spaces,
  onNavigate,
}: {
  spaces: SpaceRow[];
  /** Called when a nav item is activated — used to close the mobile drawer. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full min-h-0 flex-col gap-4 px-2 py-4">
      <div className="flex flex-col gap-0.5">
        <SidebarLink
          href="/dashboard"
          active={pathname === "/dashboard"}
          onNavigate={onNavigate}
          icon={<CheckSquareIcon className="size-4" aria-hidden="true" />}
        >
          All tasks
        </SidebarLink>
      </div>

      <SidebarSection label="Spaces">
        {spaces.length === 0 ? (
          <p className="text-muted-foreground px-2 py-1.5 text-xs">
            Your household has no spaces yet.
          </p>
        ) : (
          spaces.map((s) => {
            const tokens = SPACE_COLOR_TOKENS[s.color];
            return (
              <SidebarLink
                key={s.id}
                href={`/spaces/${s.id}`}
                active={pathname === `/spaces/${s.id}`}
                onNavigate={onNavigate}
                icon={
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full text-[11px]",
                      tokens.bg,
                    )}
                    aria-hidden="true"
                  >
                    {s.icon ?? "•"}
                  </span>
                }
              >
                {s.name}
              </SidebarLink>
            );
          })
        )}
      </SidebarSection>

      <div className="mt-auto flex flex-col gap-0.5">
        <SidebarLink
          href="/settings/spaces"
          active={pathname.startsWith("/settings/spaces")}
          onNavigate={onNavigate}
          icon={<SettingsIcon className="size-4" aria-hidden="true" />}
        >
          Manage spaces
        </SidebarLink>
      </div>
    </nav>
  );
}

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-muted-foreground px-2 py-1.5 font-mono text-[10px] tracking-widest uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function SidebarLink({
  href,
  active,
  icon,
  children,
  onNavigate,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      // biome-ignore: typedRoutes catches typos at build time; this prop is dynamic.
      href={href as never}
      onClick={onNavigate}
      className={cn(
        "hover:bg-muted/60 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        "focus-visible:bg-muted/60 focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none",
        active
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon ?? <FolderIcon className="size-4" aria-hidden="true" />}
      <span className="truncate">{children}</span>
    </Link>
  );
}
