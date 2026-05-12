"use client";

import { useEffect, useState } from "react";

/**
 * Hook that checks /api/ai/health once on mount to determine whether AI
 * features should be enabled in the UI. Soft-disables buttons when no key.
 */
export function useAIEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/health")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setEnabled(Boolean(d.enabled));
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return enabled;
}
