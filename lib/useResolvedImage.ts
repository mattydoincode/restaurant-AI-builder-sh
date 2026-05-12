"use client";

import { useEffect, useState } from "react";
import { getImageBlob, isIdbRef } from "./imageStore";

interface ResolvedImage {
  url: string | null;
  loading: boolean;
  error: boolean;
}

/**
 * Resolves a possibly-idb-pseudo-URL into a real renderable URL.
 *
 * - If `src` is empty, returns `{ url: null, loading: false, error: false }`.
 * - If `src` is a normal URL (http(s)/data/blob), returns it unchanged.
 * - If `src` starts with `idb:`, fetches the Blob and yields an object URL,
 *   then revokes it on unmount / src change.
 */
export function useResolvedImage(src: string | undefined): ResolvedImage {
  const [state, setState] = useState<ResolvedImage>(() => {
    if (!src) return { url: null, loading: false, error: false };
    if (isIdbRef(src)) return { url: null, loading: true, error: false };
    return { url: src, loading: false, error: false };
  });

  useEffect(() => {
    if (!src) {
      setState({ url: null, loading: false, error: false });
      return;
    }
    if (!isIdbRef(src)) {
      setState({ url: src, loading: false, error: false });
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;
    setState({ url: null, loading: true, error: false });

    getImageBlob(src)
      .then((blob) => {
        if (cancelled) return;
        if (!blob) {
          setState({ url: null, loading: false, error: true });
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setState({ url: objectUrl, loading: false, error: false });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ url: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return state;
}
