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
  title: {
    default: "Realm Forge",
    template: "%s | Realm Forge",
  },
  description: "The fantasy worldbuilding app for authors and dungeon masters.",
  keywords: ["worldbuilding", "dnd", "fantasy", "writing", "dungeon master"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-forge-base text-forge-parchment`}
      >
        {children}
      </body>
    </html>
  );
}
