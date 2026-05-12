"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResolvedImage } from "@/lib/useResolvedImage";

interface SafeImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackClassName?: string;
}

export function SafeImg({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: SafeImgProps) {
  const resolved = useResolvedImage(src);
  const [imgError, setImgError] = useState(false);

  if (resolved.loading) {
    return (
      <div
        className={cn(
          "animate-pulse bg-stone-200/50",
          fallbackClassName ?? className,
        )}
        aria-label={alt}
        aria-busy="true"
      />
    );
  }

  if (!resolved.url || resolved.error || imgError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-stone-100 text-stone-300",
          fallbackClassName ?? className,
        )}
        aria-label={alt}
      >
        <ImageOff className="h-6 w-6" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved.url}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
      {...props}
    />
  );
}
