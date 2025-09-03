import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top bar with logo */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-lid.svg" // put your logo file in /public (svg/png)
              alt="LID Consulting"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <div>
              <div className="text-sm font-semibold tracking-tight">LID Consulting</div>
              <div className="text-xs text-slate-500">Childcare Energy & Sustainability</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-4 pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Reduce OPEX, satisfy NQS 3 &amp; 7, and disclose environmental performance with confidence
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          We help childcare <strong>Operators</strong> and <strong>Designers</strong> cut energy &amp; water costs,
          meet <strong>NQS Quality Areas 3 &amp; 7</strong> obligations with clear evidence, and produce
          <strong> investor-ready sustainability disclosures</strong>. Our NEPI-aligned audits, dashboards, and
          DA-ready playbooks reduce rework and accelerate decisions.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold">Lower OPEX</div>
            <p className="mt-1 text-sm text-slate-600">
              Targeted HVAC tuning, LEDs, controls, procurement and tariffs. Typical payback
              <span className="font-medium"> 12–24 months</span>.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold">NQS 3 &amp; 7 support</div>
            <p className="mt-1 text-sm text-slate-600">
              Evidence-first workflows mapped to facilities (3) and leadership/governance (7).
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold">Environmental disclosure</div>
            <p className="mt-1 text-sm text-slate-600">
              Clear, auditable KPIs feeding sustainability reporting and parent-friendly snapshots.
            </p>
          </div>
        </div>

        {/* Access blocks */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-emerald-700">Public</div>
            <div className="mt-1 text-lg font-semibold">Parent Snapshot</div>
            <p className="mt-1 text-sm text-slate-600">
              Read-only public view of energy, water, and waste trends.
            </p>
            <Link
              href="/snapshot"
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
            >
              View snapshot
            </Link>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-sky-700">Private</div>
            <div className="mt-1 text-lg font-semibold">Client Dashboard</div>
            <p className="mt-1 text-sm text-slate-600">
              Full performance &amp; evidence, protected by Basic Auth.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100"
            >
              Sign in to Dashboard
            </Link>
            <div className="mt-2 text-xs text-slate-500">Use credentials set as <code>DASH_USER/DASH_PASS</code>.</div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-amber-700">Auditor</div>
            <div className="mt-1 text-lg font-semibold">Auditor Workspace</div>
            <p className="mt-1 text-sm text-slate-600">
              Methodology &amp; document register feeding the sustainability dashboard.
            </p>
            <Link
              href="/auditor"
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
            >
              Sign in as Auditor
            </Link>
            <div className="mt-2 text-xs text-slate-500">Use <code>AUDITOR_USER/AUDITOR_PASS</code>.</div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm md:col-span-2 lg:col-span-1">
            <div className="text-xs uppercase tracking-wide text-rose-700">Admin</div>
            <div className="mt-1 text-lg font-semibold">Admin: Leads &amp; Providers</div>
            <p className="mt-1 text-sm text-slate-600">
              Manage data sources and outbound pipeline to opportunities.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100"
              >
                Sign in as Admin
              </Link>
            </div>
            <div className="mt-2 text-xs text-slate-500">Use <code>ADMIN_USER/ADMIN_PASS</code>.</div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-6 text-xs text-slate-500">
        <div className="flex flex-col items-start justify-between gap-3 border-t pt-4 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} LID Consulting — Childcare Energy & Sustainability</div>
          <div>Evidence-first • NEPI-aligned • Privacy-respecting</div>
        </div>
      </footer>
    </main>
  );
}
