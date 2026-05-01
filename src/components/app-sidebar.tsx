"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCheckIcon, CheckSquareIcon, FolderIcon, SettingsIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SpaceMark } from "@/features/spaces/components/space-mark";
import type { HouseholdMember } from "@/features/households/queries";
import type { SpaceRow } from "@/features/spaces/queries";

function initials(name: string | null, email: string): string {
  const source = (name?.trim() || email).trim();
  if (!source) return "?";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
}

export function AppSidebar({
  spaces,
  members,
  onNavigate,
}: {
  spaces: SpaceRow[];
  members: HouseholdMember[];
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
        <SidebarLink
          href="/completed"
          active={pathname.startsWith("/completed")}
          onNavigate={onNavigate}
          icon={<CheckCheckIcon className="size-4" aria-hidden="true" />}
        >
          Completed
        </SidebarLink>
      </div>

      <SidebarSection label="Spaces">
        {spaces.length === 0 ? (
          <p className="text-muted-foreground px-2 py-1.5 text-xs">
            Your household has no spaces yet.
          </p>
        ) : (
          spaces.map((s) => (
            <SidebarLink
              key={s.id}
              href={`/spaces/${s.id}`}
              active={pathname === `/spaces/${s.id}`}
              onNavigate={onNavigate}
              icon={<SpaceMark space={s} size="sm" />}
            >
              {s.name}
            </SidebarLink>
          ))
        )}
      </SidebarSection>

      {members.length > 1 ? (
        <SidebarSection label="People">
          {members.map((m) => (
            <SidebarLink
              key={m.userId}
              href={`/people/${m.userId}`}
              active={pathname === `/people/${m.userId}`}
              onNavigate={onNavigate}
              icon={
                <Avatar size="sm" className="size-5">
                  {m.avatarUrl ? (
                    <AvatarImage src={m.avatarUrl} alt="" />
                  ) : (
                    <AvatarFallback className="text-[10px]">
                      {initials(m.displayName, m.email)}
                    </AvatarFallback>
                  )}
                </Avatar>
              }
            >
              {m.displayName ?? m.email.split("@")[0]}
            </SidebarLink>
          ))}
        </SidebarSection>
      ) : null}

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
      // typedRoutes can't infer dynamic segments at runtime
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
