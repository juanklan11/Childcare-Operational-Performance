import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Top brand bar */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              {/* Logo (no event handlers passed) */}
              <Image
                src="/lid-logo.svg"
                alt="LID Consulting"
                width={20}
                height={20}
                className="h-5 w-5"
                priority
              />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">LID Consulting</div>
              <div className="text-xs text-slate-500">Childcare Environmental Performance</div>
            </div>
          </div>
          <nav className="hidden items-center gap-3 md:flex text-sm">
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100" href="/snapshot">
              Parent Snapshot
            </Link>
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100" href="/dashboard">
              Client Dashboard
            </Link>
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100" href="/providers">
              Providers
            </Link>
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100" href="/leads">
              Leads
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Proof of Concept
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Reduce OPEX, demonstrate quality (NQS 3 & 7), and meet sustainability disclosure — purpose-built for childcare operators & designers.
        </h1>
        <p className="mt-3 text-slate-600">
          We baseline Environmental Performance for Childcare and turn it into operating savings, compliance support,
          and credible disclosures. Your portfolio gets a verified dashboard (private) and a simple, parent-friendly snapshot (public).
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Lower OPEX</div>
            <p className="mt-1 text-sm text-slate-700">
              8–15% energy savings via controls tuning, HVAC/LED upgrades & tariff optimisation — improved $/place and margin resilience.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">NQS Criteria 3 & 7</div>
            <p className="mt-1 text-sm text-slate-700">
              Facilities (3) & governance/leadership (7) supported with evidence-ready processes, IEQ targets and maintenance actions.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Environmental disclosure</div>
            <p className="mt-1 text-sm text-slate-700">
              Audit-ready dataset aligned with emerging AASB/ASRS expectations — reproducible emissions & boundary methodology.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {/* Public */}
          <Link
            href="/snapshot"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
          >
            View Parent Snapshot (public)
          </Link>

          {/* Private (basic auth) */}
          <Link
            href="/dashboard"
            className="rounded-xl border bg-white px-4 py-2 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
          >
            Open Client Dashboard (private)
          </Link>

          {/* Admin (basic auth for providers & leads) */}
          <div className="flex items-center gap-2">
            <Link
              href="/providers"
              className="rounded-xl border bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Admin: Providers
            </Link>
            <Link
              href="/leads"
              className="rounded-xl border bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Admin: Leads
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Note: The Dashboard and Admin pages are protected by basic authentication (set <code>DASH_USER/DASH_PASS</code> and{" "}
          <code>ADMIN_USER/ADMIN_PASS</code> in your environment; see middleware).
        </p>
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-4 text-xs text-slate-500">
        <div className="flex flex-col items-start justify-between gap-3 border-t pt-4 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} LID Consulting — Childcare Environmental Performance</div>
          <div className="flex items-center gap-3">
            <span>Evidence-first • Parent-friendly</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
