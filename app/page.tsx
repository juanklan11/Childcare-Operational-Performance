import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-900">
      {/* Site Header with Logo */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/lid-logo.svg"
              alt="LID Consulting"
              className="h-8 w-auto"
            />
            <div>
              <div className="text-sm font-semibold tracking-tight text-emerald-800">
                LID Consulting
              </div>
              <div className="text-xs text-slate-500">Childcare Energy & NEPI</div>
            </div>
          </div>
          <nav className="hidden items-center gap-3 md:flex text-sm">
            <Link href="/snapshot" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              Snapshot (Public)
            </Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              Dashboard (Private)
            </Link>
            <Link href="/leads" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              Leads
            </Link>
            <Link href="/providers" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
              Providers
            </Link>
            <Link href="/auditor" className="rounded-lg px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700">
              Auditor (Sign in)
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-emerald-900">
          Childcare Energy – NEPI Site
        </h1>
        <p className="mt-2 text-slate-600">
          Welcome. Choose a view below. The Auditor area has a separate sign-in.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            className="rounded-xl border bg-white px-4 py-3 shadow-sm hover:bg-slate-50"
            href="/snapshot"
          >
            Parent Snapshot (public)
          </Link>
          <Link
            className="rounded-xl border bg-white px-4 py-3 shadow-sm hover:bg-slate-50"
            href="/dashboard"
          >
            Client Dashboard (basic auth)
          </Link>
          <Link
            className="rounded-xl border bg-white px-4 py-3 shadow-sm hover:bg-slate-50"
            href="/leads"
          >
            Leads (private)
          </Link>
          <Link
            className="rounded-xl border bg-white px-4 py-3 shadow-sm hover:bg-slate-50"
            href="/providers"
          >
            Large Providers (market)
          </Link>
          <Link
            className="rounded-xl border bg-emerald-600 px-4 py-3 text-white shadow-sm hover:bg-emerald-700 sm:col-span-2"
            href="/auditor"
          >
            Auditor (separate sign in)
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Tip: set <code>DASH_USER</code>/<code>DASH_PASS</code> for /dashboard basic auth. The
          Auditor page uses its own credentials (<code>AUDITOR_USER</code>/<code>AUDITOR_PASS</code>).
        </p>
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-4 text-xs text-slate-500">
        <div className="flex items-center justify-between border-t pt-4">
          <div>© {new Date().getFullYear()} LID Consulting — Childcare Energy</div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
            <span>Brand: Emerald</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
