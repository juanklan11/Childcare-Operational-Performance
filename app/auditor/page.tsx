import Image from "next/image";

export const metadata = {
  title: "Auditor Workspace — NEPI Methodology",
  description: "Audit methodology and document register feeding the sustainability dashboard.",
};

export default function AuditorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-lid.svg"
              alt="LID Consulting"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <div>
              <div className="text-sm font-semibold tracking-tight">Auditor Workspace</div>
              <div className="text-xs text-slate-500">NEPI Audit &amp; Evidence</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Private area • Basic Auth</div>
        </div>
      </header>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Audit Methodology</h1>
          <p className="mt-2 text-slate-600">
            This methodology is aligned to the NABERS Energy Performance Indicator (Childcare) “The Rules” (v1.3). It
            defines evidence sufficiency, operating boundary, and intake workflow to produce audit-ready KPIs for the
            client dashboard and public snapshot.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-sm font-medium">1) Scope &amp; Boundaries</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                <li>Rated area basis (GFA/GLA/GLAR/NLA) and method of measurement.</li>
                <li>Energy boundary (HVAC, kitchens, specialised loads).</li>
                <li>Operating hours and occupancy markers (20%/80%).</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-sm font-medium">2) Evidence Intake</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                <li>12 months of electricity, gas, water bills.</li>
                <li>PV inverter data (if installed) and non-utility meters.</li>
                <li>Drawings, single-lines, reticulation diagrams.</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-sm font-medium">3) Validation &amp; QA</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                <li>NMI/MIRN cross-check, bill coverage, gaps register.</li>
                <li>Spot checks: IEQ (CO₂), waste stream consistency.</li>
                <li>Peer review and client sign-off trail.</li>
              </ul>
            </div>
          </div>

          <h2 className="mt-8 text-xl font-semibold tracking-tight">Required Documentation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Uploads here feed the private dashboard and public snapshot automatically once verified.
          </p>

          <div className="mt-4 overflow-x-auto rounded-2xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Files</th>
                  <th className="px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: "Areas", item: "Rated area basis & method", files: "PDF/DWG", note: "BOMA/lettable/GFA" },
                  { cat: "Hours", item: "Operating hours & 20/80 markers", files: "Roster / logs", note: "Term/calendar" },
                  { cat: "Energy", item: "Electricity bills (12 mo)", files: "PDF", note: "NMI coverage check" },
                  { cat: "Energy", item: "Gas bills (12 mo)", files: "PDF", note: "MIRN coverage check" },
                  { cat: "Energy", item: "PV generation logs", files: "CSV/portal export", note: "kWh by month" },
                  { cat: "Water", item: "Water bills (12 mo)", files: "PDF", note: "Meter no. validation" },
                  { cat: "Waste", item: "Waste invoices & streams", files: "PDF", note: "Contamination fees" },
                  { cat: "IEQ", item: "CO₂ readings per room", files: "CSV", note: "< 800 ppm steady-state" },
                ].map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2 font-medium text-slate-800">{r.cat}</td>
                    <td className="px-4 py-2">{r.item}</td>
                    <td className="px-4 py-2">{r.files}</td>
                    <td className="px-4 py-2 text-slate-500">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-[11px] italic text-slate-500">
            After validation, metrics roll into the sustainability dashboard and the parent snapshot.
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-6 text-xs text-slate-500">
        <div className="flex flex-col items-start justify-between gap-3 border-t pt-4 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} LID Consulting — Auditor Workspace</div>
          <div>NEPI-aligned • Evidence-first</div>
        </div>
      </footer>
    </main>
  );
}
