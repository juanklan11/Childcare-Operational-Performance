import Link from "next/link";
export default function Home(){
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6 px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Allaf Childcare Operational Performance – Site 1</h1>
      <p className="text-slate-600">Welcome. Choose a view below.</p>
      <div className="flex flex-wrap gap-3">
        <Link className="rounded-xl border bg-white px-4 py-2 shadow-sm hover:bg-slate-50" href="/snapshot">Parent Snapshot (public)</Link>
        <Link className="rounded-xl border bg-white px-4 py-2 shadow-sm hover:bg-slate-50" href="/dashboard">Client Dashboard (private)</Link>
      </div>
      <p className="text-xs text-slate-500">The Dashboard is protected by Basic Auth; use credentials set in environment variables.</p>
    </main>
  );
}
