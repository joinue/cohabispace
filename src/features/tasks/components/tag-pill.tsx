"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

export function TagPill({ tag, size = "xs" }: { tag: string; size?: "xs" | "sm" }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("tag") === tag;

  // Toggle: if already filtering by this tag, clicking removes the filter.
  const next = new URLSearchParams(params);
  if (active) next.delete("tag");
  else next.set("tag", tag);

  const query = next.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <Link
      // typedRoutes can't infer dynamic query strings on a runtime path.
      href={href as never}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full font-medium transition-colors",
        size === "xs" ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground",
      )}
    >
      <span aria-hidden="true">#</span>
      <span>{tag}</span>
    </Link>
  );
}

export function TagPills({ tags, size = "xs" }: { tags: readonly string[]; size?: "xs" | "sm" }) {
  if (tags.length === 0) return null;
  return (
    <span className="flex flex-wrap items-center gap-1">
      {tags.map((t) => (
        <TagPill key={t} tag={t} size={size} />
      ))}
    </span>
  );
}
