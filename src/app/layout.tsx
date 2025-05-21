import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navber from "@/components/layouts/Navber";
import { Providers } from "./providers";
import Footer from "@/components/layouts/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบบริหารจัดการรถยนต์มือสอง",
  description: "ระบบบริหารจัดการรถยนต์มือสองในชุมชน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navber />
        <main className="container mx-auto">
          <Providers>{children}</Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}