"use client";

import { Component, type ReactNode } from "react";
import type { MenuItem, RestaurantData } from "@/lib/schema";
import { resolveThemeVars } from "@/lib/theme";
import { ModernBistro } from "./themes/ModernBistro";
import { CozyCafe } from "./themes/CozyCafe";
import { SunnyCoastal } from "./themes/SunnyCoastal";
import { DishDetailView } from "./DishDetailView";

export type PreviewView = { kind: "home" } | { kind: "dish"; id: string };

class PreviewErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error("Preview crashed:", error);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-8 text-center bg-red-50 text-red-900 h-full flex flex-col items-center justify-center">
          <p className="font-semibold mb-2">Preview crashed</p>
          <p className="text-sm text-red-700">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface SitePreviewProps {
  data: RestaurantData;
  view?: PreviewView;
  onNavigate?: (view: PreviewView) => void;
}

export function SitePreview({
  data,
  view = { kind: "home" },
  onNavigate,
}: SitePreviewProps) {
  const themeStyle = resolveThemeVars(data.theme);

  return (
    <div style={themeStyle} className="min-h-full">
      <PreviewErrorBoundary>
        {view.kind === "dish" ? (
          <DishView data={data} id={view.id} onNavigate={onNavigate} />
        ) : (
          <HomeView data={data} onNavigate={onNavigate} />
        )}
      </PreviewErrorBoundary>
    </div>
  );
}

function DishView({
  data,
  id,
  onNavigate,
}: {
  data: RestaurantData;
  id: string;
  onNavigate?: (view: PreviewView) => void;
}) {
  let item: MenuItem | null = null;
  let sectionName: string | undefined;
  for (const section of data.menu) {
    const found = section.items.find((i) => i.id === id);
    if (found) {
      item = found;
      sectionName = section.name;
      break;
    }
  }
  if (!item) {
    return <HomeView data={data} onNavigate={onNavigate} />;
  }
  return (
    <DishDetailView
      item={item}
      sectionName={sectionName}
      onBack={() => onNavigate?.({ kind: "home" })}
    />
  );
}

function HomeView({
  data,
  onNavigate,
}: {
  data: RestaurantData;
  onNavigate?: (view: PreviewView) => void;
}) {
  const onDishClick = onNavigate
    ? (id: string) => onNavigate({ kind: "dish", id })
    : undefined;
  switch (data.theme.preset) {
    case "modernBistro":
      return <ModernBistro data={data} onDishClick={onDishClick} />;
    case "cozyCafe":
      return <CozyCafe data={data} onDishClick={onDishClick} />;
    case "sunnyCoastal":
      return <SunnyCoastal data={data} onDishClick={onDishClick} />;
    default:
      return <ModernBistro data={data} onDishClick={onDishClick} />;
  }
}
