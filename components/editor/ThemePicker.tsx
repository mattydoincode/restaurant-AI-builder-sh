"use client";

import { useStore } from "@/lib/store";
import { THEMES, type Theme } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const THEME_META: Record<
  Theme,
  { label: string; desc: string; preview: { bg: string; fg: string; accent: string } }
> = {
  modernBistro: {
    label: "Modern Bistro",
    desc: "Dark, dramatic, fine-dining",
    preview: { bg: "#0f0f0e", fg: "#f5f5f4", accent: "#d4af37" },
  },
  cozyCafe: {
    label: "Cozy Cafe",
    desc: "Warm, casual, neighborhood",
    preview: { bg: "#fdf8f3", fg: "#2c1810", accent: "#c2410c" },
  },
  sunnyCoastal: {
    label: "Sunny Coastal",
    desc: "Bright, breezy, seaside",
    preview: { bg: "#f0f9ff", fg: "#0c2231", accent: "#0ea5e9" },
  },
};

export function ThemePicker() {
  const theme = useStore((s) => s.data.theme);
  const patch = useStore((s) => s.patch);

  return (
    <div className="grid grid-cols-1 gap-2">
      {THEMES.map((t) => {
        const meta = THEME_META[t];
        const active = theme === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => patch({ theme: t })}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg border-2 transition-all text-left",
              active
                ? "border-stone-900 bg-stone-50"
                : "border-stone-200 hover:border-stone-300 bg-white",
            )}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-md border border-stone-200 overflow-hidden flex"
              aria-hidden="true"
            >
              <div
                className="flex-1"
                style={{ backgroundColor: meta.preview.bg }}
              />
              <div
                className="w-1/3"
                style={{ backgroundColor: meta.preview.accent }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-stone-900">
                {meta.label}
              </p>
              <p className="text-xs text-stone-500 truncate">{meta.desc}</p>
            </div>
            {active && (
              <Check className="h-4 w-4 text-stone-900 flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
