import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import ToasterProvider from "@/components/providers/ToasterProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fledge",
  description: "E Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ToasterProvider />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
