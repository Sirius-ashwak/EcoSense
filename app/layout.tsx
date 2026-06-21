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

/**
 * SEO and Open Graph metadata for EcoSense.
 * Provides rich previews when shared on social media.
 */
export const metadata: Metadata = {
  title: "EcoSense — AI-Powered Carbon Footprint Tracker",
  description:
    "Log your daily activities in plain English and get instant carbon footprint analysis with personalized sustainability tips. Track Transit, Diet, Energy, Shopping & Waste emissions.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "NLP",
    "emissions tracker",
    "climate change",
    "eco-friendly",
  ],
  authors: [{ name: "EcoSense Team" }],
  openGraph: {
    title: "EcoSense — AI-Powered Carbon Footprint Tracker",
    description:
      "Analyze your daily carbon emissions with natural language. Get personalized tips to reduce your environmental impact.",
    type: "website",
  },
};

/**
 * RootLayout — The top-level layout for the EcoSense application.
 * Sets the HTML language, applies global fonts, and wraps all pages.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
