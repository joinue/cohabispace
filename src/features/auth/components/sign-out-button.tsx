import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOutIcon aria-hidden="true" />
        Sign out
      </Button>
    </form>
  );
}
