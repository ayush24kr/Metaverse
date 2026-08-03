import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediaVerse | Personal Entertainment Tracking Platform",
  description: "Unified media tracking for Movies, TV Shows, Anime, Manga, and Manhwa with AI insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090B] text-[#FAFAFA] antialiased selection:bg-[#3B82F6]/30 selection:text-[#3B82F6]`}>
        <ClerkProvider>
          <AppShell>{children}</AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}
