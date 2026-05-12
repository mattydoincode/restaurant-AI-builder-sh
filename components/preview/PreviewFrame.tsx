"use client";

import { useState } from "react";
import { Smartphone, Monitor, Expand, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SitePreview } from "./SitePreview";
import type { RestaurantData } from "@/lib/schema";

interface PreviewFrameProps {
  data: RestaurantData;
  fullscreen: boolean;
  onFullscreenToggle: () => void;
}

export function PreviewFrame({
  data,
  fullscreen,
  onFullscreenToggle,
}: PreviewFrameProps) {
  const [viewport, setViewport] = useState<"mobile" | "desktop">("desktop");

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-40 bg-stone-100 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-stone-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-stone-500 font-mono">
              {data.name
                ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                : "your-restaurant"}
              .example.com
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onFullscreenToggle}
          >
            <Minimize className="h-3.5 w-3.5" />
            Exit visitor view
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <SitePreview data={data} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-stone-100">
      <div className="flex items-center justify-between px-3 py-2 border-b border-stone-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewport === "desktop"
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:bg-stone-100",
            )}
            aria-label="Desktop view"
            title="Desktop view"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewport === "mobile"
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:bg-stone-100",
            )}
            aria-label="Mobile view"
            title="Mobile view"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs text-stone-400 ml-2 hidden sm:block">
            Live preview
          </span>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onFullscreenToggle}
        >
          <Expand className="h-3.5 w-3.5" />
          View as visitor
        </Button>
      </div>

      <div className="flex-1 overflow-hidden bg-stone-200/60 p-2 md:p-4">
        <div
          className={cn(
            "h-full mx-auto bg-white shadow-lg rounded-lg overflow-y-auto scrollbar-thin transition-all duration-300",
            viewport === "mobile" ? "max-w-[390px]" : "max-w-none",
          )}
        >
          <SitePreview data={data} />
        </div>
      </div>
    </div>
  );
}
