import * as React from "react";
export function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>;
}
export function CardHeader({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`border-b px-5 py-4 ${className}`}>{children}</div>;
}
export function CardTitle({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <h2 className={`font-semibold tracking-tight ${className}`}>{children}</h2>;
}
export function CardContent({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}
