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
  description: "The premier modern fantasy Skyblock experience on Hytale. Join now at play.hytheria.gg",
  keywords: ["hytale", "skyblock", "minecraft", "server", "gaming", "fantasy"],
  authors: [{ name: "Hytheria" }],
  creator: "Hytheria",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hytheria.gg",
    siteName: "Hytheria",
    title: "Hytheria - Skyblock Reimagined",
    description: "The premier modern fantasy Skyblock experience on Hytale.",
    images: [
      {
        url: "/images/background.png",
        width: 1200,
        height: 630,
        alt: "Hytheria - Skyblock Reimagined",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hytheria - Skyblock Reimagined",
    description: "The premier modern fantasy Skyblock experience on Hytale.",
    images: ["/images/background.png"],
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
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
