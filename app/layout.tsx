import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LID Consulting — Childcare Operational Performance",
  description: "Reduce OPEX, support NQS 3 & 7, and enable environmental disclosure for childcare assets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {/* Global brand bar (shows on every page) */}
        <div className="sticky top-0 z-50 border-b border-emerald-200 bg-emerald-50/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-3">
              {/* Place your logo at /public/lid-logo.svg */}
              <img
                src="/lid-logo.svg"
                alt="LID Consulting"
                className="h-6 w-auto"
                onError={(e) => {
                  // graceful fallback if the logo isn't present yet
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const sib = document.getElementById("lid-fallback");
                  if (sib) sib.style.display = "inline-flex";
                }}
              />
              <span
                id="lid-fallback"
                style={{ display: "none" }}
                className="hidden items-center rounded-md bg-emerald-100 px-2 py-0.5 text-sm font-semibold text-emerald-800"
              >
                LID Consulting
              </span>
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              <Link className="text-sm text-emerald-800 hover:underline" href="/snapshot">Parent Snapshot</Link>
              <Link className="text-sm text-emerald-800 hover:underline" href="/dashboard">Client Dashboard</Link>
              <Link className="text-sm text-emerald-800 hover:underline" href="/providers">Providers</Link>
              <Link className="text-sm text-emerald-800 hover:underline" href="/leads">Leads</Link>
              <Link className="text-sm text-emerald-800 hover:underline" href="/auditor">Auditor</Link>
            </nav>
          </div>
        </div>

        {children}

        <footer className="mx-auto max-w-7xl px-6 pb-10 pt-6 text-xs text-slate-500">
          <div className="flex flex-col items-start justify-between gap-3 border-t pt-4 md:flex-row md:items-center">
            <div>© {new Date().getFullYear()} LID Consulting — Childcare Performance</div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-700">Evidence-first</span>
              <span>•</span>
              <span>OPEX resilience</span>
              <span>•</span>
              <span>NQS & disclosure ready</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
