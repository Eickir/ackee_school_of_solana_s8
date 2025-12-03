import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { WalletContextProvider } from "@/components/wallet/WalletProvider";
import { NavBar } from "@/components/layout/Navbar";
import { RoleProvider } from "@/components/layout/RoleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solance",
  description: "On-chain freelance contracts on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen`}
      >
        <WalletContextProvider>
          <RoleProvider>
            <div className="min-h-screen flex flex-col">
              <NavBar />
              <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
                {children}
              </main>
            </div>
          </RoleProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
