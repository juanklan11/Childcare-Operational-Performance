"use client";
import React from "react";

type Row = {
  ref: string;
  name: string;
  contact_ph: string;
  url: string;
  coordinates: string;
};

export default function LeadsPage() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/data/childcare-centres.csv", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        const lines = text.split(/\r?\n/).filter(l => l.trim().length);
        if (lines.length <= 1) { setRows([]); return; }

        // header: ref,name,contact_ph,url,coordinates
        const data: Row[] = [];
        for (let i = 1; i < lines.length; i++) {
          const raw = lines[i].trim();
          if (!raw) continue;
          const parts = raw.split(","); // coordinates contains a comma (lat,lon)
          const [ref="", name="", contact_ph="", url="", ...rest] = parts.map(s=>s.trim());
          const coordinates = rest.join(", ").trim();
          data.push({ ref, name, contact_ph, url, coordinates });
        }
        setRows(data);
      } catch (e:any) {
        setError(e.message || "Failed to read CSV");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-2">Ref</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Website</th>
              <th className="px-4 py-2">Coordinates</th>
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
            {rows.map((r, i) => (
              <tr key={r.ref || r.name || i} className="border-t">
                <td className="px-4 py-2">{r.ref || "—"}</td>
                <td className="px-4 py-2 font-medium">{r.name || "—"}</td>
                <td className="px-4 py-2">
                  {r.contact_ph ? <a className="text-emerald-700 hover:underline" href={`tel:${r.contact_ph}`}>{r.contact_ph}</a> : "—"}
                </td>
                <td className="px-4 py-2">
                  {r.url ? <a className="text-blue-600 hover:underline" href={r.url} target="_blank" rel="noreferrer">{r.url}</a> : "—"}
                </td>
                <td className="px-4 py-2 text-slate-600">{r.coordinates || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[11px] italic text-slate-500">Source: <code>/public/data/childcare-centres.csv</code></div>
    </main>
  );
}
