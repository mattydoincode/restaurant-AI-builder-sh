import type {
  ThemeColors,
  ThemeConfig,
  ThemeMode,
  ThemePreset,
} from "./schema";

export interface ThemePalette {
  /** Background */
  bg: string;
  /** Foreground / text */
  fg: string;
  /** Secondary text */
  muted: string;
  /** Accent / highlight */
  accent: string;
  /** Card / surface */
  card: string;
  /** Border lines */
  border: string;
  /** Display font stack */
  fontDisplay: string;
  /** Body font stack */
  fontBody: string;
}

const SERIF = `"Playfair Display", Georgia, serif`;
const GEORGIA = `Georgia, "Times New Roman", serif`;
const SANS = `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;

/** Per-preset palettes for both light and dark modes. */
const PALETTES: Record<ThemePreset, Record<ThemeMode, ThemePalette>> = {
  modernBistro: {
    dark: {
      bg: "#0f0f0e",
      fg: "#f5f5f4",
      muted: "#a8a29e",
      accent: "#d4af37",
      card: "#1c1c1b",
      border: "#292524",
      fontDisplay: SERIF,
      fontBody: SANS,
    },
    light: {
      bg: "#faf9f6",
      fg: "#1c1917",
      muted: "#57534e",
      accent: "#b8860b",
      card: "#ffffff",
      border: "#e7e5e4",
      fontDisplay: SERIF,
      fontBody: SANS,
    },
  },
  cozyCafe: {
    light: {
      bg: "#fdf8f3",
      fg: "#2c1810",
      muted: "#78716c",
      accent: "#c2410c",
      card: "#ffffff",
      border: "#f5e6d3",
      fontDisplay: GEORGIA,
      fontBody: SANS,
    },
    dark: {
      bg: "#1f1611",
      fg: "#fdf8f3",
      muted: "#d6c5b0",
      accent: "#f59e0b",
      card: "#2a1d14",
      border: "#3d2a1c",
      fontDisplay: GEORGIA,
      fontBody: SANS,
    },
  },
  sunnyCoastal: {
    light: {
      bg: "#f0f9ff",
      fg: "#0c2231",
      muted: "#475569",
      accent: "#0ea5e9",
      card: "#ffffff",
      border: "#bae6fd",
      fontDisplay: GEORGIA,
      fontBody: SANS,
    },
    dark: {
      bg: "#0a1929",
      fg: "#e0f2fe",
      muted: "#94a3b8",
      accent: "#38bdf8",
      card: "#11243a",
      border: "#1e3a5f",
      fontDisplay: GEORGIA,
      fontBody: SANS,
    },
  },
};

export function getPalette(
  preset: ThemePreset,
  mode: ThemeMode,
): ThemePalette {
  return PALETTES[preset][mode];
}

/** Default mode for each preset when migrating from the legacy string enum. */
export const DEFAULT_MODE_FOR_PRESET: Record<ThemePreset, ThemeMode> = {
  modernBistro: "dark",
  cozyCafe: "light",
  sunnyCoastal: "light",
};

/** Test whether a string looks like a valid CSS color value. */
function isValidColor(value: string | undefined): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  // Accept #rgb / #rrggbb (with optional alpha), rgb()/rgba(), hsl()/hsla(),
  // and a handful of named colors via a permissive regex. Anything funky just
  // gets ignored.
  return /^#[0-9a-fA-F]{3,8}$/.test(trimmed) ||
    /^(rgb|hsl)a?\(/i.test(trimmed) ||
    /^[a-zA-Z]+$/.test(trimmed);
}

function overrideColor(
  base: string,
  override: string | undefined,
): string {
  return isValidColor(override) ? override : base;
}

/**
 * Resolve the final CSS var map to apply at the preview root.
 *
 * Starts from `PALETTES[preset][mode]`, then overrides individual slots with
 * the user's custom colors (skipping malformed/empty values).
 */
export function resolveThemeVars(
  theme: ThemeConfig,
): React.CSSProperties {
  const palette = getPalette(theme.preset, theme.mode);
  const colors: ThemeColors = theme.colors ?? {};

  const accent = overrideColor(palette.accent, colors.primary);
  const card = overrideColor(palette.card, colors.secondary);
  const bg = overrideColor(palette.bg, colors.background);
  const fg = overrideColor(palette.fg, colors.foreground);

  return {
    // Cast to React.CSSProperties via index signature
    ["--t-bg" as never]: bg,
    ["--t-fg" as never]: fg,
    ["--t-muted" as never]: palette.muted,
    ["--t-accent" as never]: accent,
    ["--t-card" as never]: card,
    ["--t-border" as never]: palette.border,
    ["--t-font-display" as never]: palette.fontDisplay,
    ["--t-font-body" as never]: palette.fontBody,
  };
}
