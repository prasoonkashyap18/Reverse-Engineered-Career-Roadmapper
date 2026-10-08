import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/onboarding" className={buttonVariants({ size: "sm" })}>
            Build My Roadmap
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
