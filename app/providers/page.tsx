"use client";
import React from "react";
import BrandHeader from "@/components/BrandHeader";

type ProviderRow = {
  provider: string;
  services: number;
  states: string[];               // e.g. ["NSW","VIC","QLD"]
  audit_need: "Low" | "Medium" | "High";
  priority: number;               // 1..5 (lower is higher priority)
};

export default function ProvidersPage() {
  const [rows, setRows] = React.useState<ProviderRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/providers", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = (json?.providers ?? []) as ProviderRow[];
        // sort: biggest first, then highest audit need (High > Medium > Low)
        const rank = { High: 3, Medium: 2, Low: 1 } as const;
        data.sort((a, b) => (b.services - a.services) || (rank[b.audit_need] - rank[a.audit_need]));
        setRows(data);
      } catch (e: any) {
        setError(e.message || "Failed to load providers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <BrandHeader title="Large Providers" subtitle="StartingBlocks large providers — organised by size and audit need" />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Services</th>
                <th className="px-4 py-3">States</th>
                <th className="px-4 py-3">Audit need</th>
                <th className="px-4 py-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td className="px-4 py-4 text-slate-500" colSpan={5}>Loading…</td></tr>
              )}
              {error && !loading && (
                <tr><td className="px-4 py-4 text-red-600" colSpan={5}>Error: {error}</td></tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr><td className="px-4 py-4 text-slate-500" colSpan={5}>No results.</td></tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.provider + i} className="border-t">
                  <td className="px-4 py-2 font-medium">{r.provider}</td>
                  <td className="px-4 py-2">{r.services.toLocaleString()}</td>
                  <td className="px-4 py-2">{r.states?.join(", ") || "—"}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs
                      ${r.audit_need === "High" ? "border-red-300 bg-red-100 text-red-700" :
                        r.audit_need === "Medium" ? "border-amber-300 bg-amber-100 text-amber-700" :
                        "border-emerald-300 bg-emerald-100 text-emerald-700"}`}>
                      {r.audit_need}
                    </span>
                  </td>
                  <td className="px-4 py-2">#{r.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-[11px] italic text-slate-500">
          *Populate the API at <code>/api/providers</code> with official counts from StartingBlocks “Large Providers”.
        </div>
      </main>
    </div>
  );
}
