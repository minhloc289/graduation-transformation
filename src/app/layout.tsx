import type { Metadata } from "next";
import { Outfit, Anton } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MONOLITH | 30-Day Transformation",
  description: "30-Day Transformation Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
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
      </body>
    </html>
  );
}
