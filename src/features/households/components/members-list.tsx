import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { HouseholdMember } from "@/features/households/queries";

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

export function MembersList({
  members,
  currentUserId,
}: {
  members: HouseholdMember[];
  currentUserId: string;
}) {
  return (
    <ul className="flex flex-col">
      {members.map((m) => (
        <li
          key={m.userId}
          className="hover:bg-muted/40 flex items-center justify-between gap-3 rounded-md px-2 py-2"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar size="sm">
              {m.avatarUrl ? (
                <AvatarImage src={m.avatarUrl} alt="" />
              ) : (
                <AvatarFallback className="text-[11px] font-medium">
                  {initials(m.displayName, m.email)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="text-foreground truncate text-sm">
                {m.displayName ?? m.email.split("@")[0]}
                {m.userId === currentUserId ? (
                  <span className="text-muted-foreground"> · you</span>
                ) : null}
              </span>
              <span className="text-muted-foreground truncate text-xs">{m.email}</span>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {m.role}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
