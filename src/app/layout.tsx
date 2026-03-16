import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daysuntil.is"),
  title: "DaysUntil  Countdown to Any Date",
  description:
    "Calculate how many days until any date. Fast, simple countdown for birthdays, holidays, events, and deadlines.",
  alternates: {
    canonical: "https://daysuntil.is",
  },
  openGraph: {
    title: "DaysUntil  Countdown to Any Date",
    description: "Calculate how many days until any date.",
    url: "https://daysuntil.is",
    siteName: "DaysUntil",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DaysUntil  Countdown to Any Date",
    description: "Calculate how many days until any date.",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Root App Router layout for global metadata, fonts, and shared styles.
export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
