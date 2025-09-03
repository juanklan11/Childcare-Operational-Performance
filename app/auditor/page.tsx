"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuditorPage() {
  // Controlled Tabs (fixes defaultValue type error)
  const [activeTab, setActiveTab] = useState<"method" | "docs">("method");

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Auditor Workspace</h1>
        <p className="mt-1 text-sm text-slate-600">
          Methodology and required documentation to feed the sustainability dashboard.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="method">Methodology</TabsTrigger>
          <TabsTrigger value="docs">Required Documentation</TabsTrigger>
        </TabsList>

        {/* Methodology */}
        <TabsContent value="method">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>NEPI-aligned Audit Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <ol className="list-inside list-decimal space-y-2">
                <li><strong>Inception & Scope:</strong> confirm asset list, boundaries, evidence plan.</li>
                <li><strong>Data Intake (12 months):</strong> electricity, gas (if any), water, PV logs, waste invoices.</li>
                <li><strong>Operational Survey:</strong> operating hours (20% arrive / 80% depart), exceptions, basis of knowledge.</li>
                <li><strong>Site Audit:</strong> metering (NMI/MIRN), HVAC, ventilation, lighting, PV/inverters, drawings.</li>
                <li><strong>Compute KPIs:</strong> energy intensity, renewables share, emissions, water, waste & recycling.</li>
                <li><strong>Evidence Trail:</strong> map each KPI to traceable documents and meters.</li>
                <li><strong>Report & Dashboard:</strong> publish findings to the client dashboard modules.</li>
              </ol>
              <p className="text-[11px] italic text-slate-500">
                Aligned to NABERS Energy Performance Indicator (Childcare) v1.3 “The Rules”.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Required Documentation */}
        <TabsContent value="docs">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl">
              <CardHeader><CardTitle>Evidence Checklist</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-slate-700">
                  <li>Rated area calc, GFA/NLA breakdown, stamped drawings (single-line where applicable).</li>
                  <li>Operating hours by day; 20%/80% times; exceptions & basis (rosters/logs).</li>
                  <li>Electricity & gas bills (12 months), NMIs/MIRNs, tariff details.</li>
                  <li>PV/inverter generation logs or portal exports.</li>
                  <li>Water bills (12 months) & reticulation diagram (if available).</li>
                  <li>Waste invoices: monthly lifts/weights by stream; contamination notes.</li>
                  <li>IEQ: CO₂ sensor locations and sample logs (target steady-state &lt; 800 ppm).</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader><CardTitle>File Naming & Upload Conventions</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700">
                <ul className="list-inside list-disc space-y-2">
                  <li><code>[SITE]_[YYYY-MM]_ELEC.pdf</code>, <code>[SITE]_[YYYY-MM]_WATER.pdf</code>, etc.</li>
                  <li>Drawings: <code>[SITE]_SLD_vA.pdf</code>, <code>[SITE]_FLOORPLAN_vA.pdf</code>.</li>
                  <li>PV: <code>[SITE]_[YYYY-MM]_PV.csv</code> or inverter export.</li>
                  <li>Waste: <code>[SITE]_[YYYY-MM]_WASTE_STREAM.csv</code> with weights (kg) and lifts.</li>
                </ul>
                <p className="mt-3 text-[11px] italic text-slate-500">
                  Consistent names let us auto-ingest and update dashboard KPIs without manual handling.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
