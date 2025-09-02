"use client";
import React from "react";

type Row = {
  id: string; name: string; website?: string; services?: number|null;
  states?: string[]; audit_need_score: number; priority: "High"|"Medium"|"Low";
};

export default function ProvidersPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/providers?sort=size")
      .then(r => r.json())
      .then(j => setRows(j.providers || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Large Providers</h1>
      <p className="text-sm text-slate-600">StartingBlocks large providers — organised by size and audit need.</p>

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
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={5}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-3" colSpan={5}>No results.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">
                  <a href={r.website} target="_blank" rel="noreferrer" className="font-medium text-sky-700 hover:underline">
                    {r.name}
                  </a>
                </td>
                <td className="px-4 py-2">{r.services ?? "—"}</td>
                <td className="px-4 py-2">{(r.states || []).join(", ") || "—"}</td>
                <td className="px-4 py-2">{r.audit_need_score}</td>
                <td className="px-4 py-2">
                  <span className={
                    "rounded-full border px-2 py-0.5 text-xs " + (
                      r.priority === "High" ? "border-red-300 bg-red-100 text-red-700" :
                      r.priority === "Medium" ? "border-amber-300 bg-amber-100 text-amber-700" :
                      "border-emerald-300 bg-emerald-100 text-emerald-700"
                    )
                  }>
                    {r.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[11px] italic text-slate-500">
        *Populate the <code>/data/providers.ts</code> file with official counts from StartingBlocks “Large Providers”.
      </div>
    </main>
  );
}
