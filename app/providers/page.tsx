import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Provider = {
  name: string;
  centres?: number;          // preferred key
  services?: number;         // alt key
  size?: number | string;    // alt key
  states?: string[] | string;
  segment?: string;
  website?: string;
  notes?: string;
  needAudit?: number | string; // 1–5 or label
};

async function getProviders(): Promise<Provider[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/providers`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`API /api/providers ${res.status}`);
    const data = await res.json();
    const arr: Provider[] = Array.isArray(data) ? data : data.providers ?? [];
    if (Array.isArray(arr) && arr.length) return arr;
  } catch {
    // fall through to fallback
  }
  // Fallback dataset (ensures table renders)
  return [
    { name: "Goodstart Early Learning", centres: 640, states: ["All states"], segment: "Not-for-profit", website: "https://www.goodstart.org.au", needAudit: 4 },
    { name: "G8 Education", centres: 430, states: ["All states"], segment: "ASX-listed", website: "https://g8education.edu.au", needAudit: 5 },
    { name: "Affinity Education Group", centres: 225, states: ["NSW","VIC","QLD","WA","SA"], segment: "Private", website: "https://affinityeducation.com.au", needAudit: 4 },
    { name: "Guardian Childcare & Education", centres: 180, states: ["NSW","VIC","QLD","SA","WA"], segment: "Private", website: "https://www.guardian.edu.au", needAudit: 4 },
    { name: "Busy Bees", centres: 150, states: ["National"], segment: "Private", website: "https://www.busybees.edu.au", needAudit: 3 },
    { name: "Only About Children", centres: 80, states: ["NSW","VIC","QLD"], segment: "Private", website: "https://www.oac.edu.au", needAudit: 3 },
    { name: "KU Children’s Services", centres: 120, states: ["NSW","ACT"], segment: "Not-for-profit", website: "https://www.ku.com.au", needAudit: 3 },
    { name: "C&K", centres: 330, states: ["QLD"], segment: "Not-for-profit", website: "https://www.candk.asn.au", needAudit: 3 },
  ];
}

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Brand header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <Image src="/lid-logo.svg" alt="LID Consulting" width={20} height={20} className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">Large Providers</div>
              <div className="text-xs text-slate-500">Admin view</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex text-xs text-slate-500">
            <span>Basic-auth protected</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">StartingBlocks — Large Providers</h1>
        <p className="mt-1 text-sm text-slate-600">
          Organised by company size and indicative need for environmental audits (1–5). Replace with live API values when available.
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-2">Provider</th>
                <th className="px-4 py-2">Centres</th>
                <th className="px-4 py-2">States</th>
                <th className="px-4 py-2">Segment</th>
                <th className="px-4 py-2">Need for audit</th>
                <th className="px-4 py-2">Website</th>
              </tr>
            </thead>
            <tbody>
              {providers
                .slice()
                .sort((a, b) => {
                  const as = Number(a.centres ?? a.services ?? a.size ?? 0);
                  const bs = Number(b.centres ?? b.services ?? b.size ?? 0);
                  return bs - as;
                })
                .map((p, i) => {
                  const centres = (p.centres ?? p.services ?? p.size ?? "—") as number | string;
                  const states = Array.isArray(p.states) ? p.states.join(", ") : p.states ?? "—";
                  const need = typeof p.needAudit === "number" ? `${p.needAudit}/5` : p.needAudit ?? "—";
                  return (
                    <tr key={`${p.name}-${i}`} className="border-t">
                      <td className="px-4 py-2 font-medium text-slate-800">{p.name}</td>
                      <td className="px-4 py-2">{centres}</td>
                      <td className="px-4 py-2">{states}</td>
                      <td className="px-4 py-2">{p.segment ?? "—"}</td>
                      <td className="px-4 py-2">{need}</td>
                      <td className="px-4 py-2">
                        {p.website ? (
                          <a href={p.website} className="text-emerald-700 underline hover:text-emerald-800" target="_blank">
                            Visit
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-[11px] italic text-slate-500">
          Source: StartingBlocks large providers (seeded); replace via <code>/api/providers</code>.
        </div>
      </main>
    </div>
  );
}
