"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle2, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ExtractResult = {
  ok: boolean;
  meta?: { filename: string; contentType: string; size: number };
  preview?: string;
  previewChars?: number;
  keyInfo?: {
    nmi?: string;
    mirn?: string;
    electricity_kwh?: number;
    gas_mj?: number;
    water_kl?: number;
    emissions_tco2e?: number;
    has_pv?: boolean;
  };
  note?: string;
  error?: string;
};

export default function AuditorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ---------- upload to Vercel Blob (keeps your existing store) ----------
  async function handleUpload() {
    if (!selectedFile) return;
    setBusy(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok || !json?.url) throw new Error(json?.error || "Upload failed");
      setUploadUrl(json.url as string);
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Upload failed" });
    } finally {
      setBusy(false);
    }
  }

  // ---------- extract: send file as multipart (best) or fall back to URL ----------
  async function handleExtract() {
    setBusy(true);
    setResult(null);
    try {
      let res: Response;
      if (selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        if (uploadUrl) form.append("blobUrl", uploadUrl);
        res = await fetch("/api/extract", { method: "POST", body: form });
      } else if (uploadUrl) {
        res = await fetch("/api/extract", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: uploadUrl }),
        });
      } else {
        throw new Error("Choose a file first.");
      }

      const json = (await res.json()) as ExtractResult;
      if (!res.ok) throw new Error(json?.error || "Extraction failed");
      setResult(json);
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Extraction failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50/20 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <Sparkles className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Audit Methodology & Required Documentation</div>
              <div className="text-xs text-slate-500">Use this checklist to feed the sustainability dashboard.</div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-8">
        <Tabs value="method" onValueChange={() => {}} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="method">Methodology</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="upload">Upload & AI extract</TabsTrigger>
          </TabsList>

          {/* Methodology */}
          <TabsContent value="method">
            <Card className="rounded-3xl border bg-white">
              <CardHeader><CardTitle>Methodology (A → G)</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ol className="list-inside list-decimal space-y-2">
                  <li><b>A. Inception</b> — Kickoff, scope, site selection, inductions.</li>
                  <li><b>B. Data request</b> — Issue audit data sheet & evidence checklist.</li>
                  <li><b>C. Desktop review</b> — Validate bills, meters (NMI/MIRN), drawings.</li>
                  <li><b>D. Site visit</b> — Inspect HVAC, PV/inverters, meters; ventilation; interview ops team.</li>
                  <li><b>E. Analysis</b> — Build baseline (kWh, MJ, kL, kg), PV coverage, IEQ summary.</li>
                  <li><b>F. Initial results</b> — Present preliminary findings & gaps.</li>
                  <li><b>G. Final report & dashboard</b> — Deliver audit report + populated dashboard.</li>
                </ol>
              </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl border bg-white">
                <CardHeader><CardTitle>Evidence — Energy & Water</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  <ul className="list-inside list-disc space-y-2">
                    <li>12 months electricity & gas bills (PDF/CSV); tariff pages highlighted.</li>
                    <li>PV inverter generation logs (CSV/API) and single line diagram.</li>
                    <li>Water bills (12 months) & reticulation diagram (if available).</li>
                    <li>Non-utility meters (sub-meter IDs, locations, channels).</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border bg-white">
                <CardHeader><CardTitle>Evidence — Waste & IEQ</CardTitle></CardHeader>
                <CardContent className="text-sm">
                  <ul className="list-inside list-disc space-y-2">
                    <li>Monthly waste invoices; stream volumes & contamination notes.</li>
                    <li>IEQ data (CO₂ by room — median / 95th percentile if available).</li>
                    <li>Operating hours, 20% arrival & 80% departure times + exceptions.</li>
                    <li>Rated area method and drawings (BOMA/lettable/GFA; marked plans).</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 rounded-3xl border bg-white">
              <CardHeader><CardTitle>Delivery & Handover</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <ul className="list-inside list-disc space-y-2">
                  <li>Draft findings within 4 days of site visit; final report 7 days after feedback.</li>
                  <li>Dashboard updated with baselines: electricity, gas, PV, water, waste, IEQ.</li>
                  <li>Recommendations with priority & payback; evidence gaps tracked to closure.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evidence quick list */}
          <TabsContent value="evidence">
            <Card className="rounded-3xl border bg-white">
              <CardHeader><CardTitle>Evidence Checklist</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    "Electricity bills (12 months)",
                    "Gas bills (12 months)",
                    "Water bills (12 months)",
                    "Tariff/plan pages (current)",
                    "PV generation logs (CSV/API)",
                    "Single line diagram",
                    "Meter list (NMI/MIRN/sub-meters)",
                    "Operating hours & exceptions",
                    "Waste invoices (monthly)",
                    "IEQ logs (CO2/ppm by room)",
                    "Rated area method & plans",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl border p-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload + AI */}
          <TabsContent value="upload">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl border bg-white">
                <CardHeader><CardTitle>Upload evidence</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.csv,.txt,.doc,.docx,image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="block w-full rounded-lg border p-2 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleUpload} disabled={!selectedFile || busy}>
                      <Upload className="mr-2 h-4 w-4" /> Upload to storage
                    </Button>
                    {uploadUrl && <Badge variant="outline">Stored ✓</Badge>}
                    {busy && <span className="text-xs text-slate-500">Working…</span>}
                  </div>
                  {uploadUrl && (
                    <div className="text-xs text-slate-500 break-all">
                      Blob URL: {uploadUrl}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border bg-white">
                <CardHeader><CardTitle>AI extraction</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    The extractor first uses <b>pdf-parse</b>; if little text is found it falls back to <b>PDF.js</b>.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleExtract} disabled={busy || (!selectedFile && !uploadUrl)}>
                      <FileText className="mr-2 h-4 w-4" /> Extract
                    </Button>
                    <Badge>Model: local-fallback</Badge>
                  </div>

                  {result?.error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      {result.error}
                    </div>
                  )}

                  {result?.ok && (
                    <div className="space-y-3 text-sm">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <div className="text-xs text-slate-500">
                          File: <b>{result.meta?.filename}</b> • Type: {result.meta?.contentType} • Size: {result.meta?.size?.toLocaleString()} bytes
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Raw chars: <b>{result.previewChars ?? (result.preview?.length ?? 0)}</b>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-xs uppercase text-slate-500">Key fields</div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            ["NMI", result.keyInfo?.nmi],
                            ["MIRN", result.keyInfo?.mirn],
                            ["Electricity (kWh)", result.keyInfo?.electricity_kwh],
                            ["Gas (MJ)", result.keyInfo?.gas_mj],
                            ["Water (kL)", result.keyInfo?.water_kl],
                            ["Emissions (tCO₂e)", result.keyInfo?.emissions_tco2e],
                            ["Has PV", result.keyInfo?.has_pv ? "Yes" : "No"],
                          ].map(([k, v]) => (
                            <div key={k as string} className="rounded-lg border p-2 text-xs">
                              <div className="text-slate-500">{k}</div>
                              <div className="font-medium">{String(v ?? "—")}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {result.preview && (
                        <div>
                          <div className="mb-1 text-xs uppercase text-slate-500">Preview (first 4,000 chars)</div>
                          <pre className="max-h-64 overflow-auto rounded-xl border bg-white p-3 text-xs whitespace-pre-wrap">
                            {result.preview}
                          </pre>
                        </div>
                      )}

                      {result.note && (
                        <div className="text-xs text-amber-700">Note: {result.note}</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
