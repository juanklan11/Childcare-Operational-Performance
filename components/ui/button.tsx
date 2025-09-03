"use client";

import * as React from "react";

type Variant = "default" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  default: "bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700/20",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
  outline: "bg-transparent text-slate-900 border border-slate-300 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
