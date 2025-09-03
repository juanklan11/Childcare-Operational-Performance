"use client";
import React from "react";

type LeadRow = {
  ref: string;
  name: string;
  contact_ph?: string;
  url?: string;
  coordinates?: string;
};

export default function LeadsPage() {
  const [rows, setRows] = React.useState<LeadRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leads", { cache: "no-store" });
        const data = await res.json();
        setRows(Array.isArray(data?.rows) ? data.rows : []);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads</h1>

      <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-2">Ref</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Website</th>
              <th className="px-4 py-2">Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  Loading…
                </td>
              </tr>
            )}

            {!loading && err && (
              <tr>
                <td className="px-4 py-3 text-red-600" colSpan={5}>
                  {err}
                </td>
              </tr>
            )}

            {!loading && !err && rows.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                  No results.
                </td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={(r.ref || r.name || "row") + i} className="border-t">
                <td className="px-4 py-2">{r.ref || "—"}</td>
                <td className="px-4 py-2 font-medium text-slate-800">{r.name || "—"}</td>
                <td className="px-4 py-2">{r.contact_ph || "—"}</td>
                <td className="px-4 py-2">
                  {r.url ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 underline"
                    >
                      {r.url}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-2">{r.coordinates || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] italic text-slate-500">
        Source: <code>/public/data/childcare-centres.csv</code>. Edit the CSV and redeploy to update.
      </p>
    </main>
  );
}
