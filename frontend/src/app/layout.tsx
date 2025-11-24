import "./globals.css";
import { ReactNode } from "react";
import { WalletContextProvider } from "@/components/wallet/WalletProvider";
import { NavBar } from "@/components/layout/Navbar";

export const metadata = {
  title: "Solance",
  description: "On-chain freelance contracts on Solana"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          <div className="min-h-screen bg-slate-950 text-slate-50">
            <NavBar />
            <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
