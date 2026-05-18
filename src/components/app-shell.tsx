"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function AppShell({
  sidebar,
  topBarLeft,
  topBarRight,
  familyMode = false,
  children,
}: {
  sidebar: React.ReactNode;
  topBarLeft: React.ReactNode;
  topBarRight: React.ReactNode;
  /** Kiosk-style mounted-tablet mode: hides sidebar and drawer, simplifies header. */
  familyMode?: boolean;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (familyMode) {
    return (
      <div className="flex min-h-svh flex-col">
        <header className="safe-px safe-pt sm:safe-px-sm flex items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">{topBarLeft}</div>
          <div className="flex items-center gap-1">{topBarRight}</div>
        </header>
        <main className="safe-px safe-pb sm:safe-px-sm lg:safe-px-lg mx-auto w-full max-w-4xl flex-1 pt-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh">
      {/* Fixed sidebar — shown at lg+ so iPad portrait gets the drawer instead. */}
      <aside className="bg-muted/20 hidden w-60 shrink-0 border-r lg:flex lg:flex-col">
        {sidebar}
      </aside>

      {/* Drawer sidebar — phones and tablet portrait. */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-72 p-0 sm:max-w-xs">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {/* Tap any nav link → close the drawer (capture phase). */}
          <div onClickCapture={() => setDrawerOpen(false)} className="h-full">
            {sidebar}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 safe-px safe-pt sm:safe-px-sm sticky top-0 z-30 flex items-center justify-between gap-3 border-b py-2.5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon aria-hidden="true" />
            </Button>
            {topBarLeft}
          </div>
          <div className="flex items-center gap-1">{topBarRight}</div>
        </header>
        <main className="safe-px safe-pb sm:safe-px-sm lg:safe-px-lg mx-auto w-full max-w-5xl flex-1 pt-8 sm:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
