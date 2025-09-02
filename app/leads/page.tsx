// app/leads/page.tsx
import React from "react";

type Row = { serviceName?: string; provider?: string; address?: string };

export const dynamic = "force-dynamic"; // do not pre-render; fetch on each request

async function getRows(): Promise<Row[]> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || ""; // optional, works without it
  try {
    const res = await fetch(`${base}/api/leads`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data?.rows) ? data.rows : [];
  } catch {
    return [];
  }
}

export default async function LeadsPage() {
  const rows = await getRows();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-slate-500">
                  No results yet. Wire your API or add mock rows to verify the table.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={`${r.serviceName ?? "row"}-${i}`} className="border-t">
                  <td className="px-4 py-2 font-medium text-slate-800">
                    {r.serviceName ?? "—"}
                  </td>
                  <td className="px-4 py-2">{r.provider ?? "—"}</td>
                  <td className="px-4 py-2">{r.address ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[11px] italic text-slate-500">
        Source: data.gov.au CKAN datastore (configurable) or mock dataset when env
        vars are missing.
      </div>
    </main>
  );
}
