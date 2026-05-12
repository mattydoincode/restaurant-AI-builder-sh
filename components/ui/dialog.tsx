"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  title,
  description,
}: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = original;
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "dialog-title" : undefined}
    >
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin animate-slide-up",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-stone-100 text-stone-500"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {(title || description) && (
          <div className="px-6 pt-6 pb-2 border-b border-stone-100">
            {title && (
              <h2
                id="dialog-title"
                className="text-lg font-semibold text-stone-900"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-stone-500 mt-1">{description}</p>
            )}
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
