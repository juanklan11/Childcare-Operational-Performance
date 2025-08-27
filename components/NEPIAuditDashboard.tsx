"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Area, Bar, Legend, ComposedChart } from "recharts";
import { AlertTriangle, BarChart3, CheckCircle2, Target, Sparkles, FileText, Clock, Building2, Leaf, Flame, Droplet, Recycle, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const InfoPill: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">{icon}</div>
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-base font-semibold text-slate-900">{value}</div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: "Complete" | "Pending" | "Gap" }> = ({ status }) => {
  const styles = { Complete: "bg-emerald-100 text-emerald-700 border-emerald-300", Pending: "bg-amber-100 text-amber-700 border-amber-300", Gap: "bg-red-100 text-red-700 border-red-300" } as const;
  return (<span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{status === "Complete" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}{status}</span>);
};

const PriorityBadge: React.FC<{ level: "High" | "Medium" | "Low" }> = ({ level }) => {
  const styles = { High: "bg-red-100 text-red-700 border-red-300", Medium: "bg-amber-100 text-amber-700 border-amber-300", Low: "bg-emerald-100 text-emerald-700 border-emerald-300" } as const;
  return (<span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[level]}`}><Target className="h-3.5 w-3.5" />{level} priority</span>);
};

const SourceTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (<div className="mt-2 text-[11px] italic text-slate-500">Source: {children}</div>);

const evidence: Array<{ id: string; category: string; items: Array<{ name: string; status: "Complete" | "Pending" | "Gap"; files: number; note?: string }>; }> = [
  { id: "areas", category: "Rated Area & Method", items: [ { name: "Rated area (m²)", status: "Pending", files: 1 }, { name: "GFA/GLA/GLAR/NLA breakdown", status: "Pending", files: 0 }, { name: "Evidence: method of area calculation", status: "Pending", files: 0, note: "BOMA/lettable/GFA" }, { name: "Single line & technical drawings", status: "Pending", files: 0 } ] },
  { id: "hours", category: "Operating Hours & Occupancy", items: [ { name: "Operating hours (by day)", status: "Pending", files: 0 }, { name: "Arrival (20%) time", status: "Pending", files: 0 }, { name: "Departure (80%) time", status: "Pending", files: 0 }, { name: "Exceptions >20% outside typical hours", status: "Pending", files: 0 }, { name: "Basis of knowledge (roster/logs)", status: "Pending", files: 0 }, { name: "Evidence (contract with provider)", status: "Pending", files: 0 } ] },
  { id: "energy", category: "Energy – Utilities & End-uses", items: [ { name: "Electricity bills (12 mo)", status: "Pending", files: 0 }, { name: "Gas bills (12 mo)", status: "Pending", files: 0 }, { name: "Diesel bills (if any)", status: "Pending", files: 0 }, { name: "End-use boundary (HVAC/cooking/specialised)", status: "Pending", files: 0 }, { name: "Non-utility meters list", status: "Pending", files: 0 }, { name: "On-site renewables (PV) generation logs", status: "Pending", files: 0 } ] },
  { id: "water", category: "Water", items: [ { name: "Water bills (12 mo)", status: "Pending", files: 0 }, { name: "Reticulation diagram", status: "Pending", files: 0 }, { name: "Non-utility meters data", status: "Pending", files: 0 }, { name: "Recycled water volumes", status: "Pending", files: 0 } ] },
  { id: "ieq", category: "Indoor Environment (IEQ)", items: [ { name: "CO₂ sensors by room (<800 ppm target)", status: "Pending", files: 0 }, { name: "User guidance (open windows vs AC)", status: "Pending", files: 0 } ] },
  { id: "waste", category: "Waste", items: [ { name: "Monthly waste bill & cost", status: "Pending", files: 0 }, { name: "Streams (gen/recycle/organics)", status: "Pending", files: 0 }, { name: "Lifts per stream & contamination notes", status: "Pending", files: 0 } ] }
];

const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
const energySeries = months.map((m, i) => ({ month: m, electricity_kwh: [8200,7900,7600,7300,7000,7200,7800,8400,9000,9500,9100,8700][i], gas_mj: [2300,2100,1900,1800,1700,1800,2000,2200,2600,2800,2600,2400][i], pv_gen_kwh: [1200,1300,1500,1600,1700,1800,1800,1700,1500,1300,1200,1100][i] }));
const waterSeries = months.map((m, i) => ({ month: m, water_kl: [80,76,74,78,82,85,88,92,96,90,86,82][i] }));
const wasteSeries = months.map((m, i) => ({ month: m, waste_total_kg: [1200,1150,1100,1080,1120,1180,1250,1300,1350,1280,1220,1180][i], recycle_pct: [38,40,41,42,43,41,39,40,42,43,44,45][i] }));
const rooms = ["Koalas", "Wombats", "Kookaburras", "Possums", "Platypus"];
const ieq = rooms.map((r, i) => ({ room: r, co2_median: [620,720,780,640,690][i], co2_p95: [820,980,1040,860,900][i] }));
const survey = { arrive20pct: "08:15", depart80pct: "17:30", exceptions: "School holiday program and occasional weekend community events.", basis: "Staff roster + sign-in logs" };

function pctComplete() { const all = evidence.flatMap((c) => c.items); const done = all.filter((i) => i.status === "Complete").length; return Math.round((done / all.length) * 100); }

export default function NEPIAuditDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const annuals = useMemo(() => {
    const elec = energySeries.reduce((a, b) => a + b.electricity_kwh, 0);
    const gasMJ = energySeries.reduce((a, b) => a + b.gas_mj, 0);
    const pv = energySeries.reduce((a, b) => a + b.pv_gen_kwh, 0);
    const renewShare = Math.round((pv / (elec || 1)) * 100);
    const water = waterSeries.reduce((a, b) => a + b.water_kl, 0);
    const waste = wasteSeries.reduce((a, b) => a + b.waste_total_kg, 0);
    return { elec, gasMJ, pv, renewShare, water, waste };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100"></div>
            <div><div className="text-sm font-semibold tracking-tight">NEPI Audit & Evidence</div><div className="text-xs text-slate-500">Client Dashboard</div></div>
          </div>
          <div className="hidden items-center gap-4 md:flex text-xs text-slate-500"><span>No print/export controls • Share read-only link</span></div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 pb-2 pt-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-semibold tracking-tight">Executive Summary</h1>
              <p className="mt-2 text-slate-600">NABERS Energy Performance Indicator (Childcare) intake status, evidence readiness, and early performance KPIs for energy, water, waste, and IEQ.</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <InfoPill label="Evidence readiness" value={f"{pctComplete()}%"} />
                <InfoPill label="Annual electricity" value={f"{annuals.elec.toLocaleString()} kWh"} />
                <InfoPill label="Renewables share" value={f"{annuals.renewShare}%"} />
                <InfoPill label="Annual water" value={f"{annuals.water.toLocaleString()} kL"} />
              </div>
              <ul className="mt-4 list-inside list-disc text-sm text-slate-700">
                <li>All intake data aligns to NABERS NEPI “The Rules” for childcare, including rated area, hours, energy boundary, and evidence trail.</li>
                <li>KPIs below update as bills and meter logs are added. IEQ targets use CO₂ &lt; 800 ppm as a steady-state guide.</li>
              </ul>
              <SourceTag>NABERS Energy Performance Indicator for Childcare — The Rules v1.3 (scope, evidence, operating hours).</SourceTag>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
