// /app/api/providers/route.ts
import { NextResponse } from "next/server";
import { providers as SEED, type Provider } from "@/data/providers";

// Optional: ISR-style cache hint for static hosting
export const revalidate = 3600; // seconds

type SortKey = "size" | "need" | "name";

function withPriority(p: Provider) {
  const score = p.audit_need_score ?? 0;
  const priority = score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";
  return { ...p, priority };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = (searchParams.get("sort") as SortKey) || "size"; // size | need | name
  const min = Number(searchParams.get("minServices") ?? 0);
  const state = searchParams.get("state"); // NSW,VIC,...
  const q = (searchParams.get("q") || "").toLowerCase();

  // Base filter
  let rows = SEED
    .map(withPriority)
    .filter((p) => (p.services ?? 0) >= min)
    .filter((p) => (state ? (p.states || []).includes(state as any) : true))
    .filter((p) => (q ? p.name.toLowerCase().includes(q) : true));

  // Sorting
  rows.sort((a, b) => {
    if (sort === "need") {
      return (b.audit_need_score - a.audit_need_score) || ((b.services ?? 0) - (a.services ?? 0)) || a.name.localeCompare(b.name);
    }
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }
    // default: size
    return ((b.services ?? 0) - (a.services ?? 0)) || (b.audit_need_score - a.audit_need_score) || a.name.localeCompare(b.name);
  });

  return NextResponse.json(
    {
      count: rows.length,
      sort,
      filters: { minServices: min, state: state || null, q: q || null },
      updatedAt: new Date().toISOString(),
      providers: rows
    },
    {
      headers: {
        // Cached at the edge, revalidated transparently
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400"
      }
    }
  );
}
