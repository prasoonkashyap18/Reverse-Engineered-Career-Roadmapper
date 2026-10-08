import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Magnetic } from "@/components/interactions/Magnetic";

export function FinalCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-lg border border-border bg-surface-elevated px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Stop guessing. Start routing.
        </h2>
        <p className="max-w-lg text-lg text-muted-foreground">
          Give CareerForge your dream role and get a roadmap built around it.
        </p>
        <Magnetic>
          <Link href="/onboarding" className={buttonVariants({ size: "lg" })}>
            Build My Roadmap
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
