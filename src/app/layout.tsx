import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// =============================================================================
// Font Configuration
// =============================================================================
// Inter — body text (as specified in Stitch design palette)
// Poppins — headings (as specified in Stitch design palette)

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

// =============================================================================
// Global Metadata
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: "MDCAT in Second — Practice Smarter. Analyze Better. Score Higher.",
    template: "%s | MDCAT in Second",
  },
  description:
    "The medical-grade Q-Bank built for Pakistan's top MDCAT aspirants. Master every subject with detailed analytics, exam-precision timed quizzes, and full-length simulations.",
};

// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
