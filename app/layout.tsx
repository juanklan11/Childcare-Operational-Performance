import "./globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Childcare Energy – NEPI",
  description: "NABERS Childcare dashboard and public snapshot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
