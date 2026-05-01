import { cn } from "@/lib/utils";
import { SPACE_COLOR_TOKENS } from "@/features/spaces/colors";
import { SpaceMark } from "@/features/spaces/components/space-mark";
import type { SpaceRow } from "@/features/spaces/queries";

export function SpacePill({
  space,
  size = "sm",
  className,
}: {
  space: Pick<SpaceRow, "name" | "color">;
  size?: "xs" | "sm";
  className?: string;
}) {
  const tokens = SPACE_COLOR_TOKENS[space.color];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "xs" ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs",
        tokens.bg,
        tokens.fg,
        className,
      )}
    >
      <SpaceMark space={space} size="xs" className="bg-transparent" />
      <span className="truncate">{space.name}</span>
    </span>
  );
}
