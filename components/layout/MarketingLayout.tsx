import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Layout foundation for marketing/landing pages.
 */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
