"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  open: string | null;
  toggle: (value: string) => void;
}
const Ctx = React.createContext<AccordionContextValue | null>(null);

export function Accordion({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen?: string;
}) {
  const [open, setOpen] = React.useState<string | null>(defaultOpen ?? null);
  const toggle = React.useCallback(
    (value: string) => setOpen((cur) => (cur === value ? null : value)),
    [],
  );
  return <Ctx.Provider value={{ open, toggle }}>{children}</Ctx.Provider>;
}

export function AccordionItem({
  value,
  title,
  children,
  meta,
}: {
  value: string;
  title: React.ReactNode;
  children: React.ReactNode;
  meta?: React.ReactNode;
}) {
  const ctx = React.useContext(Ctx);
  if (!ctx) return null;
  const isOpen = ctx.open === value;
  return (
    <div className="border-b border-stone-200 last:border-b-0">
      <button
        type="button"
        onClick={() => ctx.toggle(value)}
        className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-stone-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-stone-500 flex-shrink-0 transition-transform",
              isOpen && "rotate-180",
            )}
          />
          <span className="font-medium text-sm text-stone-900 truncate">
            {title}
          </span>
        </div>
        {meta && <div className="text-xs text-stone-500 ml-2">{meta}</div>}
      </button>
      {isOpen && (
        <div className="pb-4 px-1 animate-fade-in">{children}</div>
      )}
    </div>
  );
}
