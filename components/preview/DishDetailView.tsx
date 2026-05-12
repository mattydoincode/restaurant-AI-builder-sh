"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ChefHat, ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImg } from "./SafeImg";
import { formatPrice, cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/schema";

interface DishDetailViewProps {
  item: MenuItem;
  sectionName?: string;
  onBack: () => void;
}

export function DishDetailView({
  item,
  sectionName,
  onBack,
}: DishDetailViewProps) {
  const images = useMemo(() => {
    const list: string[] = [];
    if (item.imageUrl) list.push(item.imageUrl);
    for (const g of item.gallery) {
      if (g && !list.includes(g)) list.push(g);
    }
    return list;
  }, [item.imageUrl, item.gallery]);

  const [active, setActive] = useState(0);
  const safeActive = images.length > 0 ? Math.min(active, images.length - 1) : 0;

  const goPrev = () => setActive((i) => (i <= 0 ? images.length - 1 : i - 1));
  const goNext = () => setActive((i) => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-full bg-[var(--t-bg)] text-[var(--t-fg)]">
      <header className="sticky top-0 z-10 backdrop-blur bg-[var(--t-bg)]/85 border-b border-[var(--t-border)]">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--t-fg)] hover:text-[var(--t-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--t-accent)] rounded px-1.5 py-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to menu
          </button>
          {sectionName && (
            <span className="text-xs uppercase tracking-wider text-[var(--t-muted)]">
              {sectionName}
            </span>
          )}
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {images.length > 0 ? (
          <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[var(--t-card)] ring-1 ring-[var(--t-border)]">
              <SafeImg
                src={images[safeActive]!}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
                fallbackClassName="absolute inset-0 w-full h-full"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
                {images.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={cn(
                      "relative w-20 aspect-[16/10] flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors",
                      idx === safeActive
                        ? "border-[var(--t-accent)]"
                        : "border-transparent opacity-60 hover:opacity-100",
                    )}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <SafeImg
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      fallbackClassName="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/10] w-full rounded-2xl bg-[var(--t-card)] ring-1 ring-[var(--t-border)] flex items-center justify-center text-[var(--t-muted)]">
            <span className="text-sm">No images yet</span>
          </div>
        )}

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              {item.name || "Untitled dish"}
            </h1>
            {item.price && (
              <span
                className="text-2xl font-semibold text-[var(--t-accent)] tabular-nums"
                style={{ fontFamily: "var(--t-font-display)" }}
              >
                {formatPrice(item.price)}
              </span>
            )}
          </div>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--t-accent)]/10 text-[var(--t-accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {item.chef && (
          <div className="flex items-center gap-2 text-sm text-[var(--t-muted)]">
            <ChefHat className="h-4 w-4 text-[var(--t-accent)]" />
            <span>
              Crafted by <span className="font-medium text-[var(--t-fg)]">{item.chef}</span>
            </span>
          </div>
        )}

        {item.description && (
          <p className="text-base leading-relaxed text-[var(--t-muted)] whitespace-pre-line">
            {item.description}
          </p>
        )}
      </article>
    </div>
  );
}
