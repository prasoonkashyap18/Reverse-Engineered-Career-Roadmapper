import { TiltCard } from "@/components/interactions/TiltCard";
import { Badge } from "@/components/ui/Badge";

const FEATURES = [
  {
    id: "interactive",
    badge: "Interactive",
    title: "A roadmap you can explore, not a list you scroll past",
    description:
      "Zoom, pan, and click through your plan as a connected graph — skills, projects, and milestones laid out in the order they actually unlock.",
  },
  {
    id: "personalized",
    badge: "Personalized",
    title: "Built around what you already know",
    description:
      "Mark the skills you already have and the amount of time you can commit each week. The plan adjusts instead of restarting from zero.",
  },
  {
    id: "actionable",
    badge: "Actionable",
    title: "Every node tells you what to actually do",
    description:
      "Click a milestone for a concrete next action — not generic advice, a specific step grounded in your roadmap.",
  },
] as const;

export function FeatureSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <TiltCard key={feature.id} className="flex h-full flex-col gap-4 p-6">
              <Badge variant="primary" className="w-fit">
                {feature.badge}
              </Badge>
              <h3 className="text-xl font-semibold leading-snug text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
