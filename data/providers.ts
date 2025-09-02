// /data/providers.ts
export type Provider = {
  id: string;
  name: string;
  website?: string;
  // Number of services (centres). Fill from StartingBlocks “Large Providers”
  services?: number | null;
  // States/territories where they operate (optional)
  states?: Array<"NSW"|"VIC"|"QLD"|"SA"|"WA"|"TAS"|"ACT"|"NT">;
  // 0–100: higher = greater need/benefit for an environmental/operational audit
  audit_need_score: number;
  // short justification you can show in a tooltip
  rationale?: string;
  // Optional contact fields (leave null if not publicly published)
  contact?: { name?: string; email?: string } | null;
};

export const providers: Provider[] = [
  {
    id: "goodstart",
    name: "Goodstart Early Learning",
    website: "https://www.goodstart.org.au/",
    services: null, // TODO: insert count from StartingBlocks page
    states: ["NSW","VIC","QLD","SA","WA","TAS","ACT","NT"],
    audit_need_score: 78,
    rationale: "Large national footprint; material energy and water spend; strong ROI from portfolio tune-ups.",
    contact: null
  },
  {
    id: "g8",
    name: "G8 Education",
    website: "https://g8education.edu.au/",
    services: null,
    states: ["NSW","VIC","QLD","SA","WA","NT"],
    audit_need_score: 82,
    rationale: "Scale + brand diversity; high savings potential via metering, procurement, and controls standardisation.",
    contact: null
  },
  {
    id: "guardian",
    name: "Guardian Childcare & Education",
    website: "https://www.guardian.edu.au/",
    services: null,
    states: ["NSW","VIC","QLD","SA","WA","ACT"],
    audit_need_score: 76,
    rationale: "Urban concentration; parent-facing brand—verified ops performance helps enrolments and ESG.",
    contact: null
  },
  {
    id: "affinity",
    name: "Affinity Education Group",
    website: "https://affinityeducation.com.au/",
    services: null,
    states: ["NSW","VIC","QLD","WA","NT"],
    audit_need_score: 74,
    rationale: "Mixed-age building stock; strong potential for quick-win retrofits and tariff optimisation.",
    contact: null
  },
  {
    id: "busybees",
    name: "Busy Bees Early Learning",
    website: "https://www.busybees.edu.au/",
    services: null,
    states: ["NSW","VIC","QLD","SA","WA","ACT"],
    audit_need_score: 79,
    rationale: "Portfolio breadth; PV + HVAC optimisation likely to yield double-digit savings at scale.",
    contact: null
  },
  {
    id: "oac",
    name: "Only About Children (Oac)",
    website: "https://www.oac.edu.au/",
    services: null,
    states: ["NSW","VIC","QLD"],
    audit_need_score: 69,
    rationale: "Metro-heavy sites; strong brand—parent-friendly KPIs (NEPI/IEQ) valuable for enrolment confidence.",
    contact: null
  },
  {
    id: "edge",
    name: "Edge Early Learning",
    website: "https://edgeearlylearning.com.au/",
    services: null,
    states: ["QLD","NSW","SA"],
    audit_need_score: 67,
    rationale: "Growth corridors; standardising evidence and metering de-risks ratings & reduces OPEX.",
    contact: null
  },
  {
    id: "mayfield",
    name: "Mayfield Childcare",
    website: "https://mayfieldchildcare.com.au/",
    services: null,
    states: ["VIC","QLD"],
    audit_need_score: 65,
    rationale: "Mid-cap portfolio; benefit from procurement resets and building fabric tune-ups.",
    contact: null
  },
  {
    id: "storyhouse",
    name: "Story House Early Learning",
    website: "https://www.storyhouse.com.au/",
    services: null,
    states: ["NSW","VIC","QLD"],
    audit_need_score: 66,
    rationale: "Portfolio consolidation opportunities; waste & water optimisation add fast wins.",
    contact: null
  },
  {
    id: "nido",
    name: "Nido Early School",
    website: "https://nido.edu.au/",
    services: null,
    states: ["WA","SA","VIC","NSW","QLD"],
    audit_need_score: 64,
    rationale: "Mixed climate zones; HVAC/controls tuning and IEQ comms are compelling.",
    contact: null
  },
  {
    id: "greenleaves",
    name: "Green Leaves Early Learning",
    website: "https://greenleaveselc.com.au/",
    services: null,
    states: ["NSW","VIC","QLD","SA","WA"],
    audit_need_score: 68,
    rationale: "High design standard—operational evidence (NEPI/IEQ) turns design promise into measurable outcomes.",
    contact: null
  },
  {
    id: "guardian2",
    name: "Guardian (Regional Clusters Example)", // keep or remove when you populate real list
    website: "https://www.guardian.edu.au/",
    services: null,
    states: ["NSW","VIC"],
    audit_need_score: 60,
    rationale: "Filler row to show structure; replace with real providers from StartingBlocks list.",
    contact: null
  }
];
