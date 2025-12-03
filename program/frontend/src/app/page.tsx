"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function HomePage() {
  const { connected } = useWallet();

  return (
    <div className="flex flex-col gap-10">
      <section className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Solance</h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          A decentralized freelance platform on Solana. Clients create
          contracts, contractors submit proposals, funds are locked in a vault
          and released only when the work is done.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <WalletButton />
          {connected && (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="border border-slate-800 rounded-lg p-5">
          <h2 className="font-semibold mb-2">For Clients</h2>
          <p className="text-sm text-slate-300 mb-3">
            Create on-chain contracts, choose proposals and pay securely.
          </p>
          <ul className="text-sm text-slate-300 list-disc pl-4 space-y-1">
            <li>Create contracts with title & description</li>
            <li>Receive and compare proposals</li>
            <li>Lock payment into a vault</li>
            <li>Release funds only when work is done</li>
          </ul>
        </div>

        <div className="border border-slate-800 rounded-lg p-5">
          <h2 className="font-semibold mb-2">For Contractors</h2>
          <p className="text-sm text-slate-300 mb-3">
            Discover contracts, submit proposals and get paid automatically.
          </p>
          <ul className="text-sm text-slate-300 list-disc pl-4 space-y-1">
            <li>Register as contractor on-chain</li>
            <li>Submit proposals with your price</li>
            <li>Mark work as done</li>
            <li>Receive escrowed funds in SOL</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
