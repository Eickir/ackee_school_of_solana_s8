// frontend/app/dashboard/page.tsx
"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();

  if (!connected) {
    return (
      <div className="mt-10 space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-300 text-sm">
          Please connect your wallet to view your Solance activity.
        </p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-slate-300 text-sm break-all">
        Connected as: <span className="font-mono">{publicKey?.toBase58()}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-slate-800 rounded-lg p-4">
          <h2 className="font-medium mb-2">Client activity</h2>
          <p className="text-xs text-slate-400">
            Here you’ll later display contracts you created, their status, total
            locked SOL, etc.
          </p>
        </div>
        <div className="border border-slate-800 rounded-lg p-4">
          <h2 className="font-medium mb-2">Contractor activity</h2>
          <p className="text-xs text-slate-400">
            Here you’ll later show proposals sent, accepted contracts, payments
            claimed, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
