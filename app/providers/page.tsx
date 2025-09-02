"use client";
import React, { useEffect, useState } from "react";

type ProviderRow = {
  provider: string;
  services: number;
  states: string[];
  audit_need: "Very High" | "High" | "Medium" | "Low";
  sampleCentres: { name: string; address?: string }[];
};

export default function ProvidersPage() {
  const [data, setData] = useState<ProviderRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setData(j.rows || []);
      })
      .catch((e) => setErr(e.message || String(e)));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Large Providers (from CSV)</h1>
      <p className="mt-1 text-slate-600 text-sm">Sorted by number of centres; with a heuristic “audit need” band.</p>

      {err && <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Centres</th>
              <th className="px-4 py-2">States</th>
              <th className="px-4 py-2">Audit need</th>
              <th className="px-4 py-2">Sample centres</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.provider} className="border-t">
                <td className="px-4 py-2 font-medium text-slate-800">{r.provider}</td>
                <td className="px-4 py-2">{r.services.toLocaleString()}</td>
                <td className="px-4 py-2">{r.states.join(", ") || "—"}</td>
                <td className="px-4 py-2">
                  <span
                    className={[
                      "inline-flex rounded-full border px-2.5 py-0.5 text-xs",
                      r.audit_need === "Very High" || r.audit_need === "High"
                        ? "border-red-300 bg-red-100 text-red-700"
                        : r.audit_need === "Medium"
                        ? "border-amber-300 bg-amber-100 text-amber-700"
                        : "border-emerald-300 bg-emerald-100 text-emerald-700",
                    ].join(" ")}
                  >
                    {r.audit_need}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <ul className="list-disc pl-5">
                    {r.sampleCentres.map((c, i) => (
                      <li key={i}>{c.name}{c.address ? ` — ${c.address}` : ""}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
            {data.length === 0 && !err && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No rows yet. Check CSV path.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-[11px] italic text-slate-500">
        Source: {`/public/data/childcare-centres.csv`} (aggregated server-side).
      </div>
    </main>
  );
}
