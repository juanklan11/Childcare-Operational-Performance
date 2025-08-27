"use client";
import * as React from "react";
type TabsContextType = { value: string; setValue: (v: string) => void; };
const Ctx = React.createContext<TabsContextType | null>(null);
export function Tabs({ value, onValueChange, className = "", children }: React.PropsWithChildren<{ value: string; onValueChange: (v: string)=>void; className?: string }>) {
  return <div className={className}><Ctx.Provider value={{ value, setValue: onValueChange }}>{children}</Ctx.Provider></div>;
}
export function TabsList({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`inline-flex flex-wrap gap-2 rounded-xl border bg-slate-50 p-1 ${className}`}>{children}</div>;
}
export function TabsTrigger({ value, children }: React.PropsWithChildren<{ value: string }>) {
  const ctx = React.useContext(Ctx)!;
  const active = ctx.value === value;
  return (
    <button onClick={() => ctx.setValue(value)} className={`rounded-lg px-3 py-1.5 text-sm ${active ? "bg-white shadow-sm border" : "text-slate-600 hover:bg-white/60"}`} type="button">
      {children}
    </button>
  );
}
export function TabsContent({ value, children }: React.PropsWithChildren<{ value: string }>) {
  const ctx = React.useContext(Ctx)!;
  if (ctx.value !== value) return null;
  return <div className="mt-4">{children}</div>;
}
