"use client";
import React from "react";

type Row = { serviceName: string; provider: string; address: string };

export default function LeadsPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/leads?limit=50", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setRows(d.rows || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Address / Coords</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-6 text-slate-500">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-6 text-slate-500">No results.</td></tr>
            ) : (
              rows.map((r, i) => (
                <tr key={`${r.serviceName}-${i}`} className="border-t">
                  <td className="px-4 py-2 font-medium text-slate-800">{r.serviceName}</td>
                  <td className="px-4 py-2 text-slate-700">{r.provider}</td>
                  <td className="px-4 py-2 text-slate-700">{r.address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[11px] italic text-slate-500">
        Source: Victorian Government Open Data (CKAN), resource {process.env.NEXT_PUBLIC_VIC_RES_ID || "…"}.
      </div>
    </main>
  );
}
