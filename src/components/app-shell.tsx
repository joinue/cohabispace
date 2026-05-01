"use client";

import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function AppShell({
  sidebar,
  topBarLeft,
  topBarRight,
  children,
}: {
  sidebar: React.ReactNode;
  topBarLeft: React.ReactNode;
  topBarRight: React.ReactNode;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-svh">
      {/* Desktop sidebar */}
      <aside className="bg-muted/20 hidden w-60 shrink-0 border-r md:flex md:flex-col">
        {sidebar}
      </aside>

      {/* Mobile sidebar (drawer) */}
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
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-2.5 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon aria-hidden="true" />
            </Button>
            {topBarLeft}
          </div>
          <div className="flex items-center gap-1">{topBarRight}</div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
