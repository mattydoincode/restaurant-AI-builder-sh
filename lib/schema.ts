import { z } from "zod";

export const SCHEMA_VERSION = 2;

export const DIETARY_TAGS = ["V", "VG", "GF", "DF", "Spicy"] as const;
export const DietaryTag = z.enum(DIETARY_TAGS);
export type DietaryTag = z.infer<typeof DietaryTag>;

export const PRICE_LEVELS = ["$", "$$", "$$$", "$$$$"] as const;
export const PriceLevel = z.enum(PRICE_LEVELS);
export type PriceLevel = z.infer<typeof PriceLevel>;

export const THEMES = ["modernBistro", "cozyCafe", "sunnyCoastal"] as const;
export const ThemePreset = z.enum(THEMES);
export type ThemePreset = z.infer<typeof ThemePreset>;

export const THEME_MODES = ["light", "dark"] as const;
export const ThemeMode = z.enum(THEME_MODES);
export type ThemeMode = z.infer<typeof ThemeMode>;

export const ThemeColors = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  background: z.string().optional(),
  foreground: z.string().optional(),
});
export type ThemeColors = z.infer<typeof ThemeColors>;

export const ThemeConfig = z.object({
  preset: ThemePreset.default("modernBistro"),
  mode: ThemeMode.default("light"),
  colors: ThemeColors.default({}),
});
export type ThemeConfig = z.infer<typeof ThemeConfig>;

/**
 * Accepts the new ThemeConfig OR the legacy string enum (back-compat for
 * existing localStorage payloads). Always emits a ThemeConfig.
 */
export const ThemeField = z.preprocess((v) => {
  if (typeof v === "string") {
    const valid = THEMES.includes(v as ThemePreset);
    return {
      preset: valid ? v : "modernBistro",
      mode: v === "modernBistro" ? "dark" : "light",
      colors: {},
    };
  }
  return v;
}, ThemeConfig);

export const DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;
export const Day = z.enum(DAYS);
export type Day = z.infer<typeof Day>;

export const MenuItem = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().default(""),
  price: z.string().default(""),
  tags: z.array(DietaryTag).default([]),
  imageUrl: z.string().default(""),
  gallery: z.array(z.string()).max(6).default([]),
  chef: z.string().default(""),
});
export type MenuItem = z.infer<typeof MenuItem>;

export const MenuSection = z.object({
  id: z.string(),
  name: z.string().min(1, "Section name is required"),
  items: z.array(MenuItem).default([]),
});
export type MenuSection = z.infer<typeof MenuSection>;

export const Hours = z.object({
  day: Day,
  open: z.string().default("11:00"),
  close: z.string().default("22:00"),
  closed: z.boolean().default(false),
});
export type Hours = z.infer<typeof Hours>;

export const Contact = z.object({
  phone: z.string().default(""),
  email: z.string().default(""),
  address: z.string().default(""),
  mapsUrl: z.string().default(""),
  instagram: z.string().default(""),
});
export type Contact = z.infer<typeof Contact>;

export const RestaurantData = z.object({
  name: z.string().default(""),
  tagline: z.string().default(""),
  story: z.string().default(""),
  cuisine: z.string().default(""),
  priceLevel: PriceLevel.default("$$"),
  heroImageUrl: z.string().default(""),
  gallery: z.array(z.string()).max(8).default([]),
  menu: z.array(MenuSection).default([]),
  hours: z.array(Hours).default([]),
  contact: Contact.default({
    phone: "",
    email: "",
    address: "",
    mapsUrl: "",
    instagram: "",
  }),
  theme: ThemeField.default({
    preset: "modernBistro",
    mode: "dark",
    colors: {},
  }),
  recentImageUrls: z.array(z.string()).max(20).default([]),
});
export type RestaurantData = z.infer<typeof RestaurantData>;

export const PersistedState = z.object({
  schemaVersion: z.number(),
  data: RestaurantData,
});
export type PersistedState = z.infer<typeof PersistedState>;

export function safeParseData(raw: unknown): RestaurantData | null {
  const result = RestaurantData.safeParse(raw);
  return result.success ? result.data : null;
}
