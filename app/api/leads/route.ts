// app/api/leads/route.ts
import { NextResponse } from "next/server";

type Row = { serviceName: string; provider: string; address: string };

const mockRows: Row[] = [
  { serviceName: "Little Explorers ELC", provider: "Allaf Property Group", address: "8–10 Mailey St, Sunshine West VIC" },
  { serviceName: "Riverbank Early Learning", provider: "Kinder Co.", address: "25 Princes Hwy, Werribee VIC" },
  { serviceName: "Bayview Kids", provider: "Coastal ELC Pty Ltd", address: "10 Nepean Hwy, Frankston VIC" },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || ""; // optional search term
  const resource = process.env.DATA_GOV_RESOURCE_ID; // e.g. a CKAN resource UUID
  const base =
    process.env.DATA_GOV_BASE ||
    "https://data.gov.au/data/api/3/action/datastore_search";
  const apiKey = process.env.DATA_GOV_API_KEY; // optional

  if (!resource) {
    return NextResponse.json({
      rows: mockRows,
      note: "No DATA_GOV_RESOURCE_ID set; serving mock rows.",
    });
  }

  try {
    // Basic CKAN datastore_search query; adjust fields once you know the schema
    const endpoint = `${base}?resource_id=${resource}&limit=25${q ? `&q=${encodeURIComponent(q)}` : ""}`;
    const res = await fetch(endpoint, {
      headers: apiKey ? { "X-API-KEY": apiKey } : {},
      // cache one hour; tweak as needed
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    const data = await res.json();
    const records = data?.result?.records || [];

    const rows: Row[] = records
      .map((r: any) => ({
        // Map these defensively — different datasets use different keys
        serviceName:
          r.service_name || r.ServiceName || r.service || r.name || "",
        provider:
          r.approved_provider_name ||
          r.Provider ||
          r.provider_name ||
          r.operator ||
          "",
        address: [
          r.address_line_1 || r.Address1 || r.address,
          r.suburb || r.Locality,
          r.state || r.State,
          r.postcode || r.Postcode,
        ]
          .filter(Boolean)
          .join(", "),
      }))
      .filter((r: Row) => r.serviceName || r.provider || r.address);

    return NextResponse.json({ rows });
  } catch (err: any) {
    return NextResponse.json(
      { rows: mockRows, error: String(err) },
      { status: 200 }
    );
  }
}

