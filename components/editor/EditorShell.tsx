"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  RotateCcw,
  Download,
  ChefHat,
  Save,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { useStore, useStoreHydrated } from "@/lib/store";
import { useAIEnabled } from "@/lib/useAIEnabled";
import { HeroEditor } from "./HeroEditor";
import { AboutEditor } from "./AboutEditor";
import { MenuEditor } from "./MenuEditor";
import { HoursEditor } from "./HoursEditor";
import { ContactEditor } from "./ContactEditor";
import { ThemePicker } from "./ThemePicker";
import { AIOnboardingDialog } from "./AIOnboardingDialog";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { cn } from "@/lib/utils";

export function EditorShell() {
  const data = useStore((s) => s.data);
  const hydrated = useStoreHydrated();
  const reset = useStore((s) => s.reset);
  const loadSample = useStore((s) => s.loadSample);

  const [aiOpen, setAiOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(true);
  const aiEnabled = useAIEnabled();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = data.name
        ? `${data.name} · Restaurant Builder`
        : "Restaurant Builder";
    }
  }, [data.name]);

  if (!hydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <div className="flex items-center gap-2 text-stone-400 text-sm">
          <ChefHat className="h-5 w-5 animate-pulse text-brand-600" />
          Loading your restaurant...
        </div>
      </div>
    );
  }

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = data.name
        ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : "restaurant";
      a.download = `${slug}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Site config downloaded");
    } catch {
      toast.error("Export failed");
    }
  };

  const handleReset = () => {
    if (confirm("Clear all fields and start from a blank slate?")) {
      reset();
      toast.success("Reset to blank");
    }
  };

  const sectionCounts = {
    menu: data.menu.reduce((n, s) => n + s.items.length, 0),
    hours: data.hours.filter((h) => !h.closed).length,
    contact: [
      data.contact.address,
      data.contact.phone,
      data.contact.email,
      data.contact.instagram,
    ].filter(Boolean).length,
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setEditorOpen((v) => !v)}
              aria-label="Toggle editor"
            >
              {editorOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
            <ChefHat className="h-5 w-5 text-brand-600 flex-shrink-0" />
            <h1 className="font-semibold text-stone-900 text-sm sm:text-base truncate">
              Restaurant Builder
            </h1>
            {hydrated && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-stone-400 ml-2">
                <Save className="h-3 w-3" />
                Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="brand"
              size="sm"
              onClick={() => setAiOpen(true)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Generate with AI</span>
              <span className="sm:hidden">AI</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleExport}
              title="Export site config as JSON"
              aria-label="Export"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleReset}
              title="Reset to blank"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor pane */}
        <aside
          className={cn(
            "flex-shrink-0 w-full md:w-[420px] border-r border-stone-200 bg-white overflow-y-auto scrollbar-thin transition-all",
            !editorOpen && "hidden md:block",
          )}
        >
          <div className="p-4 space-y-1">
            {data.menu.length === 0 && !data.name && (
              <div className="mb-4 p-4 rounded-lg bg-gradient-to-br from-brand-50 to-amber-50 border border-brand-100">
                <p className="text-sm font-semibold text-stone-900 mb-1">
                  Start fast
                </p>
                <p className="text-xs text-stone-600 mb-3">
                  Generate a full site with AI, or load the sample restaurant.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="brand"
                    size="sm"
                    onClick={() => setAiOpen(true)}
                    className="flex-1"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Generate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadSample}
                    className="flex-1"
                  >
                    Load sample
                  </Button>
                </div>
              </div>
            )}

            <Accordion defaultOpen="hero">
              <AccordionItem value="hero" title="Hero & Identity">
                <HeroEditor />
              </AccordionItem>
              <AccordionItem value="about" title="About / Story">
                <AboutEditor />
              </AccordionItem>
              <AccordionItem
                value="menu"
                title="Menu"
                meta={
                  sectionCounts.menu > 0
                    ? `${sectionCounts.menu} items`
                    : undefined
                }
              >
                <MenuEditor />
              </AccordionItem>
              <AccordionItem
                value="hours"
                title="Hours"
                meta={
                  sectionCounts.hours > 0
                    ? `${sectionCounts.hours} open days`
                    : undefined
                }
              >
                <HoursEditor />
              </AccordionItem>
              <AccordionItem
                value="contact"
                title="Contact & Location"
                meta={
                  sectionCounts.contact > 0
                    ? `${sectionCounts.contact} fields`
                    : undefined
                }
              >
                <ContactEditor />
              </AccordionItem>
              <AccordionItem value="theme" title="Theme">
                <ThemePicker />
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        {/* Preview pane */}
        <main className={cn("flex-1 overflow-hidden", editorOpen && "hidden md:block")}>
          <PreviewFrame
            data={data}
            fullscreen={fullscreen}
            onFullscreenToggle={() => setFullscreen((v) => !v)}
          />
        </main>
      </div>

      <AIOnboardingDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        aiEnabled={aiEnabled}
      />
    </div>
  );
}
