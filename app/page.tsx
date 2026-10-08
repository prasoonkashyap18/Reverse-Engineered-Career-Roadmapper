import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/**
 * Temporary placeholder. The real landing page ships in Step 2.
 */
export default function Home() {
  return (
    <MarketingLayout>
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <Badge variant="primary">Step 1 — Foundation</Badge>
        <Card className="w-full text-left">
          <CardHeader>
            <CardTitle>CareerForge</CardTitle>
            <CardDescription>
              Project foundation is in place. The career-goal input, AI
              roadmap engine, and interactive graph ship in later steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See docs/DEVELOPMENT_ROADMAP.md for the full 12-step plan.
            </p>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
