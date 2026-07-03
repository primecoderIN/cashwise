import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import AppNavbar from "@/components/layout/AppNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CashWise — Smart Expense Tracker",
  description: "Track, categorize, and analyze your expenses with elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} min-h-screen flex flex-col bg-background antialiased`}>
          <Providers>
            <AppNavbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:px-8">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
