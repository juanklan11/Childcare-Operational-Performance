import { NextRequest, NextResponse } from "next/server";

type LeadRow = { serviceName?: string; provider?: string; address?: string };

const mockRows: LeadRow[] = [
  { serviceName: "Little Explorers ELC", provider: "Allaf Property Group", address: "8–10 Mailey St, Sunshine West VIC" },
  { serviceName: "Riverbank Early Learning", provider: "Kinder Co.", address: "25 Princes Hwy, Werribee VIC" },
  { serviceName: "Bayview Kids", provider: "Coastal ELC Pty Ltd", address: "10 Nepean Hwy, Frankston VIC" },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";            // free text
  const suburb = searchParams.get("suburb") || "";  // optional exact filter
  const limit = Number(searchParams.get("limit") || 25);
  const offset = Number(searchParams.get("offset") || 0);
  const debug = searchParams.get("debug") === "1";

  const apiKey = process.env.DATA_VIC_API_KEY;
  const base = process.env.DATA_VIC_BASE || "https://discover.data.vic.gov.au";
  const resourceId = process.env.DATA_VIC_RESOURCE_ID;

  // Fallback to mock if missing envs
  if (!apiKey || !resourceId) {
    return NextResponse.json({
      rows: mockRows,
      note: "No DATA_VIC_RESOURCE_ID or DATA_VIC_API_KEY set; serving mock rows.",
    });
  }

  // Build CKAN datastore_search query
  // You can change "Suburb" below if your resource uses a different column name.
  const suburbFilter = suburb
    ? `&filters=${encodeURIComponent(JSON.stringify({ Suburb: suburb }))}`
    : "";

  const url =
    `${base}/api/3/action/datastore_search` +
    `?resource_id=${encodeURIComponent(resourceId)}` +
    `&limit=${limit}&offset=${offset}` +
    (q ? `&q=${encodeURIComponent(q)}` : "") +
    suburbFilter;

  const resp = await fetch(url, {
    headers: {
      // CKAN expects the API key in the Authorization header
      Authorization: apiKey,
      Accept: "application/json",
    },
    // Avoid caching in Vercel edge
    cache: "no-store",
  });

  const data = await resp.json().catch(() => ({} as any));

  if (!resp.ok || !data?.success) {
    // Keep the UI alive on API errors
    return NextResponse.json({
      rows: mockRows,
      note: `CKAN request failed (${resp.status}). Serving mock rows.`,
      error: data?.error || null,
    });
  }

  const records: any[] = data?.result?.records || [];

  // Heuristic mapping — adjust keys to your resource’s field names
  const rows: LeadRow[] = records
    .map((r) => {
      const serviceName =
        r["Service Name"] || r["service_name"] || r["Premise_Name"] || r["ServiceName"] || r["service"] || "";
      const provider =
        r["Provider"] || r["Provider Name"] || r["provider_name"] || r["Organisation_Name"] || r["Operator"] || "";
      const address =
        [r["Address"], r["Suburb"], r["State"], r["Postcode"]]
          .filter(Boolean)
          .join(", ") ||
        r["address_string"] ||
        r["Street Address"] ||
        r["address"] ||
        "";

      return { serviceName, provider, address };
    })
    .filter((r) => r.serviceName || r.provider || r.address);

  if (debug) {
    return NextResponse.json({
      rows,
      total: data?.result?.total,
      sampleRawRecord: records[0] || null,
      fieldMappingNote:
        "Adjust field names in /app/api/leads/route.ts to match your resource columns.",
    });
  }

  return NextResponse.json({
    rows,
    total: data?.result?.total,
    note: "Live data from Data.Vic CKAN datastore.",
  });
}
