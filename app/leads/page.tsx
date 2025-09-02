"use client";
import React, { useEffect, useState } from "react";

type Lead = {
  serviceName?: string; provider?: string; address?: string;
  suburb?: string; state?: string; postcode?: string;
  approvedPlaces?: number; nqsRating?: string | null; lat?: number; lon?: number;
};

export default function LeadsPage() {
  const [postcode, setPostcode] = useState("");
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const r = await fetch(`/api/leads?postcode=${encodeURIComponent(postcode)}`);
    const { rows } = await r.json();
    setRows(rows || []);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads (internal)</h1>
      <p className="text-slate-600 text-sm mt-1">Source: data.gov.au CKAN API; open-data licensed. Each row links out to the public finder for verification.</p>

      <div className="mt-4 flex gap-2">
        <input className="w-40 rounded-lg border px-3 py-2 text-sm" placeholder="Postcode" value={postcode} onChange={(e)=>setPostcode(e.target.value)} />
        <button onClick={search} disabled={loading} className="rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50">
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">NQS</th>
              <th className="px-4 py-2">Places</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.serviceName + i} className="border-t">
                <td className="px-4 py-2 font-medium">{r.serviceName || "—"}</td>
                <td className="px-4 py-2">{r.provider || "—"}</td>
                <td className="px-4 py-2">{r.address || "—"}</td>
                <td className="px-4 py-2">{r.nqsRating || "—"}</td>
                <td className="px-4 py-2">{r.approvedPlaces ?? "—"}</td>
                <td className="px-4 py-2">
                  {/* Conservative deep-link: open StartingBlocks finder; refine the query pattern once confirmed */}
                  <a className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
                     href={`https://www.startingblocks.gov.au/find-child-care`} target="_blank" rel="noreferrer">
                    View on StartingBlocks
                  </a>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">No results yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] italic text-slate-500">
        Use respectfully; verify details via the public finder and ACECQA registers before outreach. StartingBlocks is a parent-facing service; avoid scraping or storing personal data from it.
      </p>
    </main>
  );
}
