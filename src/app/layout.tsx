import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import "@fontsource/medievalsharp/400.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/noto-serif/400.css";
import "@fontsource/noto-serif/700.css";

export const metadata: Metadata = {
  title: "Hytheria - Skyblock Reimagined",
  description: "The premier modern fantasy Skyblock experience.",
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
