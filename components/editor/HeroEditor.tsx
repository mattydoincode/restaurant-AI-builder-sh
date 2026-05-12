"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PRICE_LEVELS } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { ImageIcon, Pencil } from "lucide-react";
import { useState } from "react";
import { SafeImg } from "@/components/preview/SafeImg";
import { ImagePickerDialog } from "./ImagePickerDialog";
import { AIAssistButton } from "./AIAssistButton";

export function HeroEditor() {
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patch);
  const [pickerOpen, setPickerOpen] = useState(false);

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
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="tagline" className="mb-0">
            Tagline
          </Label>
          <AIAssistButton
            fieldKind="tagline"
            current={data.tagline}
            onResult={(value) => patch({ tagline: value })}
          />
        </div>
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
        <Label className="mb-1.5 block">Hero Image</Label>
        <div className="flex items-center gap-3">
          {data.heroImageUrl ? (
            <SafeImg
              src={data.heroImageUrl}
              alt="Hero"
              className="w-28 h-20 object-cover rounded-md border border-stone-200"
              fallbackClassName="w-28 h-20 rounded-md border border-stone-200"
            />
          ) : (
            <div className="w-28 h-20 rounded-md border border-dashed border-stone-300 flex items-center justify-center text-stone-400">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              {data.heroImageUrl ? "Change image" : "Choose image"}
            </Button>
            {data.heroImageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => patch({ heroImageUrl: "" })}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <ImagePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        value={data.heroImageUrl}
        onSelect={(src) => patch({ heroImageUrl: src })}
        title="Choose hero image"
      />
    </div>
  );
}
