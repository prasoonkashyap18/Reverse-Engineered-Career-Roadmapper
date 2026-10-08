"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "@/components/ui/Button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </Button>

      {open && (
        <nav
          id="mobile-nav-menu"
          aria-label="Primary"
          className="absolute inset-x-0 top-16 flex flex-col gap-2 border-b border-border bg-background p-4"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-surface"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/onboarding"
            className={buttonVariants({ className: "mt-2 justify-center" })}
            onClick={() => setOpen(false)}
          >
            Build My Roadmap
          </Link>
        </nav>
      )}
    </div>
  );
}
