"use client";
import React from "react";

type ProviderRow = {
  provider: string;
  services: number;
  states: string[];
  audit_need: "High" | "Medium" | "Low";
  priority: 1 | 2 | 3 | 4 | 5;
  website?: string;
};

export default function ProvidersPage() {
  const [rows, setRows] = React.useState<ProviderRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/providers", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRows(Array.isArray(data?.rows) ? data.rows : []);
      } catch (e:any) {
        setError(e.message || "Failed to load providers.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Large Providers</h1>
      <p className="mt-1 text-sm text-slate-600">StartingBlocks large providers — organised by size and audit need.</p>

      <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Services</th>
              <th className="px-4 py-2">States</th>
              <th className="px-4 py-2">Audit need</th>
              <th className="px-4 py-2">Priority</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-4 py-6 text-slate-500" colSpan={5}>Loading…</td></tr>
            )}
            {error && !loading && (
              <tr><td className="px-4 py-6 text-red-600" colSpan={5}>Error: {error}</td></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr><td className="px-4 py-6 text-slate-500" colSpan={5}>No results.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.provider} className="border-t">
                <td className="px-4 py-2">
                  {r.website
                    ? <a className="font-medium text-blue-600 hover:underline" href={r.website} target="_blank" rel="noreferrer">{r.provider}</a>
                    : <span className="font-medium">{r.provider}</span>}
                </td>
                <td className="px-4 py-2">{r.services?.toLocaleString?.() ?? "—"}</td>
                <td className="px-4 py-2">{Array.isArray(r.states) ? r.states.join(", ") : "—"}</td>
                <td className="px-4 py-2">{r.audit_need}</td>
                <td className="px-4 py-2">{r.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[11px] italic text-slate-500">
        *Populate the `/api/providers` route (server) with your latest StartingBlocks “Large Providers” seed.*
      </div>
    </main>
  );
}
