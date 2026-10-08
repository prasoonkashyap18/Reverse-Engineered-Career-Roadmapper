"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Minimal accessible modal built on the native <dialog> element, which
 * provides focus trapping, Escape-to-close, and a backdrop for free.
 */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="dialog-title"
      className={cn(
        "rounded-lg border border-border bg-surface-elevated p-6 text-foreground backdrop:bg-black/60",
        className,
      )}
    >
      <h2 id="dialog-title" className="text-lg font-semibold">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
