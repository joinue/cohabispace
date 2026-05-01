"use client";

import { useActionState, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { FormFieldError } from "@/features/auth/components/form-field-error";
import { updateSpaceAction } from "@/features/spaces/actions";
import { SPACE_COLOR_LABEL, SPACE_COLOR_ORDER, SPACE_COLOR_TOKENS } from "@/features/spaces/colors";
import type { SpaceColor } from "@/lib/supabase/database.types";
import type { FormState } from "@/lib/forms";
import type { SpaceRow } from "@/features/spaces/queries";

export function EditSpaceSheet({
  space,
  open,
  onOpenChange,
}: {
  space: SpaceRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <EditSpaceFormBody
          key={open ? `${space.id}-${space.updated_at}` : "closed"}
          space={space}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}

function EditSpaceFormBody({ space, onClose }: { space: SpaceRow; onClose: () => void }) {
  const [color, setColor] = useState<SpaceColor>(space.color);

  const wrappedAction = async (prev: FormState, formData: FormData): Promise<FormState> => {
    const result = await updateSpaceAction(space.id, prev, formData);
    if (result && !result.error && !result.fieldErrors) onClose();
    return result;
  };

  const [state, formAction, pending] = useActionState(wrappedAction, undefined);

  return (
    <>
      <SheetHeader className="flex flex-col gap-1 border-b px-5 py-4">
        <SheetTitle className="text-base font-semibold tracking-tight">Edit space</SheetTitle>
        <SheetDescription className="text-muted-foreground text-xs">
          Rename, change the icon, or pick a different color.
        </SheetDescription>
      </SheetHeader>

      <form
        id="edit-space-form"
        action={formAction}
        className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
      >
        <input type="hidden" name="color" value={color} />

        {state?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-space-name" className="text-xs">
            Name
          </Label>
          <Input
            id="edit-space-name"
            name="name"
            type="text"
            required
            maxLength={60}
            defaultValue={space.name}
            className="h-9"
            aria-invalid={Boolean(state?.fieldErrors?.name)}
          />
          <FormFieldError messages={state?.fieldErrors?.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs">Color</Label>
          <div className="flex flex-wrap items-center gap-1.5">
            {SPACE_COLOR_ORDER.map((c) => {
              const tokens = SPACE_COLOR_TOKENS[c];
              const selected = c === color;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={SPACE_COLOR_LABEL[c]}
                  aria-pressed={selected}
                  className={cn(
                    "size-7 rounded-full transition-shadow outline-none",
                    tokens.dot,
                    selected
                      ? "ring-foreground ring-offset-background ring-2 ring-offset-2"
                      : "ring-foreground/10 hover:ring-foreground/30 ring-1",
                  )}
                />
              );
            })}
          </div>
        </div>
      </form>

      <SheetFooter className="flex flex-row items-center justify-end gap-2 border-t px-5 py-3">
        <SheetClose
          render={
            <Button type="button" variant="ghost" size="sm">
              Cancel
            </Button>
          }
        />
        <Button type="submit" form="edit-space-form" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </SheetFooter>
    </>
  );
}
