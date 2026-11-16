import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
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
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${bodoni.variable} ${jost.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <Providers>
          <a
            href="#main"
            className="eyebrow fixed left-4 top-4 z-[100] -translate-y-20 bg-ink px-4 py-3 text-ivory transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
