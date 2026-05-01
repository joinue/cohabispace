"use client";

import { useState, useTransition } from "react";
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  archiveSpaceAction,
  deleteSpaceAction,
  unarchiveSpaceAction,
} from "@/features/spaces/actions";
import { SPACE_COLOR_TOKENS } from "@/features/spaces/colors";
import { EditSpaceSheet } from "@/features/spaces/components/edit-space-sheet";
import type { SpaceRow as SpaceRowType } from "@/features/spaces/queries";

export function SpaceRow({
  space,
  isAdmin,
  archived = false,
}: {
  space: SpaceRowType;
  isAdmin: boolean;
  archived?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const tokens = SPACE_COLOR_TOKENS[space.color];

  const archive = () =>
    startTransition(async () => {
      await archiveSpaceAction(space.id);
    });
  const unarchive = () =>
    startTransition(async () => {
      await unarchiveSpaceAction(space.id);
    });
  const remove = () =>
    startTransition(async () => {
      await deleteSpaceAction(space.id);
    });

  return (
    <>
      <li
        className={cn(
          "group/space-row hover:bg-muted/40 flex items-center gap-3 rounded-md px-2 py-2 transition-colors",
          pending && "pointer-events-none opacity-50",
        )}
      >
        <div
          className={cn("grid size-8 shrink-0 place-items-center rounded-lg text-base", tokens.bg)}
          aria-hidden="true"
        >
          {space.icon ?? "•"}
        </div>
        <span className="text-foreground flex-1 truncate text-sm">{space.name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${space.name}`}
            className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-md p-1 transition-opacity outline-none focus-visible:opacity-100 data-[popup-open]:opacity-100"
          >
            <MoreHorizontalIcon className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            {!archived ? (
              <DropdownMenuItem
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5"
              >
                <PencilIcon className="size-4" aria-hidden="true" />
                Rename / recolor
              </DropdownMenuItem>
            ) : null}
            {archived ? (
              <DropdownMenuItem onClick={unarchive} className="flex items-center gap-1.5">
                <ArchiveRestoreIcon className="size-4" aria-hidden="true" />
                Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={archive} className="flex items-center gap-1.5">
                <ArchiveIcon className="size-4" aria-hidden="true" />
                Archive
              </DropdownMenuItem>
            )}
            {isAdmin ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={remove}
                  variant="destructive"
                  className="flex items-center gap-1.5"
                >
                  <TrashIcon className="size-4" aria-hidden="true" />
                  Delete forever
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
      {!archived ? (
        <EditSpaceSheet space={space} open={editOpen} onOpenChange={setEditOpen} />
      ) : null}
    </>
  );
}
