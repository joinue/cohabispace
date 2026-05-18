import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckIcon, LogOutIcon, TvIcon } from "lucide-react";

import { signOutAction } from "@/features/auth/actions";
import { setFamilyDisplayAction } from "@/features/display-mode/actions";

function initials(name: string | null | undefined, email: string): string {
  const source = (name?.trim() || email).trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).slice(0, 2);
  return parts
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();
}

export function UserMenu({
  displayName,
  email,
  familyDisplay,
}: {
  displayName: string | null;
  email: string;
  familyDisplay: boolean;
}) {
  const toggleFamilyDisplay = setFamilyDisplayAction.bind(null, !familyDisplay);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-2"
      >
        <Avatar size="sm">
          <AvatarFallback className="text-[11px] font-medium">
            {initials(displayName, email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-56">
        <div className="flex flex-col gap-0.5 px-1.5 py-1.5">
          <span className="text-foreground truncate text-sm font-medium">
            {displayName ?? email.split("@")[0]}
          </span>
          <span className="text-muted-foreground truncate text-xs">{email}</span>
        </div>
        <DropdownMenuSeparator />
        <form action={toggleFamilyDisplay}>
          <DropdownMenuItem
            render={
              <button type="submit" className="w-full">
                <TvIcon className="size-4" aria-hidden="true" />
                <span className="flex-1 text-left">Family display</span>
                {familyDisplay ? <CheckIcon className="size-4" aria-hidden="true" /> : null}
              </button>
            }
          />
        </form>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem
            render={
              <button type="submit" className="w-full">
                <LogOutIcon className="size-4" aria-hidden="true" />
                <span>Sign out</span>
              </button>
            }
            variant="destructive"
          />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
