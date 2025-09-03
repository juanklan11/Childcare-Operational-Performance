"use client";
import Image from "next/image";
import Link from "next/link";

export default function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lid/15">
            <Image src="/lid-logo.png" alt="LID" width={24} height={24} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">LID Consulting</div>
            <div className="text-xs text-slate-500">Childcare Sustainability</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Link className="text-sm text-slate-600 hover:text-slate-900" href="/snapshot">Snapshot</Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" href="/dashboard">Dashboard</Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" href="/leads">Leads</Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" href="/providers">Providers</Link>
          <Link className="rounded-full bg-lid px-3 py-1 text-sm font-medium text-white hover:bg-lid-600" href="/auditor">Auditor</Link>
        </nav>
      </div>
    </header>
  );
}
