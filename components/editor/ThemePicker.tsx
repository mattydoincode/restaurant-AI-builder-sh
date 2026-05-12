"use client";

import { useState } from "react";
import { Check, ChevronDown, Sun, Moon, RotateCcw, Palette } from "lucide-react";
import { useStore } from "@/lib/store";
import { THEMES, type ThemePreset, type ThemeMode } from "@/lib/schema";
import { DEFAULT_MODE_FOR_PRESET, getPalette } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PRESET_META: Record<
  ThemePreset,
  { label: string; desc: string }
> = {
  modernBistro: {
    label: "Modern Bistro",
    desc: "Dark, dramatic, fine-dining",
  },
  cozyCafe: {
    label: "Cozy Cafe",
    desc: "Warm, casual, neighborhood",
  },
  sunnyCoastal: {
    label: "Sunny Coastal",
    desc: "Bright, breezy, seaside",
  },
};

export function ThemePicker() {
  const theme = useStore((s) => s.data.theme);
  const patch = useStore((s) => s.patch);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const setPreset = (preset: ThemePreset) => {
    patch({
      theme: {
        preset,
        mode: DEFAULT_MODE_FOR_PRESET[preset],
        colors: theme.colors,
      },
    });
  };

  const setMode = (mode: ThemeMode) => {
    patch({ theme: { ...theme, mode } });
  };

  const setColor = (
    key: "primary" | "secondary" | "background" | "foreground",
    value: string,
  ) => {
    patch({
      theme: {
        ...theme,
        colors: { ...theme.colors, [key]: value },
      },
    });
  };

  const resetColors = () => {
    patch({ theme: { ...theme, colors: {} } });
  };

  const palette = getPalette(theme.preset, theme.mode);
  const customCount = Object.values(theme.colors ?? {}).filter(
    (v) => typeof v === "string" && v.trim() !== "",
  ).length;

  return (
    <div className="space-y-5">
      {/* Preset */}
      <section>
        <Label className="mb-2 block">Layout preset</Label>
        <div className="grid grid-cols-1 gap-2">
          {THEMES.map((t) => {
            const meta = PRESET_META[t];
            const active = theme.preset === t;
            const samplePalette = getPalette(
              t,
              theme.preset === t ? theme.mode : DEFAULT_MODE_FOR_PRESET[t],
            );
            return (
              <button
                key={t}
                type="button"
                onClick={() => setPreset(t)}
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
                    style={{ backgroundColor: samplePalette.bg }}
                  />
                  <div
                    className="w-1/3"
                    style={{ backgroundColor: samplePalette.accent }}
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
      </section>

      {/* Mode */}
      <section>
        <Label className="mb-2 block">Color mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <ModeButton
            active={theme.mode === "light"}
            onClick={() => setMode("light")}
            icon={<Sun className="h-3.5 w-3.5" />}
            label="Light"
          />
          <ModeButton
            active={theme.mode === "dark"}
            onClick={() => setMode("dark")}
            icon={<Moon className="h-3.5 w-3.5" />}
            label="Dark"
          />
        </div>
      </section>

      {/* Customize colors */}
      <section className="border border-stone-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setCustomizeOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          aria-expanded={customizeOpen}
        >
          <Palette className="h-3.5 w-3.5 text-stone-500" />
          <span className="flex-1 text-left">Customize colors</span>
          {customCount > 0 && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-600">
              {customCount} override{customCount === 1 ? "" : "s"}
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-stone-400 transition-transform",
              customizeOpen && "rotate-180",
            )}
          />
        </button>
        {customizeOpen && (
          <div className="border-t border-stone-200 p-3 space-y-2.5 animate-fade-in">
            <ColorRow
              label="Primary / accent"
              base={palette.accent}
              value={theme.colors?.primary}
              onChange={(v) => setColor("primary", v)}
            />
            <ColorRow
              label="Secondary / surface"
              base={palette.card}
              value={theme.colors?.secondary}
              onChange={(v) => setColor("secondary", v)}
            />
            <ColorRow
              label="Background"
              base={palette.bg}
              value={theme.colors?.background}
              onChange={(v) => setColor("background", v)}
            />
            <ColorRow
              label="Text"
              base={palette.fg}
              value={theme.colors?.foreground}
              onChange={(v) => setColor("foreground", v)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetColors}
              disabled={customCount === 0}
              className="w-full mt-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset to defaults
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 h-9 rounded-md border-2 text-sm font-medium transition-colors",
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ColorRow({
  label,
  base,
  value,
  onChange,
}: {
  label: string;
  base: string;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const effective = value && value.trim() ? value : base;
  const isOverridden = Boolean(value && value.trim());
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label={label}
        value={effective}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 rounded border border-stone-200 cursor-pointer bg-transparent"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-stone-700">{label}</p>
        <p className="text-[10px] text-stone-400 tabular-nums truncate">
          {effective}
          {!isOverridden && (
            <span className="ml-1 text-stone-400">(default)</span>
          )}
        </p>
      </div>
      {isOverridden && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-[10px] text-stone-400 hover:text-stone-700 underline underline-offset-2"
        >
          Reset
        </button>
      )}
    </div>
  );
}
