"use client";
import React from "react";

type ProviderRow = {
  name: string;
  services: number;
  states: string[];
  auditNeed: "High" | "Medium" | "Low";
  priority: number;
};

export default function ProvidersPage() {
  const [rows, setRows] = React.useState<ProviderRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((d) => setRows(Array.isArray(d?.providers) ? d.providers : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Large Providers</h1>
      <p className="mt-1 text-slate-600">
        StartingBlocks large providers — organised by size and audit need.
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border">
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
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={5}>
                  {loading ? "Loading…" : "No results."}
                </td>
              </tr>
            )}
            {rows
              .slice()
              .sort((a, b) => a.priority - b.priority || b.services - a.services)
              .map((r) => (
                <tr key={r.name} className="border-t">
                  <td className="px-4 py-2 font-medium">{r.name}</td>
                  <td className="px-4 py-2">{r.services.toLocaleString()}</td>
                  <td className="px-4 py-2">{r.states.join(", ")}</td>
                  <td className="px-4 py-2">{r.auditNeed}</td>
                  <td className="px-4 py-2">{r.priority}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[11px] italic text-slate-500">
        *Populate the dataset in <code>/data/providers.ts</code> with official counts from
        StartingBlocks “Large Providers”.
      </div>
    </main>
  );
}
