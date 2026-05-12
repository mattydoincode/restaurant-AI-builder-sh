"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
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
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
