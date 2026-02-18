import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import "@fontsource/medievalsharp/400.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/noto-serif/400.css";
import "@fontsource/noto-serif/700.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hytheria.gg"),
  title: {
    default: "Hytheria - Skyblock Reimagined",
    template: "%s | Hytheria",
  },
  description: "Hytheria provides The ultimate Hytale SkyBlock experience. Build your island and rise to the top.",
  keywords: ["hytale", "skyblock", "minecraft", "server", "gaming", "fantasy"],
  authors: [{ name: "Hytheria" }],
  creator: "Hytheria",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hytheria.gg",
    siteName: "Hytheria",
    title: "Hytheria - Skyblock Reimagined",
    description: "Hytheria provides The ultimate Hytale SkyBlock experience. Build your island and rise to the top.",
  },
  twitter: {
    card: "summary",
    title: "Hytheria - Skyblock Reimagined",
    description: "Hytheria provides The ultimate Hytale SkyBlock experience. Build your island and rise to the top.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#ca8a04" />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
