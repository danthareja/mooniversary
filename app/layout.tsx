import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Mooniversary",
  description: "Mooniversary tracking for lalas",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  userScalable: false,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div id="__next" className="h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
