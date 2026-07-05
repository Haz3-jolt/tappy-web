import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tappy — tiny pink phone sidekick",
  description: "Download the embedded Tappy Android APK or join the waitlist for the next quirky build.",
  openGraph: {
    title: "Tappy — tiny pink phone sidekick",
    description: "A playful Android helper for tapping through phone chores.",
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
