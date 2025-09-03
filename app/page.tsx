import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Simple brand row (no event handlers anywhere) */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/lid-logo.svg"
            alt="LID Consulting"
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
          <div>
            <div className="text-lg font-semibold tracking-tight">LID Consulting</div>
            <div className="text-xs text-slate-500">Childcare Energy • ESD • Assurance</div>
          </div>
        </div>
        <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700">
          Demo / Proof of Concept
        </span>
      </header>

      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Reduce OPEX, strengthen NQS compliance, and publish credible sustainability metrics.
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          We help <strong>Operators</strong> cut energy and water costs through NABERS-aligned tuning and quick-win
          retrofits, while supporting <strong>NQS Quality Areas 3 & 7</strong> with clear evidence trails, policies, and
          governance. Designers benefit from ESD-ready DA packs that reduce rework, de-risk approvals, and embed
          passively efficient layouts. Outcomes can be exported for <strong>sustainability reporting</strong> and investor/parent
          disclosure.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-5">
            <div className="text-sm font-semibold">OPEX reduction</div>
            <p className="mt-1 text-sm text-slate-600">
              HVAC tuning, LED upgrades, tariff optimisation and sub-metering to capture 10–20% savings in many centres.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <div className="text-sm font-semibold">NQS 3 & 7 support</div>
            <p className="mt-1 text-sm text-slate-600">
              Evidence-first dashboards help demonstrate well-maintained facilities (QA3) and strong leadership/governance (QA7).
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <div className="text-sm font-semibold">Environmental disclosure</div>
            <p className="mt-1 text-sm text-slate-600">
              Publish verified energy, water, waste, and IEQ metrics for transparency with parents and stakeholders.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {/* Public */}
          <Link
            href="/snapshot"
            className="rounded-xl border bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
          >
            Parent Snapshot (public)
          </Link>

          {/* Client (basic auth) */}
          <Link
            href="/dashboard"
            className="rounded-xl border bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            Client Dashboard (private)
          </Link>

          {/* Auditor (separate basic auth; link only) */}
          <Link
            href="/auditor"
            className="rounded-xl border bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
          >
            Auditor Workspace (private)
          </Link>

          {/* Admin for leads/providers */}
          <Link
            href="/leads"
            className="rounded-xl border bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
          >
            Admin: Leads
          </Link>
          <Link
            href="/providers"
            className="rounded-xl border bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
          >
            Admin: Providers
          </Link>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          *Private views may be protected by Basic Auth in middleware. Ask for credentials if prompted.
        </div>
      </section>
    </main>
  );
}
