"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, ClipboardList, FolderOpen, AlertTriangle } from "lucide-react";
import BrandHeader from "@/components/BrandHeader";

type DocItem = { item: string; example?: string };
type DocCategory = { id: string; title: string; items: DocItem[] };

const requiredDocs: DocCategory[] = [
  {
    id: "areas",
    title: "Rated Area & Method",
    items: [
      { item: "Rated area (m²) and method", example: "BOMA/NLA with marked plans" },
      { item: "GLA/GLAR breakdown", example: "Room schedule with areas" },
      { item: "Single-line drawings", example: "PDF/DWG" },
    ],
  },
  {
    id: "hours",
    title: "Operating Hours & Occupancy",
    items: [
      { item: "Operating hours by weekday" },
      { item: "20% arrived / 80% departed times", example: "Roster/sign-in logs" },
      { item: "Exceptions >20% outside typical hours" },
    ],
  },
  {
    id: "energy",
    title: "Energy",
    items: [
      { item: "Electricity bills (12 months)", example: "PDF/CSV from retailer" },
      { item: "Gas/Diesel bills (12 months)" },
      { item: "PV inverter logs / portal exports", example: "CSV from inverter portal" },
      { item: "Non-utility meter list and IDs" },
      { item: "End-use boundary notes", example: "HVAC, kitchen, speciality loads" },
    ],
  },
  {
    id: "water",
    title: "Water",
    items: [
      { item: "Water bills (12 months)" },
      { item: "Reticulation/fixture notes" },
      { item: "Recycled water volumes (if any)" },
    ],
  },
  {
    id: "waste",
    title: "Waste",
    items: [
      { item: "Monthly waste invoices (12 months)" },
      { item: "Stream breakdown & lifts", example: "General/Recycling/Organics" },
      { item: "Contamination fees / notes" },
    ],
  },
  {
    id: "ieq",
    title: "IEQ",
    items: [
      { item: "Room list + CO₂ sensors (if any)" },
      { item: "Targets & guidance", example: "CO₂ < 800 ppm steady-state" },
    ],
  },
];

const riskRegister = [
  { risk: "Evidence gaps delay rating", likelihood: "Med", impact: "High", mitigation: "Pre-audit document check" },
  { risk: "Incorrect area/hours boundary", likelihood: "Low", impact: "High", mitigation: "Method statement + plans" },
  { risk: "Meter mapping errors", likelihood: "Med", impact: "Med", mitigation: "On-site metering walk-through" },
];

const fileRules = [
  { rule: "Accepted formats", detail: "PDF, CSV, XLSX, JPG/PNG (photos), DWG/PDF (drawings)" },
  { rule: "Preferred names", detail: "electricity_YYYY-MM.pdf, gas_YYYY-MM.pdf, water_YYYY-QX.pdf" },
  { rule: "Minimum period", detail: "12 consecutive months for each utility" },
  { rule: "Privacy", detail: "Strip personal/PII; bills may include NMI/MIRN only" },
];

export default function AuditorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <BrandHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Auditor Workspace</h1>
          <p className="mt-2 text-slate-600">
            Methodology, evidence checklist, and hand-off notes to keep the sustainability dashboard complete and
            audit-ready (NABERS NEPI v1.3 aligned).
          </p>
        </div>

        <Tabs defaultValue="method" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="method">Methodology</TabsTrigger>
            <TabsTrigger value="docs">Required Documentation</TabsTrigger>
            <TabsTrigger value="ingest">Ingestion & File Rules</TabsTrigger>
            <TabsTrigger value="risks">Risk Register</TabsTrigger>
          </TabsList>

          <TabsContent value="method">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-lid" /> Audit Methodology (Childcare NEPI)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <ol className="list-inside list-decimal space-y-2">
                  <li><strong>Inception</strong> — scope, asset list, and roles; confirm rated area method & operating hours.</li>
                  <li><strong>Pre-audit data</strong> — collect bills, plans, meter IDs, PV/IEQ logs; complete survey for 20%/80% markers.</li>
                  <li><strong>Site visit</strong> — metering walk-through, HVAC/controls review, photos, PV and ventilation checks, interviews.</li>
                  <li><strong>Reconciliation</strong> — align NMI/MIRN to bills; boundary & coverage confirmation; evidence sufficiency check.</li>
                  <li><strong>Calculations</strong> — energy & water annuals, renewables share, emissions factors; waste volumes & recycling rate.</li>
                  <li><strong>Outcomes</strong> — dashboard update, gaps list, prioritised recommendations, and an audit report PDF.</li>
                </ol>
                <div className="rounded-xl bg-lid/10 p-3 text-lid-900">
                  <div className="text-xs uppercase">Outputs</div>
                  <ul className="mt-1 list-inside list-disc">
                    <li>Audit Report (PDF) + Evidence index</li>
                    <li>Dashboard JSON (annuals, series, notes)</li>
                    <li>Risk register & actions (CSV/JSON)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs">
            <div className="space-y-6">
              {requiredDocs.map((cat) => (
                <Card key={cat.id} className="rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-lid" /> {cat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500">
                            <th className="py-2 pr-4">Item</th>
                            <th className="py-2 pr-4">Example / Note</th>
                            <th className="py-2 pr-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.items.map((it, i) => (
                            <tr key={i} className="border-t">
                              <td className="py-2 pr-4">{it.item}</td>
                              <td className="py-2 pr-4 text-slate-500">{it.example || "—"}</td>
                              <td className="py-2 pr-4"><Badge variant="outline">Pending</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-[11px] italic text-slate-500">Upload via SharePoint/Drive or future /api/upload endpoint.</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ingest">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-lid" /> File Ingestion Rules & Dashboard JSON
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border p-4">
                    <h4 className="mb-2 text-sm font-semibold">Rules</h4>
                    <ul className="list-inside list-disc text-sm text-slate-700">
                      {fileRules.map((r) => <li key={r.rule}><strong>{r.rule}:</strong> {r.detail}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-xl border p-4">
                    <h4 className="mb-2 text-sm font-semibold">Dashboard JSON (example)</h4>
                    <pre className="overflow-x-auto text-xs text-slate-700">
{`{
  "site": { "name": "Little Explorers ELC", "nmi": "6201234567" },
  "annuals": { "electricity_kwh": 104200, "gas_mj": 22800, "pv_kwh": 18000, "water_kl": 980, "waste_kg": 14200 },
  "renewables_share_pct": 17,
  "series": {
    "energy": [{ "month": "Apr", "electricity_kwh": 8200, "pv_kwh": 1200, "gas_mj": 2300 }],
    "water":  [{ "month": "Apr", "water_kl": 80 }],
    "waste":  [{ "month": "Apr", "waste_kg": 1200, "recycle_pct": 38 }]
  },
  "notes": { "exceptions": "Holiday program weeks vary", "basis": "Roster + sign-in logs" }
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-lid" /> Risk Register (template)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="py-2 pr-4">Risk</th>
                        <th className="py-2 pr-4">Likelihood</th>
                        <th className="py-2 pr-4">Impact</th>
                        <th className="py-2 pr-4">Mitigation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskRegister.map((r, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-2 pr-4">{r.risk}</td>
                          <td className="py-2 pr-4">{r.likelihood}</td>
                          <td className="py-2 pr-4">{r.impact}</td>
                          <td className="py-2 pr-4">{r.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Save as CSV/JSON and attach to the Audit Report.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
