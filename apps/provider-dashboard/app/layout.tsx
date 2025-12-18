import type { Metadata } from "next";
// 1. We gebruiken de ingebouwde Google Font loader
import { Inter } from "next/font/google"; 
import "./globals.css";

// 2. Configureer het font (downloadt automatisch en optimaliseert)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenEPD Zorgverlener",
  description: "Zorgverlenersportaal voor OpenEPD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // We houden de suppressHydrationWarning erin voor je browser-extensies
    <html lang="nl" suppressHydrationWarning>
      {/* 3. Pas de className toe op de body */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}