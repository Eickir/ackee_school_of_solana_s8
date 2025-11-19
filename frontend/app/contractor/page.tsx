"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ContractorPage() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="h-full min-h-[70vh] flex flex-col gap-6">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl font-semibold mb-1">Contractor dashboard</h1>
        <p className="text-sm text-slate-400">
          Browse missions, submit proposals, track your work and payments as a freelancer.
        </p>
      </header>

      {/* Wallet not connected */}
      {!connected && (
        <p className="text-sm text-amber-400">
          Please connect your wallet to access your contractor tools.
        </p>
      )}

      {/* Connected view */}
      {connected && (
        <>
          {/* Small info about current wallet */}
          <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs">
            <p className="text-slate-400 mb-1">
              Connected as contractor wallet:
            </p>
            <p className="font-mono break-all text-slate-100">
              {publicKey?.toBase58()}
            </p>
          </section>

          {/* Main actions */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Available missions */}
            <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3 flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Available missions</h2>
              <p className="text-xs text-slate-400">
                Explore open contracts from clients and send your proposals.
              </p>
              <Link
                href="/contractor/available-contracts"
                className="inline-flex text-xs px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 mt-1"
              >
                View open contracts
              </Link>
            </section>

            {/* My missions (accepted contracts) */}
            <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3 flex flex-col gap-2">
              <h2 className="text-sm font-semibold">My missions</h2>
              <p className="text-xs text-slate-400">
                See contracts where you have been selected as contractor.
                You can mark work as done from there.
              </p>
              <Link
                href="/contractor/my-missions"
                className="inline-flex text-xs px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 mt-1"
              >
                Go to my missions
              </Link>
            </section>

            {/* Pending payments */}
            <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3 flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Pending payments</h2>
              <p className="text-xs text-slate-400">
                Contracts you finished (Closed) and that are waiting for the client
                to release your payment.
              </p>
              <Link
                href="/contractor/pending-payments"
                className="inline-flex text-xs px-3 py-1 rounded bg-fuchsia-500 hover:bg-fuchsia-600 mt-1"
              >
                View pending payments
              </Link>
            </section>

            {/* Proposals */}
            <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3 flex flex-col gap-2">
              <h2 className="text-sm font-semibold">Your proposals</h2>
              <p className="text-xs text-slate-400">
                Track all proposals you&apos;ve sent and update them when needed.
              </p>
              <Link
                href="/contractor/proposals"
                className="inline-flex text-xs px-3 py-1 rounded bg-sky-500 hover:bg-sky-600 mt-1"
              >
                Go to proposals
              </Link>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
