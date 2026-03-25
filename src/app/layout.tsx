import type { Metadata } from "next";
import { Outfit, Anton } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Sidebar from "@/components/Sidebar";
import ChatWidget from "@/components/ChatWidget";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GRIND | Graduation Transformation",
    template: "%s | GRIND",
  },
  description: "33-Day Graduation Cut — Debloat & Transform. Track your fitness journey to graduation day.",
  openGraph: {
    title: "GRIND | Graduation Transformation",
    description: "33-Day Graduation Cut — Debloat & Transform",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${anton.variable} ${outfit.variable} antialiased flex min-h-screen`}
      >
        <Sidebar />
        {/* pt-16 on mobile for the top bar, lg:pt-0 + lg:ml-64 for desktop sidebar */}
        <main className="flex-1 min-h-screen pt-16 lg:pt-0 lg:ml-64">
          {children}
        </main>
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
