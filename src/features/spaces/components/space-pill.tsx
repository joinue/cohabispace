import { cn } from "@/lib/utils";
import { getSpaceColorRender } from "@/features/spaces/colors";
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
  const render = getSpaceColorRender(space.color);
  const sizeClasses = size === "xs" ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs";

  if (render.kind === "preset") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-medium",
          sizeClasses,
          render.tokens.bg,
          render.tokens.fg,
          className,
        )}
      >
        <SpaceMark space={space} size="xs" transparent />
        <span className="truncate">{space.name}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizeClasses,
        className,
      )}
      style={{ ...render.styles.bgStyle, ...render.styles.fgStyle }}
    >
      <SpaceMark space={space} size="xs" transparent />
      <span className="truncate">{space.name}</span>
    </span>
  );
}
