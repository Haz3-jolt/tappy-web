import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tappy — helps your phone tap stuff",
  description: "Download the embedded Tappy Android APK or join the iOS waitlist.",
  openGraph: {
    title: "Tappy — helps your phone tap stuff",
    description: "A tiny Android helper for testing phone actions.",
    type: "website",
  },
  icons: {
    icon: "/tappy-glyph.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
