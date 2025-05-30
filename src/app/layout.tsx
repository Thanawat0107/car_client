import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navber from "@/components/layouts/Navber";
import Footer from "@/components/layouts/Footer";
import { Providers } from "./Providers";
import AuthProvider from "./AuthProvider";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navber />
          <main className="container mx-auto flex-grow">
            <AuthProvider>{children}</AuthProvider>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}