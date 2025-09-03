"use client";

import React, { useMemo, useState } from "react";

type Uploaded = {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
  originalName: string;
};

type ExtractResult = {
  ok: boolean;
  model?: string;
  summary?: string;
  fields?: Record<string, any>;
  bullet_summary?: string[];
  rawTextChars?: number;
  error?: string;
};

export default function AuditorPage() {
  // Upload state
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<Uploaded[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // AI extraction state
  const [selected, setSelected] = useState<number | "">("");
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);

  async function doUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    setResult(null);

    if (!files || files.length === 0) {
      setUploadError("Please choose one or more files.");
      return;
    }

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      setUploaded((prev) => [...json.uploaded, ...prev]);
      setFiles(null);
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function runExtract() {
    setResult(null);
    if (selected === "") return;
    const f = uploaded[selected as number];
    setExtracting(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: f.url,
          name: f.originalName,
          contentType: f.contentType,
        }),
      });
      const json = (await res.json()) as ExtractResult;
      setResult(json);
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Extraction failed" });
    } finally {
      setExtracting(false);
    }
  }

  const hasAIConfigured = useMemo(
    () => process.env.NEXT_PUBLIC_AI_READY === "1", // purely cosmetic hint
    []
  );

  return (
    <main className="min-h-screen bg-emerald-50/40 text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-200">
              <span className="font-bold text-emerald-800">lid</span>
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">
                Audit Methodology & Required Documentation
              </div>
              <div className="text-xs text-slate-500">
                Use this checklist to feed the sustainability dashboard (NEPI Energy Performance Indicator — Childcare).
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Methodology */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Methodology (A → G)</h2>
          <ol className="mt-3 space-y-1 text-sm text-slate-700">
            <li>
              <span className="font-semibold">A. Inception</span> — Kickoff, scope, site selection, inductions.
            </li>
            <li>
              <span className="font-semibold">B. Data request</span> — Issue audit data sheet & evidence checklist.
            </li>
            <li>
              <span className="font-semibold">C. Desktop review</span> — Validate bills, meters (NMI/MIRN), drawings.
            </li>
            <li>
              <span className="font-semibold">D. Site visit</span> — Inspect HVAC, PV/inverters, meters, ventilation; interview ops team.
            </li>
            <li>
              <span className="font-semibold">E. Analysis</span> — Build baseline (kWh, MJ, kL, kg), PV coverage, IEQ summary.
            </li>
            <li>
              <span className="font-semibold">F. Initial results</span> — Present preliminary findings & gaps.
            </li>
            <li>
              <span className="font-semibold">G. Final report & dashboard</span> — Deliver audit report + populated dashboard.
            </li>
          </ol>
        </div>

        {/* Evidence blocks */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Evidence — Energy & Water</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>12 months electricity & gas bills (PDF/CSV); tariff pages highlighted.</li>
              <li>PV inverter generation logs (CSV/API) and single line diagram.</li>
              <li>Water bills (12 months) & reticulation diagram (if available).</li>
              <li>Non-utility meters (sub-meter IDs, locations, channels).</li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Evidence — Waste & IEQ</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Monthly waste invoices; stream volumes & contamination notes.</li>
              <li>IEQ data (CO₂ by room — median / 95th percentile if available).</li>
              <li>Operating hours, 20% arrival & 80% departure times + exceptions.</li>
              <li>Rated area method and drawings (BOMA/lettable/GFA; marked plans).</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Delivery & Handover</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Draft findings within 4 days of site visit; final report 7 days after feedback.</li>
            <li>Dashboard updated with baselines: electricity, gas, PV, water, waste, IEQ.</li>
            <li>Recommendations with priority & payback; evidence gaps tracked to closure.</li>
          </ul>
        </div>

        {/* Upload + AI panels */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Uploader */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Upload evidence</h3>
            <p className="mt-1 text-sm text-slate-600">
              Photos, invoices, bills, drawings, CSVs, PDFs. Files are stored in secure Vercel Blob storage.
            </p>
            <form onSubmit={doUpload} className="mt-4">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.currentTarget.files)}
                className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
              />
              <button
                type="submit"
                disabled={uploading}
                className="mt-3 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {uploading ? "Uploading…" : "Upload files"}
              </button>
              {uploadError && (
                <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {uploadError}
                </div>
              )}
            </form>

            {uploaded.length > 0 && (
              <>
                <div className="mt-6 h-px w-full bg-slate-200" />
                <h4 className="mt-4 text-sm font-semibold">Recently uploaded</h4>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="py-2 pr-3">Name</th>
                        <th className="py-2 pr-3">Type</th>
                        <th className="py-2 pr-3">Size (KB)</th>
                        <th className="py-2 pr-3">Open</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploaded.map((u, i) => (
                        <tr key={u.pathname + i} className="border-t">
                          <td className="py-2 pr-3 font-medium">{u.originalName}</td>
                          <td className="py-2 pr-3">{u.contentType}</td>
                          <td className="py-2 pr-3">{Math.round(u.size / 1024)}</td>
                          <td className="py-2 pr-3">
                            <a className="text-emerald-700 underline" href={u.url} target="_blank" rel="noreferrer">
                              Open
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* AI Extraction */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">AI: Extract key info</h3>
            <p className="mt-1 text-sm text-slate-600">
              Select an uploaded PDF/CSV/TXT and the AI agent will pull audit fields (NMI/MIRN, totals, PV size, hours, rated area, etc.) for your dashboard.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-slate-500">Choose a file</label>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.currentTarget.value === "" ? "" : Number(e.currentTarget.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
                >
                  <option value="">— Select from uploaded —</option>
                  {uploaded.map((u, i) => (
                    <option key={u.pathname + i} value={i}>
                      {u.originalName} ({u.contentType})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={runExtract}
                  disabled={selected === "" || extracting}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {extracting ? "Extracting…" : "Extract"}
                </button>
              </div>
            </div>

            {!process.env.NEXT_PUBLIC_AI_READY && (
              <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                Tip: set <code>OPENAI_API_KEY</code> in Vercel → Environment Variables. (A lightweight fallback
                parser runs if the key is missing.)
              </div>
            )}

            {result && (
              <div className="mt-6">
                {result.ok ? (
                  <>
                    <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                      <div className="text-xs uppercase">Extraction</div>
                      <div>Model: {result.model || "local-fallback"} • Raw chars: {result.rawTextChars}</div>
                    </div>

                    {result.bullet_summary && result.bullet_summary.length > 0 && (
                      <>
                        <h4 className="mt-4 text-sm font-semibold">Summary</h4>
                        <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-slate-700">
                          {result.bullet_summary.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {result.fields && (
                      <>
                        <h4 className="mt-4 text-sm font-semibold">Structured fields</h4>
                        <pre className="mt-1 max-h-80 overflow-auto rounded-lg bg-slate-950/90 p-3 text-xs text-emerald-100">
{JSON.stringify(result.fields, null, 2)}
                        </pre>
                      </>
                    )}

                    {!result.fields && result.summary && (
                      <>
                        <h4 className="mt-4 text-sm font-semibold">Summary (text)</h4>
                        <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm">
{result.summary}
                        </pre>
                      </>
                    )}
                  </>
                ) : (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                    {result.error || "Extraction failed"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
