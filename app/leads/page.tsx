"use client";
import React from "react";
import BrandHeader from "@/components/BrandHeader";

// Very small CSV parser that honors quotes
function parseCSV(text: string) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const split = (line: string) =>
    line.match(/("(?:[^"]|"")*"|[^,]+)/g)?.map((c) =>
      c.replace(/^"(.*)"$/, "$1").replace(/""/g, '"').trim()
    ) || [];
  const header = split(lines[0]);
  return lines.slice(1).map((l) => {
    const cols = split(l);
    const row: Record<string, string> = {};
    header.forEach((h, i) => (row[h] = cols[i] ?? ""));
    return row;
  });
}

type LeadRow = {
  ref: string;
  name: string;
  contact_ph: string;
  url: string;
  coordinates: string; // "-37.79, 144.91"
};

export default function LeadsPage() {
  const [rows, setRows] = React.useState<LeadRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/childcare-centres.csv", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csv = await res.text();
        const data = parseCSV(csv) as LeadRow[];
        setRows(data);
      } catch (e: any) {
        setError(e.message || "Failed to load CSV");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <BrandHeader title="Childcare Leads" subtitle="CKAN export (Victoria) — CSV feed" />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-600">
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Coordinates</th>
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
              {rows.map((r, i) => {
                const [lat, lng] = (r.coordinates || "").split(",").map((s) => s.trim());
                const mapHref = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : undefined;
                const web = r.url?.replace(/^https?:\/\//, "").replace(/\/$/, "");
                return (
                  <tr key={r.ref || i} className="border-t">
                    <td className="px-4 py-2 font-medium">{r.ref || "—"}</td>
                    <td className="px-4 py-2">{r.name || "—"}</td>
                    <td className="px-4 py-2">{r.contact_ph || "—"}</td>
                    <td className="px-4 py-2">
                      {r.url ? <a className="text-emerald-700 underline" href={r.url} target="_blank" rel="noreferrer">{web}</a> : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {mapHref ? <a className="text-emerald-700 underline" href={mapHref} target="_blank" rel="noreferrer">{r.coordinates}</a> : (r.coordinates || "—")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-[11px] italic text-slate-500">
          Source: Victoria CKAN dataset export (CSV). Columns: ref, name, contact_ph, url, coordinates.
        </div>
      </main>
    </div>
  );
}
