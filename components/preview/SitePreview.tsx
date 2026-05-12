"use client";

import { Component, type ReactNode } from "react";
import type { RestaurantData } from "@/lib/schema";
import { ModernBistro } from "./themes/ModernBistro";
import { CozyCafe } from "./themes/CozyCafe";
import { SunnyCoastal } from "./themes/SunnyCoastal";

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

export function SitePreview({ data }: { data: RestaurantData }) {
  return (
    <PreviewErrorBoundary>
      {data.theme === "modernBistro" && <ModernBistro data={data} />}
      {data.theme === "cozyCafe" && <CozyCafe data={data} />}
      {data.theme === "sunnyCoastal" && <SunnyCoastal data={data} />}
    </PreviewErrorBoundary>
  );
}
