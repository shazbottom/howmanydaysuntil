import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { THEME_STORAGE_KEY } from "../lib/theme";
import { SiteFooter } from "../components/SiteFooter";

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
  title: "How Many Days Until Any Date? (Live Countdown)",
  description:
    "Find out how many days until any date. Live countdown for holidays, birthdays, events, and deadlines.",
  alternates: {
    canonical: "https://daysuntil.is",
  },
  openGraph: {
    title: "How Many Days Until Any Date? (Live Countdown)",
    description:
      "Find out how many days until any date. Live countdown for holidays, birthdays, events, and deadlines.",
    url: "https://daysuntil.is",
    siteName: "DaysUntil",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Many Days Until Any Date? (Live Countdown)",
    description:
      "Find out how many days until any date. Live countdown for holidays, birthdays, events, and deadlines.",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const themeInitializationScript = `
  (() => {
    try {
      const root = document.documentElement;
      const stored = window.localStorage.getItem("${THEME_STORAGE_KEY}");
      const resolvedTheme = stored === "dark" ? "dark" : "light";

      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
      root.dataset.themePreference = resolvedTheme;
      root.style.colorScheme = resolvedTheme;
    } catch {}
  })();
`;

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
