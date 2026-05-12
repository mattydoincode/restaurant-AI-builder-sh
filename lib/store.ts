"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import {
  RestaurantData,
  SCHEMA_VERSION,
  type MenuItem,
  type MenuSection,
} from "./schema";
import { SAMPLE_RESTAURANT } from "./sample";
import { uid } from "./utils";

type Patch<T> = Partial<T> | ((prev: T) => Partial<T>);

interface StoreState {
  data: RestaurantData;

  setData: (data: RestaurantData) => void;
  patch: (patch: Patch<RestaurantData>) => void;
  reset: () => void;
  loadSample: () => void;

  addMenuSection: (name?: string) => void;
  removeMenuSection: (sectionId: string) => void;
  renameMenuSection: (sectionId: string, name: string) => void;

  addMenuItem: (sectionId: string, item?: Partial<MenuItem>) => void;
  updateMenuItem: (
    sectionId: string,
    itemId: string,
    patch: Partial<MenuItem>,
  ) => void;
  removeMenuItem: (sectionId: string, itemId: string) => void;

  reorderMenuSections: (fromIndex: number, toIndex: number) => void;
  reorderMenuItems: (
    sectionId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;

  pushRecentImageUrl: (url: string) => void;
}

function applyPatch<T>(prev: T, patch: Patch<T>): T {
  const change = typeof patch === "function" ? patch(prev) : patch;
  return { ...prev, ...change };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      data: SAMPLE_RESTAURANT,

      setData: (data) => set({ data }),
      patch: (p) => set({ data: applyPatch(get().data, p) }),
      reset: () =>
        set({
          data: {
            ...SAMPLE_RESTAURANT,
            name: "",
            tagline: "",
            story: "",
            cuisine: "",
            heroImageUrl: "",
            gallery: [],
            menu: [],
            contact: {
              phone: "",
              email: "",
              address: "",
              mapsUrl: "",
              instagram: "",
            },
          },
        }),
      loadSample: () => set({ data: SAMPLE_RESTAURANT }),

      addMenuSection: (name) => {
        const section: MenuSection = {
          id: uid("sec"),
          name: name ?? "New Section",
          items: [],
        };
        set({
          data: { ...get().data, menu: [...get().data.menu, section] },
        });
      },
      removeMenuSection: (sectionId) => {
        set({
          data: {
            ...get().data,
            menu: get().data.menu.filter((s) => s.id !== sectionId),
          },
        });
      },
      renameMenuSection: (sectionId, name) => {
        set({
          data: {
            ...get().data,
            menu: get().data.menu.map((s) =>
              s.id === sectionId ? { ...s, name } : s,
            ),
          },
        });
      },

      addMenuItem: (sectionId, item) => {
        const newItem: MenuItem = {
          id: uid("itm"),
          name: item?.name ?? "New Item",
          description: item?.description ?? "",
          price: item?.price ?? "",
          tags: item?.tags ?? [],
          imageUrl: item?.imageUrl ?? "",
          gallery: item?.gallery ?? [],
          chef: item?.chef ?? "",
        };
        set({
          data: {
            ...get().data,
            menu: get().data.menu.map((s) =>
              s.id === sectionId
                ? { ...s, items: [...s.items, newItem] }
                : s,
            ),
          },
        });
      },
      updateMenuItem: (sectionId, itemId, patch) => {
        set({
          data: {
            ...get().data,
            menu: get().data.menu.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    items: s.items.map((i) =>
                      i.id === itemId ? { ...i, ...patch } : i,
                    ),
                  }
                : s,
            ),
          },
        });
      },
      removeMenuItem: (sectionId, itemId) => {
        set({
          data: {
            ...get().data,
            menu: get().data.menu.map((s) =>
              s.id === sectionId
                ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
                : s,
            ),
          },
        });
      },

      reorderMenuSections: (fromIndex, toIndex) => {
        const menu = get().data.menu;
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= menu.length ||
          toIndex >= menu.length
        ) {
          return;
        }
        set({
          data: { ...get().data, menu: arrayMove(menu, fromIndex, toIndex) },
        });
      },
      reorderMenuItems: (sectionId, fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        set({
          data: {
            ...get().data,
            menu: get().data.menu.map((s) => {
              if (s.id !== sectionId) return s;
              if (
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex >= s.items.length ||
                toIndex >= s.items.length
              ) {
                return s;
              }
              return { ...s, items: arrayMove(s.items, fromIndex, toIndex) };
            }),
          },
        });
      },

      pushRecentImageUrl: (url) => {
        const trimmed = url.trim();
        if (!trimmed) return;
        const current = get().data.recentImageUrls ?? [];
        const deduped = [trimmed, ...current.filter((u) => u !== trimmed)];
        set({
          data: { ...get().data, recentImageUrls: deduped.slice(0, 20) },
        });
      },
    }),
    {
      name: "restaurant-builder:v1",
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ data: state.data }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("Persist rehydrate failed:", error);
        }
        if (state) {
          const parsed = RestaurantData.safeParse(state.data);
          if (!parsed.success) {
            state.data = SAMPLE_RESTAURANT;
          } else {
            state.data = parsed.data;
          }
        }
      },
      migrate: (persisted: unknown, _version): { data: RestaurantData } => {
        const fallback = { data: SAMPLE_RESTAURANT };
        if (!persisted || typeof persisted !== "object") return fallback;
        const maybeData = (persisted as { data?: unknown }).data;
        const parsed = RestaurantData.safeParse(maybeData);
        return parsed.success ? { data: parsed.data } : fallback;
      },
    },
  ),
);

/**
 * Returns true once the persisted store has been rehydrated from localStorage.
 * Use to gate UI that depends on user data, to avoid SSR/CSR mismatch.
 */
export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    const unsubFinish = useStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return () => {
      unsubFinish();
    };
  }, []);
  return hydrated;
}
