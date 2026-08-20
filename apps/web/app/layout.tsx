import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Costiq",
  description: "Bank SMS in, categorized expenses out.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the page draw under the OS/browser chrome (iOS Safari's bottom
  // toolbar, Android gesture bar) instead of being covered by it, and makes
  // env(safe-area-inset-*) resolve to real values for our fixed bottom nav.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/*
          THESIS: The landing page proves Costiq's mechanism by pairing, not claiming —
          every screenful mirrors an SMS on one side against its parsed result on the
          other, refusing the generic feature-card SaaS template.
          OWN-WORLD: Costiq's existing navy/vermilion/mint palette and Manrope type,
          applied to full-height scroll-snapped two-panel spreads with a hairline seam
          rule — no new palette or typeface.
          STORY: A visitor watches their own kind of bank SMS answered by Costiq,
          spread by spread, believes the automatic-categorization claim because they
          watched it happen, and signs in free.
          FIRST VIEWPORT: Full-height hero spread — a real bank/UPI SMS on the left,
          its parsed categorized entry mirrored on the right, headline and CTA
          overlaid on the left panel.
          FORM: The Paired Spread, challenger "harper's-bazaar-brodovitch-spread" fused
          against dealt structure "long-form editorial" (surface concept-seed key
          4d20b24f, round 2/safer).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, DESIGN.md, and every shipping raster carrying
          its provenance.
        */}
        {children}
      </body>
    </html>
  );
}
