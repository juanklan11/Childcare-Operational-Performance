"use client";

import * as React from "react";

type Variant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive";

const variantClasses: Record<Variant, string> = {
  default:
    "bg-emerald-600 text-white border border-emerald-700/20",
  secondary:
    "bg-slate-100 text-slate-900 border border-slate-200",
  outline:
    "bg-transparent text-slate-800 border border-slate-300",
  success:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning:
    "bg-amber-50 text-amber-700 border border-amber-200",
  destructive:
    "bg-red-50 text-red-700 border border-red-200",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
          "whitespace-nowrap select-none",
          variantClasses[variant],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
