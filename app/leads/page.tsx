import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Lead = {
  ref: string;
  name: string;
  contact_ph?: string;
  url?: string;
  coordinates?: string; // "-37.79, 144.91"
};

async function getLeads(): Promise<Lead[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/leads`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      const rows: Lead[] = Array.isArray(data) ? data : data.records ?? data.rows ?? [];
      if (Array.isArray(rows) && rows.length) return rows;
    }
  } catch {
    // ignore and use fallback
  }
  // Fallback sample — mirrors CSV columns you mentioned
  return [
    { ref: "104202", name: "MAMA Midwives and Mothers Australia", contact_ph: "03 9376 7474", url: "http://www.midwivesandmothers.com.au", coordinates: "-37.79241689, 144.91946965" },
    { ref: "101064", name: "Yarra Park Children's Centre", contact_ph: "9428 0896", url: "http://emcc.org.au/yarra.php", coordinates: "-37.81862706, 144.98854292" },
    { ref: "563554", name: "Kensington Community Children's Co-Operative", contact_ph: "03 9376 4565", url: "http://www.kccc.org.au", coordinates: "-37.79710602, 144.92552634" },
    { ref: "102696", name: "Central Carlton Childrens Centre", contact_ph: "03 9096 5447", url: "http://www.dhhs.vic.gov.au", coordinates: "-37.7940351, 144.9694206" },
    { ref: "579072", name: "Queensberry Childrens Centre", contact_ph: "03 8344 9621", url: "http://www.pb.unimelb.edu.au/ehs/", coordinates: "-37.80416898, 144.96092293" },
  ];
}

export default async function LeadsPage() {
  const leads = await getLeads();

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
              <div className="text-sm font-semibold tracking-tight">Leads</div>
              <div className="text-xs text-slate-500">Admin view</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex text-xs text-slate-500">
            <span>Basic-auth protected</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Childcare Leads (sample)</h1>
        <p className="mt-1 text-sm text-slate-600">Columns match your CSV: <code>ref</code>, <code>name</code>, <code>contact_ph</code>, <code>url</code>, <code>coordinates</code>.</p>

        <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-2">Ref</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Website</th>
                <th className="px-4 py-2">Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((r, i) => (
                <tr key={`${r.ref}-${i}`} className="border-t">
                  <td className="px-4 py-2 font-medium">{r.ref}</td>
                  <td className="px-4 py-2 text-slate-800">{r.name}</td>
                  <td className="px-4 py-2">{r.contact_ph ?? "—"}</td>
                  <td className="px-4 py-2">
                    {r.url ? (
                      <a href={r.url} className="text-emerald-700 underline hover:text-emerald-800" target="_blank">
                        Visit
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2">{r.coordinates ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-[11px] italic text-slate-500">
          Replace with your data source (CSV/API) via <code>/api/leads</code>. This page is dynamic and won’t be pre-rendered.
        </div>
      </main>
    </div>
  );
}
