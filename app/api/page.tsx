// app/api/page.tsx
import React from "react";

type LeadRow = {
  id?: string | number;
  serviceName?: string;
  provider?: string;
  address?: string;
};

async function getRows(): Promise<LeadRow[]> {
  // If you already fetch elsewhere, replace with that call.
  // This keeps build green even if you haven’t wired the API yet.
  return [];
}

export default async function LeadsPage() {
  const rows: LeadRow[] = await getRows();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const safeKey = String(r.id ?? r.serviceName ?? r.provider ?? i);
              return (
                <tr key={safeKey} className="border-t">
                  <td className="px-4 py-2 font-medium">{r.serviceName ?? "—"}</td>
                  <td className="px-4 py-2">{r.provider ?? "—"}</td>
                  <td className="px-4 py-2">{r.address ?? "—"}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={3}>
                  No results yet. Wire your API or add mock rows to verify the table.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
