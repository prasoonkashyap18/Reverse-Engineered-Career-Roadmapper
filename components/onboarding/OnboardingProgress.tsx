import { cn } from "@/lib/utils/cn";

export interface OnboardingProgressProps {
  currentIndex: number;
  totalSteps: number;
  stepLabel: string;
}

/**
 * Segmented progress bar: one filled segment per completed/current step.
 * The numeric "NN / NN" plus step label carry the same information in text,
 * so screen readers and reduced-motion users aren't relying on color alone.
 */
export function OnboardingProgress({
  currentIndex,
  totalSteps,
  stepLabel,
}: OnboardingProgressProps) {
  return (
    <div
      role="group"
      aria-label={`Step ${currentIndex + 1} of ${totalSteps}: ${stepLabel}`}
      className="flex flex-col gap-3 pb-10 pt-4"
    >
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>
          {String(currentIndex + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
        </span>
        <span className="text-foreground">{stepLabel}</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-surface transition-colors duration-300",
              i <= currentIndex && "bg-primary",
            )}
          />
        ))}
      </div>
    </div>
  );
}
