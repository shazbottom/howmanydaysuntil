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
  metadataBase: new URL("https://howmanydaysuntil.is"),
  title: {
    default: "How Many Days Until? Countdown to Events and Dates",
    template: "%s | howmanydaysuntil.is",
  },
  description:
    "Find out how many days until holidays, years, and important dates with simple live countdowns.",
  alternates: {
    canonical: "/",
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
