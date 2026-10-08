import type { ReactNode } from "react";
import { Header } from "./Header";

/**
 * Layout foundation for the authenticated/app experience (roadmap,
 * dashboard). Later steps may add a sidebar here.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
