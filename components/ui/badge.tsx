import * as React from "react";
export function Badge({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${className}`}>{children}</span>;
}
