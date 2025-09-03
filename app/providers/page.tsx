"use client";

import React from "react";

type Provider = {
  name: string;
  website?: string;
  centres?: number;         // number of services (size)
  regions?: string[];
  audit_need?: "High" | "Medium" | "Low";
};

const FALLBACK_SEED: Provider[] = [
  { name: "Goodstart Early Learning", website: "https://www.goodstart.org.au", centres: 640, regions: ["National"], audit_need: "High" },
  { name: "G8 Education", website: "https://g8education.edu.au", centres: 400, regions: ["National"], audit_need: "High" },
  { name: "Affinity Education Group", website: "https://affinityeducation.com.au", centres: 220, regions: ["National"], audit_need: "Medium" },
  { name: "Busy Bees Australia", website: "https://www.busybees.edu.au", centres: 200, regions: ["National"], audit_need: "Medium" },
  { name: "Guardian Childcare & Education", website: "https://www.guardian.edu.au", centres: 130, regions: ["National"], audit_need: "Medium" },
  { name: "Only About Children", website: "https://www.oac.edu.au", centres: 70, regions: ["NSW", "VIC", "QLD"], audit_need: "Medium" },
  { name: "Think Childcare / Nido", website: "https://nido.edu.au", centres: 80, regions: ["National"], audit_need: "Medium" },
];

function normalize(input: any): Provider[] {
  if (!input) return [];
  if (Array.isArray(input)) return input as Provider[];
  if (Array.isArray(input.providers)) return input.providers as Provider[];
  return [];
}

export default function ProvidersPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<Provider[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/providers", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = normalize(json);

        if (!mounted) return;

        const safe = list.length ? list : FALLBACK_SEED;
        // sort by centres desc (size)
        safe.sort((a, b) => (b.centres || 0) - (a.centres || 0));
        setRows(safe);
      } catch (e: any) {
        // Fallback to seed on any error
        const seed = [...FALLBACK_SEED].sort((a, b) => (b.centres || 0) - (a.centres || 0));
        if (mounted) {
          setRows(seed);
          setError("Live provider API unavailable — showing seed data.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Large Providers</h1>
            <p className="mt-1 text-sm text-slate-600">
              Sourced from StartingBlocks “Large Providers” (seed), sortable by company size and indicative audit need.
            </p>
          </div>
          <div className="text-xs text-slate-500">Admin area</div>
        </div>

        {loading && <div className="mt-6 rounded-xl border bg-slate-50 p-4 text-sm">Loading providers…</div>}
        {error && <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">{error}</div>}

        <div className="mt-4 overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-2">Provider</th>
                <th className="px-4 py-2">Website</th>
                <th className="px-4 py-2">Centres</th>
                <th className="px-4 py-2">Regions</th>
                <th className="px-4 py-2">Audit need</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={(r.name || "p") + i} className="border-t">
                  <td className="px-4 py-2 font-medium text-slate-800">{r.name || "—"}</td>
                  <td className="px-4 py-2">
                    {r.website ? (
                      <a href={r.website} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                        {new URL(r.website).hostname.replace("www.", "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2">{typeof r.centres === "number" ? r.centres.toLocaleString() : "—"}</td>
                  <td className="px-4 py-2">{Array.isArray(r.regions) ? r.regions.join(", ") : "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs " +
                        (r.audit_need === "High"
                          ? "border-red-300 bg-red-100 text-red-700"
                          : r.audit_need === "Medium"
                          ? "border-amber-300 bg-amber-100 text-amber-700"
                          : "border-emerald-300 bg-emerald-100 text-emerald-700")
                      }
                    >
                      {r.audit_need || "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {!rows.length && !loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No providers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-[11px] italic text-slate-500">
          For lead-gen, pair with your /leads page and CSV/API ingestion. Data shown here is non-confidential.
        </div>
      </div>
    </main>
  );
}
