// app/leads/page.tsx
"use client";
import React from "react";

type Row = { serviceName?: string; provider?: string; address?: string };

export default function LeadsPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/leads", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setRows(d.rows || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-slate-500" colSpan={3}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={3}>
                  No results yet. Wire your API or add mock rows to verify the table.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={(r.serviceName || r.provider || "row") + i} className="border-t">
                  <td className="px-4 py-2 font-medium">{r.serviceName || "—"}</td>
                  <td className="px-4 py-2">{r.provider || "—"}</td>
                  <td className="px-4 py-2">{r.address || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] italic text-slate-500">
        Source: data.gov.au CKAN datastore (configurable) or mock dataset when env vars are missing.
      </p>
    </main>
  );
}
