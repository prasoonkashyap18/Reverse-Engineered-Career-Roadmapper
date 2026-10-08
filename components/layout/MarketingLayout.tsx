import type { ReactNode } from "react";
import { Header } from "./Header";

/**
 * Layout foundation for marketing/landing pages (Step 2 builds the real page).
 */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
