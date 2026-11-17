import type { Metadata, Viewport } from "next";
import { Jost, Newsreader } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Providers } from "@/components/providers";
import { extensionGuardScript } from "@/lib/extension-guard";
import { getCatalog } from "@/lib/server/catalog";
import { shopLinks, site } from "@/lib/site";
import "./globals.css";

/* Display serif: Newsreader, optical sizing on, so large headings get finer
   detail and small ones stay sturdy. Softer contrast than a Didone, so thin
   strokes never break up at any size. */
const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "KalaDori Textile — Handwoven Sarees, Kurtis & Pants",
    template: "%s — KalaDori Textile",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "KalaDori",
    "handwoven sarees",
    "Banarasi silk saree",
    "Chanderi saree",
    "chikankari kurti",
    "linen trousers",
    "Indian designer clothing",
    "slow fashion India",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  // No canonical / og:url here: they would be inherited by every route that
  // doesn't set its own (including not-found). Each page declares its own.
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: "KalaDori Textile — Handwoven Sarees, Kurtis & Pants",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "KalaDori Textile — Handwoven Sarees, Kurtis & Pants",
    description: site.description,
  },
  // Lotus logo pack (public/brand). SVG first for modern browsers, ICO and PNG for the rest.
  icons: {
    icon: [
      { url: "/brand/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon/favicon.ico", sizes: "48x48" },
      { url: "/brand/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/brand/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F6F1EA",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Menu links follow the categories managed in the admin (cached catalogue).
  const shop = shopLinks((await getCatalog()).categories);
  return (
    // suppressHydrationWarning: extensions also stamp attributes on <html> / <body> themselves.
    <html lang="en-IN" className={`${serif.variable} ${jost.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Must run before hydration: see lib/extension-guard.ts */}
        <script dangerouslySetInnerHTML={{ __html: extensionGuardScript }} />
      </head>
      <body className="flex min-h-svh flex-col" suppressHydrationWarning>
        <Providers>
          <a
            href="#main"
            className="eyebrow fixed left-4 top-4 z-[100] -translate-y-20 bg-ink px-4 py-3 text-ivory transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <Header primary={shop} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer shop={shop} />
          <WhatsAppButton />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
