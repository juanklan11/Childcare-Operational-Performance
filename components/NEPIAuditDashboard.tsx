"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, BarChart3, Leaf, Droplet, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const siteVisit = { date: "2025-08-28", assessor: "LID Lead Auditor", duration_hours: 6 };

const meters = [
  { id: "NMI 6201234567", scope: "Whole site electricity", notes: "Retail AMI ok" },
  { id: "MIRN 5432109876", scope: "Gas – kitchen only", notes: "Invoices align to MIRN" },
  { id: "PV_01", scope: "30 kW rooftop", notes: "Inverter API available" },
];

const auditRisks = [
  { risk: "Missing 2 months power bills", priority: "High" },
  { risk: "Room schedule not stamped", priority: "Med" },
];

const InfoPill: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">{icon}</div>
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-base font-semibold text-slate-900">{value}</div>
    </div>
  </div>
);

<InfoPill icon={<FileText className="h-4 w-4" />} label="Site visit" value={siteVisit.date} />
<InfoPill icon={<FileText className="h-4 w-4" />} label="Evidence gaps" value={`${auditRisks.length}`} />


// ---- Portfolio table sample data (replace with real data later) ----
type PortfolioRow = {
  name: string;
  location: string;
  nepi: number;        // NEPI score (sample)
  recycle_pct: number; // % of total waste recycled
  water_kl: number;    // annual water consumption (kL)
  ieq_avg_pct: number; // IEQ score average as percentage
};

const portfolioRows: PortfolioRow[] = [
  { name: "Little Explorers ELC",    location: "Sunshine West, VIC", nepi: 62, recycle_pct: 41, water_kl: 980,  ieq_avg_pct: 82 },
  { name: "Riverbank Early Learning",location: "Werribee, VIC",      nepi: 68, recycle_pct: 45, water_kl: 910,  ieq_avg_pct: 85 },
  { name: "Bayview Kids",            location: "Frankston, VIC",     nepi: 59, recycle_pct: 39, water_kl: 1020, ieq_avg_pct: 78 },
  { name: "Green Gums ELC",          location: "Dandenong, VIC",     nepi: 71, recycle_pct: 47, water_kl: 880,  ieq_avg_pct: 88 },
  { name: "Bluebell Childcare",      location: "Footscray, VIC",     nepi: 64, recycle_pct: 42, water_kl: 940,  ieq_avg_pct: 81 },
];

export default function NEPIAuditDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // mock annuals for now
  const annuals = useMemo(() => {
    const elec = 91200;
    const water = 1000;
    const renewShare = 22;
    return { elec, water, renewShare };
  }, []);

  const pctComplete = () => 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <Sparkles className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">NEPI Audit & Evidence</div>
              <div className="text-xs text-slate-500">Client Dashboard</div>
            </div>
          </div>
          <div className="hidden items-center gap-4 md:flex text-xs text-slate-500">
            <span>No print/export controls • Share read-only link</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-2 pt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="audit">Audit Data</TabsTrigger>
          </TabsList>

          {/* -------- OVERVIEW TAB -------- */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border bg-white p-6 shadow-sm"
                >
                  <h1 className="text-2xl font-semibold tracking-tight">Executive Summary</h1>
                  <p className="mt-2 text-slate-600">
                    NABERS Energy Performance Indicator (Childcare) intake status, evidence readiness, and early performance KPIs for energy, water, waste, and IEQ.
                    NABERS Energy Performance Indicator (Childcare) intake status, evidence readiness, and early performance KPIs for energy, water, waste, and IEQ.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <InfoPill icon={<FileText className="h-4 w-4" />} label="Evidence readiness" value={`${pctComplete()}%`} />
                    <InfoPill icon={<BarChart3 className="h-4 w-4" />} label="Annual electricity" value={`${annuals.elec.toLocaleString()} kWh`} />
                    <InfoPill icon={<Leaf className="h-4 w-4" />} label="Renewables share" value={`${annuals.renewShare}%`} />
                    <InfoPill icon={<Droplet className="h-4 w-4" />} label="Annual water" value={`${annuals.water.toLocaleString()} kL`} />
                  </div>
                  <ul className="mt-4 list-inside list-disc text-sm text-slate-700">
                    <li>All intake data aligns to NABERS NEPI “The Rules” for childcare, including rated area, hours, energy boundary, and evidence trail.</li>
                    <li>IEQ targets use CO₂ &lt; 800 ppm as a steady-state guide.</li>
                  </ul>
                  <div className="mt-2 text-[11px] italic text-slate-500">
                    Source: NABERS Energy Performance Indicator for Childcare — The Rules v1.3.
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* -------- PORTFOLIO TAB -------- */}
          <TabsContent value="portfolio">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">Portfolio overview</h2>
              <p className="mt-1 text-sm text-slate-600">
                Sample data showing centre-level performance. Replace with live data from your API/JSON.
              </p>

              <div className="mt-4 overflow-x-auto rounded-2xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-slate-500">
                      <th className="px-4 py-2">Centre</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">NEPI score</th>
                      <th className="px-4 py-2">Recycling rate</th>
                      <th className="px-4 py-2">Water (kL)</th>
                      <th className="px-4 py-2">IEQ avg (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioRows.map((r, i) => (
                      <tr key={r.name + i} className="border-t">
                        <td className="px-4 py-2 font-medium text-slate-800">{r.name}</td>
                        <td className="px-4 py-2 text-slate-700">{r.location}</td>
                        <td className="px-4 py-2">{r.nepi}</td>
                        <td className="px-4 py-2">{r.recycle_pct}%</td>
                        <td className="px-4 py-2">{r.water_kl.toLocaleString()}</td>
                        <td className="px-4 py-2">{r.ieq_avg_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-2 text-[11px] italic text-slate-500">
                Source: Internal portfolio tracker (sample data).
              </div>
            </div>
          </TabsContent>

          {/* AUDIT DATA */}
          <TabsContent value="audit">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl">
                <CardHeader><CardTitle>Site Visit Summary</CardTitle></CardHeader>
                <CardContent className="text-sm text-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Date</div>
                      <div className="text-lg font-semibold">{siteVisit.date}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs text-slate-500">Assessor</div>
                      <div className="text-lg font-semibold">{siteVisit.assessor}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-slate-500">Notes</div>
                    <div className="mt-1 rounded-xl border p-3">Metering verified; PV logging enabled; ventilation timings observed.</div>
                  </div>
                </CardContent>
              </Card>
          
              <Card className="rounded-3xl">
                <CardHeader><CardTitle>Meters & Sources</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500">
                          <th className="py-2 pr-4">ID</th><th className="py-2 pr-4">Scope</th><th className="py-2 pr-4">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meters.map((m) => (
                          <tr key={m.id} className="border-t">
                            <td className="py-2 pr-4 font-medium">{m.id}</td>
                            <td className="py-2 pr-4">{m.scope}</td>
                            <td className="py-2 pr-4 text-slate-500">{m.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
          
              <Card className="lg:col-span-2 rounded-3xl">
                <CardHeader><CardTitle>Evidence Gaps & Risks</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500"><th className="py-2 pr-4">Risk</th><th className="py-2 pr-4">Priority</th></tr>
                      </thead>
                      <tbody>
                        {auditRisks.map((r, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2 pr-4">{r.risk}</td>
                            <td className="py-2 pr-4">{r.priority}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 text-[11px] italic text-slate-500">
                    When resolved, move items to “Complete” in the Evidence tab so KPIs update.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
