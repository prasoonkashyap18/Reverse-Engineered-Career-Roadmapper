import { cn } from "@/lib/utils/cn";

export interface SelectableOptionProps {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

/**
 * A single-select option rendered as a button, used for experience level,
 * timeline, weekly hours, and target-context category. The selected state
 * is communicated via aria-pressed + a visible border/background change,
 * never color alone.
 */
export function SelectableOption({
  label,
  description,
  selected,
  onSelect,
}: SelectableOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex min-h-[44px] w-full flex-col gap-1 rounded-lg border px-4 py-3 text-left transition-colors",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-surface hover:bg-surface-elevated",
      )}
    >
      <span className="flex items-center justify-between text-sm font-semibold text-foreground">
        {label}
        {selected && (
          <span aria-hidden className="text-primary">
            ✓
          </span>
        )}
      </span>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </button>
  );
}
