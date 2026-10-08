import { TiltCard } from "@/components/interactions/TiltCard";

const STEPS = [
  {
    id: "destination",
    title: "Destination",
    description:
      "Tell CareerForge exactly where you want to end up — a specific role, industry, and context, not a vague category.",
  },
  {
    id: "path",
    title: "Path",
    description:
      "CareerForge breaks that destination into phases: the skills, projects, certifications, and milestones that lead there.",
  },
  {
    id: "adaptation",
    title: "Adaptation",
    description:
      "As you learn, the path changes with you. Mark a skill as known and the roadmap ahead replans around it.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your career is a destination. Build the route.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            CareerForge works in three steps — from a single goal to a living
            plan.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.id}>
              <TiltCard className="group h-full p-6">
                <span className="text-sm font-mono text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </TiltCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
