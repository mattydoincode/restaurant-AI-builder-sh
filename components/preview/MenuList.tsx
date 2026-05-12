"use client";

import { cn } from "@/lib/utils";

/**
 * Shared wrapper for menu items used by all themes.
 *
 * - Desktop: vertical flex column.
 * - Mobile (< md): horizontal CSS scroll-snap carousel, one card visible at a
 *   time, native swipe gesture, no JS.
 *
 * Children should add `max-md:min-w-[85%] max-md:snap-start` to opt-in.
 * Use the `dishCardClass` helper for that.
 */
export function MenuList({
  children,
  className,
  desktopGap = "gap-5",
}: {
  children: React.ReactNode;
  className?: string;
  desktopGap?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        desktopGap,
        "max-md:flex-row max-md:overflow-x-auto max-md:overflow-y-hidden max-md:snap-x max-md:snap-mandatory",
        "max-md:gap-4 max-md:-mx-6 max-md:px-6 max-md:pb-2",
        "scrollbar-thin",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const dishCardClass = "max-md:min-w-[85%] max-md:snap-start";
