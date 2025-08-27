"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, BarChart3, Leaf, Droplet, Sparkles } from "lucide-react";

const InfoPill: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">{icon}</div>
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-base font-semibold text-slate-900">{value}</div>
    </div>
  </div>
);

export default function NEPIAuditDashboard() {
  const [activeTab] = useState("overview");

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
                NABERS Energy Performance Indicator (Childcare) intake status, evidence readiness, and early performance KPIs for
                energy, water, waste, and IEQ.
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
      </section>
    </div>
  );
}
