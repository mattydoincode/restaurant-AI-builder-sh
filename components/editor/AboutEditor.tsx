"use client";

import { useStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIAssistButton } from "./AIAssistButton";

export function AboutEditor() {
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patch);

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="story" className="mb-0">
            Your Story
          </Label>
          <AIAssistButton
            fieldKind="story"
            current={data.story}
            onResult={(value) => patch({ story: value })}
          />
        </div>
        <Textarea
          id="story"
          value={data.story}
          onChange={(e) => patch({ story: e.target.value })}
          placeholder="Tell guests what makes your restaurant special - your origin, your philosophy, your team..."
          rows={6}
        />
        <p className="text-xs text-stone-500 mt-1">
          {data.story.length} characters
        </p>
      </div>
    </div>
  );
}
