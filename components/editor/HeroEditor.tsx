"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { STOCK_HERO_IMAGES } from "@/lib/sample";
import { PRICE_LEVELS } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

export function HeroEditor() {
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patch);
  const [showStock, setShowStock] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Restaurant Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Pizzeria Lina"
        />
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          value={data.tagline}
          onChange={(e) => patch({ tagline: e.target.value })}
          placeholder="Wood-fired pies, all night long"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="cuisine">Cuisine</Label>
          <Input
            id="cuisine"
            value={data.cuisine}
            onChange={(e) => patch({ cuisine: e.target.value })}
            placeholder="Neapolitan Italian"
          />
        </div>
        <div>
          <Label htmlFor="price">Price Level</Label>
          <div className="flex gap-1">
            {PRICE_LEVELS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => patch({ priceLevel: p })}
                className={cn(
                  "flex-1 h-9 rounded-md border text-sm font-medium transition-colors",
                  data.priceLevel === p
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-600 hover:bg-stone-50",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="mb-0">Hero Image URL</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowStock((v) => !v)}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            {showStock ? "Hide stock photos" : "Use stock photo"}
          </Button>
        </div>
        <Input
          value={data.heroImageUrl}
          onChange={(e) => patch({ heroImageUrl: e.target.value })}
          placeholder="https://images.unsplash.com/..."
        />
        {showStock && (
          <div className="grid grid-cols-3 gap-2 mt-2 animate-fade-in">
            {STOCK_HERO_IMAGES.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => {
                  patch({ heroImageUrl: url });
                  setShowStock(false);
                }}
                className={cn(
                  "relative aspect-video overflow-hidden rounded-md border-2 transition-colors",
                  data.heroImageUrl === url
                    ? "border-brand-500"
                    : "border-transparent hover:border-stone-300",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Stock photo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
