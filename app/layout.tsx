import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { TripProvider } from "../components/TripContext";
import { LanguageProvider } from "../components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mik Adventures - Your Gateway to Amazing Journeys",
  description: "Discover extraordinary travel experiences with Mik Adventures. Explore handpicked destinations, unforgettable adventures, and create memories that last a lifetime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <LanguageProvider>
          <TripProvider>
            {children}
          </TripProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
