import { NextResponse } from "next/server";

type VicRecord = {
  _id?: number;
  ref?: string;
  name?: string;
  contact_ph?: string;
  url?: string;
  coordinates?: string; // "-37.79, 144.91"
};

type LeadRow = {
  serviceName: string;
  provider: string;
  address: string;
  lat?: number;
  lng?: number;
};

function parseCoords(s?: string) {
  if (!s) return {};
  const [latStr, lngStr] = s.split(",").map((v) => v.trim());
  const lat = Number(latStr);
  const lng = Number(lngStr);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : {};
}

export async function GET(req: Request) {
  const base = process.env.VIC_DATA_BASE || "https://discover.data.vic.gov.au/api/3/action/datastore_search";
  const resource = process.env.VIC_RESOURCE_ID;
  const apiKey = process.env.VIC_API_KEY;

  if (!resource) {
    // Fall back to the existing mock when not configured
    return NextResponse.json({
      rows: [
        { serviceName: "Little Explorers ELC", provider: "Allaf Property Group", address: "8–10 Mailey St, Sunshine West VIC" },
        { serviceName: "Riverbank Early Learning", provider: "Kinder Co.", address: "25 Princes Hwy, Werribee VIC" },
        { serviceName: "Bayview Kids", provider: "Coastal ELC Pty Ltd", address: "10 Nepean Hwy, Frankston VIC" }
      ],
      note: "No VIC_RESOURCE_ID set; serving mock rows."
    });
  }

  // Allow simple query and limit (optional)
  const url = new URL(base);
  url.searchParams.set("resource_id", resource);
  const reqUrl = new URL(req.url);
  const limit = reqUrl.searchParams.get("limit") || "50";
  const q = reqUrl.searchParams.get("q") || "";
  url.searchParams.set("limit", limit);
  if (q) url.searchParams.set("q", q);

  const headers: Record<string, string> = { "Accept": "application/json" };
  if (apiKey) {
    // Cover common CKAN auth headers; most instances accept at least one of these.
    headers["Authorization"] = apiKey;
    headers["X-CKAN-API-Key"] = apiKey;
    headers["X-API-KEY"] = apiKey;
  }

  try {
    const r = await fetch(url.toString(), { headers, cache: "no-store" });
    if (!r.ok) throw new Error(`Upstream ${r.status}`);
    const data = await r.json();

    const recs: VicRecord[] = data?.result?.records || [];

    const rows: LeadRow[] = recs.map((rec) => {
      // Provider: pull host from URL if present; otherwise phone/name fallback
      let provider = "";
      try {
        if (rec.url) provider = new URL(rec.url).hostname.replace(/^www\./, "");
      } catch { /* ignore bad URLs */ }
      if (!provider) provider = rec.contact_ph || "—";

      const { lat, lng } = parseCoords(rec.coordinates);

      return {
        serviceName: rec.name || "—",
        provider,
        address: lat && lng ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "—",
        lat,
        lng
      };
    });

    return NextResponse.json({
      rows,
      source: "Data.Vic CKAN datastore_search",
      resource_id: resource,
      total: data?.result?.total ?? rows.length
    });
  } catch (e: any) {
    // Graceful fallback with note
    return NextResponse.json(
      {
        rows: [],
        error: `Fetch failed: ${e?.message || e}`,
        note: "Check env vars and that the API is reachable from Vercel."
      },
      { status: 502 }
    );
  }
}
