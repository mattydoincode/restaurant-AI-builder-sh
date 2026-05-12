"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Loader2, Wand2, Scissors, BookOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAIEnabled } from "@/lib/useAIEnabled";
import { cn } from "@/lib/utils";

type FieldKind =
  | "tagline"
  | "story"
  | "dish_name"
  | "dish_description"
  | "chef"
  | "section_name";

type Action = "improve" | "shorten" | "more_descriptive" | "generate";

interface AIAssistButtonProps {
  fieldKind: FieldKind;
  current: string;
  onResult: (value: string) => void;
  dishName?: string;
  className?: string;
}

const ACTION_META: Record<
  Action,
  { label: string; icon: React.ReactNode; description: string }
> = {
  improve: {
    label: "Improve",
    icon: <Wand2 className="h-3.5 w-3.5" />,
    description: "Polish the existing copy",
  },
  shorten: {
    label: "Shorten",
    icon: <Scissors className="h-3.5 w-3.5" />,
    description: "Make it tighter",
  },
  more_descriptive: {
    label: "More descriptive",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    description: "Add evocative detail",
  },
  generate: {
    label: "Generate fresh",
    icon: <Plus className="h-3.5 w-3.5" />,
    description: "Start from scratch",
  },
};

export function AIAssistButton({
  fieldKind,
  current,
  onResult,
  dishName,
  className,
}: AIAssistButtonProps) {
  const aiEnabled = useAIEnabled();
  const data = useStore((s) => s.data);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<Action | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [open]);

  const runAction = async (action: Action) => {
    setLoading(action);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldKind,
          current,
          action,
          context: {
            restaurantName: data.name,
            cuisine: data.cuisine,
            vibe: data.tagline,
            dishName,
          },
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const errMsg =
          typeof errBody?.error === "string"
            ? errBody.error
            : `AI request failed (${res.status})`;
        toast.error(errMsg);
        return;
      }
      const json = await res.json();
      const value = typeof json?.value === "string" ? json.value : "";
      if (!value) {
        toast.error("AI returned an empty result");
        return;
      }
      onResult(value);
      toast.success("Updated with AI suggestion");
      setOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`AI request failed: ${msg}`);
    } finally {
      setLoading(null);
    }
  };

  if (!aiEnabled) {
    return (
      <button
        type="button"
        disabled
        title="Set OPENAI_API_KEY to enable AI assistance"
        aria-label="AI assist (disabled)"
        className={cn(
          "p-1.5 rounded-md text-stone-300 cursor-not-allowed",
          className,
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="AI assist"
        title="AI assist"
        aria-expanded={open}
        className={cn(
          "p-1.5 rounded-md text-brand-500 hover:text-brand-600 hover:bg-brand-50 transition-colors",
          open && "bg-brand-50 text-brand-600",
          className,
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 z-40 min-w-[200px] bg-white rounded-lg shadow-xl ring-1 ring-stone-200 py-1 animate-fade-in"
        >
          {(Object.keys(ACTION_META) as Action[]).map((action) => {
            const meta = ACTION_META[action];
            const isLoading = loading === action;
            const disabled = loading !== null;
            const hideForEmpty =
              !current.trim() && action !== "generate";
            if (hideForEmpty) return null;
            return (
              <button
                key={action}
                type="button"
                role="menuitem"
                disabled={disabled}
                onClick={() => runAction(action)}
                className={cn(
                  "flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-stone-50 disabled:opacity-50",
                )}
              >
                <span className="mt-0.5 text-brand-500 flex-shrink-0">
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    meta.icon
                  )}
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="font-medium text-stone-900">
                    {meta.label}
                  </span>
                  <span className="text-xs text-stone-500">
                    {meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
