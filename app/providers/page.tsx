"use client";

import React from "react";
import Link from "next/link";

// Fallback seed (used if /api/providers is not available)
const seed = [
  { name: "Goodstart Early Learning", approx_centres: 650, need_score: 3, focus: "Ops, energy", contact: "BD Team", email: "info@goodstart.org.au" },
  { name: "G8 Education", approx_centres: 430, need_score: 4, focus: "Multi-brand ops", contact: "Corporate", email: "info@g8education.edu.au" },
  { name: "Affinity Education Group", approx_centres: 225, need_score: 4, focus: "Upgrades program", contact: "Sustainability", email: "contact@affinityeducation.com.au" },
  { name: "Guardian Childcare & Education", approx_centres: 170, need_score: 3, focus: "ESG & parents", contact: "ESG Lead", email: "info@guardian.edu.au" },
  { name: "Busy Bees Australia", approx_centres: 150, need_score: 4, focus: "Portfolio rollouts", contact: "Operations", email: "hello@busybees.edu.au" },
  { name: "Only About Children", approx_centres: 75, need_score: 3, focus: "Brand & wellness", contact: "Property", email: "info@oac.edu.au" },
  { name: "Story House Early Learning", approx_centres: 60, need_score: 4, focus: "Tuning & metering", contact: "Ops", email: "enquiries@storyhouse.com.au" },
  { name: "C&K (QLD)", approx_centres: 330, need_score: 2, focus: "Kindergarten network", contact: "Facilities", email: "info@candk.asn.au" },
];

type ProviderRow = typeof seed[number];

export default function ProvidersPage() {
  const [rows, setRows] = React.useState<ProviderRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/providers", { cache: "no-store" });
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        const list: ProviderRow[] = (data?.providers || []).map((p: any) => ({
          name: p.name,
          approx_centres: p.approx_centres,
          need_score: p.need_score,
          focus: p.focus,
          contact: p.contact,
          email: p.email,
        }));
        if (!cancelled) {
          setRows(
            list.length ? list.sort((a, b) => b.approx_centres - a.approx_centres) : seed.sort((a, b) => b.approx_centres - a.approx_centres)
          );
        }
      } catch {
        if (!cancelled) {
          setRows(seed.sort((a, b) => b.approx_centres - a.approx_centres));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-900">
      {/* Header with logo */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/lid-logo.svg" alt="LID Consulting" className="h-8 w-auto" />
            <div>
              <div className="text-sm font-semibold tracking-tight text-emerald-800">LID Consulting</div>
              <div className="text-xs text-slate-500">Large Providers — market view</div>
            </div>
          </div>
          <nav className="hidden items-center gap-3 md:flex text-sm">
            <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              Home
            </Link>
            <Link href="/leads" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              Leads
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">StartingBlocks — Large Providers</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ordered by approximate number of centres. “Need score” indicates where environmental audits and NEPI ops work are likely most valuable (1–5).
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-50 text-left text-emerald-900">
                <th className="px-4 py-2">Provider</th>
                <th className="px-4 py-2">~ Centres</th>
                <th className="px-4 py-2">Need score</th>
                <th className="px-4 py-2">Focus</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    No providers found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.name} className="border-t">
                    <td className="px-4 py-2 font-medium text-slate-800">{r.name}</td>
                    <td className="px-4 py-2">{r.approx_centres.toLocaleString()}</td>
                    <td className="px-4 py-2">{r.need_score}/5</td>
                    <td className="px-4 py-2">{r.focus}</td>
                    <td className="px-4 py-2">{r.contact}</td>
                    <td className="px-4 py-2">
                      {r.email ? (
                        <a className="text-emerald-700 underline" href={`mailto:${r.email}`}>
                          {r.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-[11px] italic text-slate-500">
          Source: StartingBlocks “Large Providers” (curated); counts indicative. Replace with live scrape/API when ready.
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-4 text-xs text-slate-500">
        <div className="flex items-center justify-between border-t pt-4">
          <div>© {new Date().getFullYear()} LID Consulting — Market view</div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
            <span>Emerald brand</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
