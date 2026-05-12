"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DAYS, type Hours } from "@/lib/schema";
import { cn } from "@/lib/utils";

const DEFAULT_HOURS: Hours[] = DAYS.map((day) => ({
  day,
  open: "11:00",
  close: "22:00",
  closed: false,
}));

export function HoursEditor() {
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patch);

  const hours = data.hours.length > 0 ? data.hours : [];

  const ensureHours = () => {
    if (hours.length === 0) patch({ hours: DEFAULT_HOURS });
  };

  const updateDay = (day: string, change: Partial<Hours>) => {
    patch({
      hours: hours.map((h) => (h.day === day ? { ...h, ...change } : h)),
    });
  };

  if (hours.length === 0) {
    return (
      <div className="text-center py-6 px-4 border-2 border-dashed border-stone-200 rounded-lg">
        <p className="text-sm text-stone-500 mb-3">
          No hours set yet.
        </p>
        <Button
          type="button"
          variant="brand"
          size="sm"
          onClick={ensureHours}
        >
          Add default hours
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {hours.map((h) => (
        <div
          key={h.day}
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md",
            h.closed && "opacity-50",
          )}
        >
          <span className="w-10 text-sm font-medium text-stone-700">
            {h.day}
          </span>
          <Input
            type="time"
            value={h.open}
            disabled={h.closed}
            onChange={(e) => updateDay(h.day, { open: e.target.value })}
            className="flex-1 text-xs"
          />
          <span className="text-stone-400 text-xs">to</span>
          <Input
            type="time"
            value={h.close}
            disabled={h.closed}
            onChange={(e) => updateDay(h.day, { close: e.target.value })}
            className="flex-1 text-xs"
          />
          <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={h.closed}
              onChange={(e) =>
                updateDay(h.day, { closed: e.target.checked })
              }
              className="rounded border-stone-300"
            />
            Closed
          </label>
        </div>
      ))}
    </div>
  );
}
