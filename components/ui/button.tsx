"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm",
        brand:
          "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
        outline:
          "border border-stone-300 bg-white hover:bg-stone-50 text-stone-900",
        ghost:
          "hover:bg-stone-100 text-stone-700",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        secondary:
          "bg-stone-100 text-stone-900 hover:bg-stone-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
