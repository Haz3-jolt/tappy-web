import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tappy — Your phone, upgraded by AI",
  description: "Join the Tappy waitlist and get the Android APK when it drops.",
  openGraph: {
    title: "Tappy — Your phone, upgraded by AI",
    description: "A mobile AI companion that taps, types, scrolls, and teaches across apps.",
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
