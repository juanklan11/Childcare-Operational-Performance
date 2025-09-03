import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Operational Performance for Childcare — built for Operators & Designers
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          LID Consulting helps childcare portfolios reduce operating costs, support National Quality Standard (NQS) criteria 3 & 7,
          and produce audit-ready environmental disclosures that build trust with parents and investors.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border p-4">
            <div className="text-xs uppercase tracking-wide text-emerald-700">Lower OPEX</div>
            <div className="mt-1 text-sm text-slate-700">
              8–15% typical energy savings from controls tuning, HVAC/LED upgrades, and tariff optimisation—protecting margins and $/place.
            </div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-xs uppercase tracking-wide text-emerald-700">NQS 3 & 7 support</div>
            <div className="mt-1 text-sm text-slate-700">
              Evidence-based improvements to the physical environment (Quality Area 3) and governance/leadership (Quality Area 7).
            </div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-xs uppercase tracking-wide text-emerald-700">Disclosure & credibility</div>
            <div className="mt-1 text-sm text-slate-700">
              A single, audit-ready dataset aligned to emerging ASRS expectations (AASB) and NABERS NEPI metrics you can share.
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">For Operators</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
              <li>Portfolio baseline (energy, water, waste, IEQ) with verified evidence.</li>
              <li>Quick-win retrofits and procurement review for rapid payback.</li>
              <li>Parent snapshot to communicate real improvements without exposing sensitive data.</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">For Designers & Developers</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
              <li>ESD-ready DA pack: BESS / NCC Section J / NEPI boundary alignment.</li>
              <li>Right-sized metering & renewables allowances to support operations.</li>
              <li>Design advice mapped to operational performance & future disclosure.</li>
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-3">
          {/* Public */}
          <Link
            href="/snapshot"
            className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-emerald-800 shadow-sm hover:bg-emerald-100"
          >
            View Parent Snapshot (Public)
          </Link>

          {/* Client (Basic Auth: DASH_*) */}
          <Link
            href="/dashboard"
            className="rounded-xl border bg-white px-4 py-2 text-slate-800 shadow-sm hover:bg-slate-50"
            title="Client Dashboard (requires username/password)"
          >
            Client Dashboard — Sign in
          </Link>

          {/* Admin (Basic Auth: ADMIN_*) */}
          <Link
            href="/providers"
            className="rounded-xl border bg-white px-4 py-2 text-slate-800 shadow-sm hover:bg-slate-50"
            title="Admin area (Providers & Leads, requires admin username/password)"
          >
            Admin: Providers — Sign in
          </Link>
          <Link
            href="/leads"
            className="rounded-xl border bg-white px-4 py-2 text-slate-800 shadow-sm hover:bg-slate-50"
            title="Admin area (Providers & Leads, requires admin username/password)"
          >
            Admin: Leads — Sign in
          </Link>
          <Link
            href="/auditor"
            className="rounded-xl border bg-white px-4 py-2 text-slate-800 shadow-sm hover:bg-slate-50"
            title="Auditor workspace (requires admin username/password)"
          >
            Auditor Workspace — Sign in
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          * Private areas use HTTP Basic Auth. Ask your LID contact for credentials.
        </p>
      </section>
    </main>
  );
}
