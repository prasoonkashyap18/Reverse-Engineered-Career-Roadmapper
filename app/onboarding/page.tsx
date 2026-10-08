import Link from "next/link";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

/**
 * Placeholder destination for the hero CTA. The real onboarding flow
 * (career goal input, profile capture) ships in Step 3.
 */
export default function OnboardingPlaceholder() {
  return (
    <MarketingLayout>
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <Card className="w-full text-left">
          <CardHeader>
            <CardTitle>Onboarding is coming in Step 3</CardTitle>
            <CardDescription>
              This is where you&apos;ll describe your dream role and
              CareerForge will start building your roadmap. That flow isn&apos;t
              built yet — this project is being developed step by step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
