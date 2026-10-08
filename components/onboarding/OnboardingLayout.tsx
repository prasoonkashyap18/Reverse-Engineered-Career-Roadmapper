import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BackgroundField } from "@/components/landing/BackgroundField";

/**
 * Calmer, more focused shell than MarketingLayout: just a wordmark (no
 * full nav, no footer) so the wizard stays the only thing to look at.
 */
export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <BackgroundField />
      <header className="px-4 py-6 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </Link>
      </header>
      <main className="flex flex-1 flex-col px-4 pb-16 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
