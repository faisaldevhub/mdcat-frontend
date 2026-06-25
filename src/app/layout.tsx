import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// =============================================================================
// Font Configuration
// =============================================================================
// Inter is the primary font per the Stitch design system.

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// =============================================================================
// Global Metadata
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: "MDCAT Platform — Exam Preparation",
    template: "%s | MDCAT Platform",
  },
  description:
    "Comprehensive MDCAT exam preparation platform with practice quizzes, analytics, gamification, and personalized study plans.",
};

// =============================================================================
// Root Layout
// =============================================================================
// All pages inherit from this layout. It provides:
// - HTML structure with lang and font
// - Global providers (TanStack Query)
// - CSS variables for Tailwind

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
