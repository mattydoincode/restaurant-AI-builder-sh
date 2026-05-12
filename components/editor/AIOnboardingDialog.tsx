"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { RestaurantData } from "@/lib/schema";

interface AIOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiEnabled: boolean;
}

const EXAMPLES = [
  { cuisine: "Tapas bar", vibe: "Romantic, candlelit", city: "Lisbon" },
  { cuisine: "Korean BBQ", vibe: "Loud, fun, late-night", city: "Brooklyn" },
  { cuisine: "Farm-to-table", vibe: "Bright, seasonal", city: "Portland, OR" },
];

export function AIOnboardingDialog({
  open,
  onOpenChange,
  aiEnabled,
}: AIOnboardingDialogProps) {
  const setData = useStore((s) => s.setData);
  const [cuisine, setCuisine] = useState("");
  const [vibe, setVibe] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!cuisine.trim()) {
      toast.error("Tell me the cuisine or concept first");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuisine: cuisine.trim(),
          vibe: vibe.trim() || undefined,
          city: city.trim() || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "AI generation failed");
        return;
      }
      const parsed = RestaurantData.safeParse(body.data);
      if (!parsed.success) {
        toast.error("AI returned an unexpected shape. Please try again.");
        return;
      }
      setData(parsed.data);
      toast.success("Restaurant generated! Edit anything you like.");
      onOpenChange(false);
      setCuisine("");
      setVibe("");
      setCity("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Network error - please try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Generate with AI"
      description="Describe your concept and we'll draft the entire site. You can edit anything afterward."
    >
      {!aiEnabled && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs text-amber-900">
            <strong>AI is not configured.</strong> Set{" "}
            <code className="bg-amber-100 px-1 rounded">OPENAI_API_KEY</code>{" "}
            in your environment to enable this feature.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="ai-cuisine">Cuisine or concept *</Label>
          <Input
            id="ai-cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="e.g. Neapolitan pizza, ramen shop, taco truck"
            disabled={loading || !aiEnabled}
          />
        </div>
        <div>
          <Label htmlFor="ai-vibe">Vibe (optional)</Label>
          <Input
            id="ai-vibe"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="Cozy and warm / sleek and minimal / loud and fun"
            disabled={loading || !aiEnabled}
          />
        </div>
        <div>
          <Label htmlFor="ai-city">City or neighborhood (optional)</Label>
          <Input
            id="ai-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Austin, TX"
            disabled={loading || !aiEnabled}
          />
        </div>

        <div className="pt-1">
          <p className="text-xs text-stone-500 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.cuisine}
                type="button"
                onClick={() => {
                  setCuisine(ex.cuisine);
                  setVibe(ex.vibe);
                  setCity(ex.city);
                }}
                disabled={loading || !aiEnabled}
                className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-50"
              >
                {ex.cuisine} · {ex.city}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand"
            className="flex-1"
            onClick={handleGenerate}
            disabled={loading || !aiEnabled || !cuisine.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
