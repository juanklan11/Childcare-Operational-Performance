import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Server Action — simple credential gate just for /auditor
async function signIn(formData: FormData) {
  "use server";
  const u = String(formData.get("user") || "");
  const p = String(formData.get("pass") || "");
  const U = process.env.AUDITOR_USER || "auditor";
  const P = process.env.AUDITOR_PASS || "auditor123";

  if (u === U && p === P) {
    cookies().set("auditor_auth", "ok", { httpOnly: true, sameSite: "lax", path: "/" });
    redirect("/auditor");
  }
  // If invalid, just return (page will re-render showing an error hint)
}

export default async function AuditorPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const authed = cookies().get("auditor_auth")?.value === "ok";

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-900">
        {/* Header with logo */}
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img src="/lid-logo.svg" alt="LID Consulting" className="h-8 w-auto" />
              <div>
                <div className="text-sm font-semibold tracking-tight text-emerald-800">LID Consulting</div>
                <div className="text-xs text-slate-500">Auditor Sign-in</div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-md px-6 py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">Auditor area</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the credentials for the Auditor workspace. This sign-in is separate from the client dashboard basic auth.
          </p>

          <form action={signIn} className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <label className="block text-sm">
              <span className="text-slate-600">Username</span>
              <input
                name="user"
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="auditor"
                autoComplete="username"
              />
            </label>
            <label className="mt-4 block text-sm">
              <span className="text-slate-600">Password</span>
              <input
                name="pass"
                type="password"
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Sign in
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Set <code>AUDITOR_USER</code> / <code>AUDITOR_PASS</code> in Vercel → Settings → Environment Variables.
            </p>
          </form>
        </main>
      </div>
    );
  }

  // ===== Authenticated Auditor Workspace =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-900">
      {/* Header with logo */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/lid-logo.svg" alt="LID Consulting" className="h-8 w-auto" />
            <div>
              <div className="text-sm font-semibold tracking-tight text-emerald-800">LID Consulting</div>
              <div className="text-xs text-slate-500">Auditor Workspace</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">Audit Methodology & Required Documentation</h1>
        <p className="mt-1 text-sm text-slate-600">
          Use this checklist to feed the sustainability dashboard (NEPI Energy Performance Indicator — Childcare).
        </p>

        {/* Methodology */}
        <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">Methodology (A → G)</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-slate-700">
            <li><strong>A. Inception</strong> — Kickoff, scope, site selection, inductions.</li>
            <li><strong>B. Data request</strong> — Issue audit data sheet & evidence checklist.</li>
            <li><strong>C. Desktop review</strong> — Validate bills, meters (NMI/MIRN), drawings.</li>
            <li><strong>D. Site visit</strong> — Inspect HVAC, PV/inverters, meters, ventilation; interview ops team.</li>
            <li><strong>E. Analysis</strong> — Build baseline (kWh, MJ, kL, kg), PV coverage, IEQ summary.</li>
            <li><strong>F. Initial results</strong> — Present preliminary findings & gaps.</li>
            <li><strong>G. Final report & dashboard</strong> — Deliver audit report + populated dashboard.</li>
          </ol>
        </section>

        {/* Required Docs */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Evidence — Energy & Water</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
              <li>12 months electricity & gas bills (PDF/CSV); tariff pages highlighted.</li>
              <li>PV inverter generation logs (CSV/API) and single line diagram.</li>
              <li>Water bills (12 months) & reticulation diagram (if available).</li>
              <li>Non-utility meters (sub-meter IDs, locations, channels).</li>
            </ul>
          </div>
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Evidence — Waste & IEQ</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
              <li>Monthly waste invoices; stream volumes & contamination notes.</li>
              <li>IEQ data (CO₂ by room — median / 95th percentile if available).</li>
              <li>Operating hours, 20% arrival & 80% departure times + exceptions.</li>
              <li>Rated area method and drawings (BOMA/lettable/GFA; marked plans).</li>
            </ul>
          </div>
        </section>

        {/* Delivery */}
        <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Delivery & Handover</h3>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
            <li>Draft findings within 4 days of site visit; final report 7 days after feedback.</li>
            <li>Dashboard updated with baselines: electricity, gas, PV, water, waste, IEQ.</li>
            <li>Recommendations with priority & payback; evidence gaps tracked to closure.</li>
          </ul>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10 pt-4 text-xs text-slate-500">
        <div className="flex items-center justify-between border-t pt-4">
          <div>© {new Date().getFullYear()} LID Consulting — Auditor Workspace</div>
          <form
            action={async () => {
              "use server";
              cookies().delete("auditor_auth");
              redirect("/auditor");
            }}
          >
            <button className="rounded-lg border px-3 py-1.5 hover:bg-slate-100" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
