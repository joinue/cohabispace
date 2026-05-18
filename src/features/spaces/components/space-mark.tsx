import { cn } from "@/lib/utils";
import { getSpaceColorRender } from "@/features/spaces/colors";
import type { SpaceColor } from "@/lib/supabase/database.types";

const SIZE: Record<NonNullable<SpaceMarkProps["size"]>, string> = {
  xs: "size-4 rounded text-[9px]",
  sm: "size-5 rounded-md text-[11px]",
  md: "size-8 rounded-lg text-sm",
  lg: "size-12 rounded-2xl text-lg",
};

interface SpaceMarkProps {
  space: { name: string; color: SpaceColor };
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Drop the tinted background; foreground stays. Used inside SpacePill. */
  transparent?: boolean;
}

/**
 * Colored letter tile representing a space. The first alphanumeric
 * character of the name is the letter; tinted background and foreground
 * come from the space's color — either a preset token or a user-chosen
 * hex routed through `color-mix()`.
 */
export function SpaceMark({ space, size = "sm", className, transparent }: SpaceMarkProps) {
  const render = getSpaceColorRender(space.color);
  const letter = (space.name.match(/[\p{L}\p{N}]/u)?.[0] ?? "•").toUpperCase();

  if (render.kind === "preset") {
    return (
      <span
        className={cn(
          "grid shrink-0 place-items-center font-semibold tracking-tight",
          SIZE[size],
          !transparent && render.tokens.bg,
          render.tokens.fg,
          className,
        )}
        aria-hidden="true"
      >
        {letter}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center font-semibold tracking-tight",
        SIZE[size],
        className,
      )}
      style={{
        ...(transparent ? {} : render.styles.bgStyle),
        ...render.styles.fgStyle,
      }}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
