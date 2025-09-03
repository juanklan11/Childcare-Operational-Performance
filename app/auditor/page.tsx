"use client";

import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuditorPage() {
  const [tab, setTab] = React.useState("method");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Simple brand row (no event handlers in props) */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/lid-logo.svg" alt="LID Consulting" width={36} height={36} className="h-9 w-9" />
          <div>
            <div className="text-sm font-semibold tracking-tight">Auditor Workspace</div>
            <div className="text-xs text-slate-500">NEPI methodology & required documentation</div>
          </div>
        </div>
        <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700">
          Private
        </span>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="method">Methodology</TabsTrigger>
          <TabsTrigger value="docs">Required Documentation</TabsTrigger>
          <TabsTrigger value="dashboard">Data → Dashboard Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="method">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">Audit methodology</h2>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-slate-700">
              <li>Confirm site boundary, rated area method, and operating hours (20%/80% markers).</li>
              <li>Collect 12 months of bills for electricity, gas/diesel (if any), and water.</li>
              <li>Verify meters (NMI/MIRN), sub-meter coverage, and PV inverter logs where applicable.</li>
              <li>Capture waste stream invoices & lifts; note contamination and service frequency.</li>
              <li>Record IEQ measurements (e.g., CO₂ steady-state & 95th percentile per room).</li>
              <li>Evidence chain: drawings, schedules, contracts, calculations, and photos as needed.</li>
            </ol>
            <p className="mt-3 text-xs text-slate-500">Aligned to NABERS Energy Performance Indicator (Childcare) — The Rules v1.3.</p>
          </section>
        </TabsContent>

        <TabsContent value="docs">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">Required documentation</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium">Energy</div>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  <li>Electricity &amp; gas/diesel bills (12 months)</li>
                  <li>PV generation report or inverter export</li>
                  <li>Sub-meter list and data source</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium">Water</div>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  <li>Potable &amp; recycled water bills (12 months)</li>
                  <li>Reticulation diagram &amp; non-utility meters</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium">Waste</div>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  <li>Invoices per stream and service frequency</li>
                  <li>Contamination notes &amp; photos (if any)</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <div className="text-sm font-medium">IEQ</div>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
                  <li>CO₂ by room — median &amp; 95th percentile</li>
                  <li>Ventilation/controls strategy notes</li>
                </ul>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="dashboard">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">Dashboard mapping</h2>
            <p className="mt-2 text-sm text-slate-700">
              Auditors’ uploads feed structured collections that drive the private client dashboard and the public
              parent snapshot. When evidence is marked <em>Complete</em>, KPIs update automatically.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 pr-4">Collection</th>
                    <th className="py-2 pr-4">Fields</th>
                    <th className="py-2 pr-4">Populates</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-2 pr-4 font-medium">Energy bills</td>
                    <td className="py-2 pr-4">period, kWh, MJ, cost, NMI/MIRN</td>
                    <td className="py-2 pr-4">Energy charts &amp; annual totals</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 pr-4 font-medium">Water bills</td>
                    <td className="py-2 pr-4">period, kL, cost, meter</td>
                    <td className="py-2 pr-4">Water chart &amp; annual total</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 pr-4 font-medium">Waste</td>
                    <td className="py-2 pr-4">stream, kg, lifts, contamination</td>
                    <td className="py-2 pr-4">Waste chart &amp; recycling rate</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 pr-4 font-medium">IEQ (CO₂)</td>
                    <td className="py-2 pr-4">room, median, p95</td>
                    <td className="py-2 pr-4">IEQ room chart • targets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
}
