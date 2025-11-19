"use client";

import { useWallet } from "@solana/wallet-adapter-react";

export default function ClientPage() {
  const { connected } = useWallet();

  return (
    <div className="h-full min-h-[70vh] flex flex-col">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-2xl font-semibold mb-1">Client dashboard</h1>
        <p className="text-sm text-slate-400">
          Manage your missions, review proposals, and release payments.
        </p>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col gap-6">
        {!connected && (
          <p className="text-sm text-amber-400">
            Please connect your wallet to see your client profile.
          </p>
        )}

        {connected && (
          <div className="grid gap-4 md:grid-cols-3">
            {/* Carte 1 – Vos contrats */}
            <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3">
              <h2 className="text-sm font-semibold mb-1">Your contracts</h2>
              <p className="text-xs text-slate-400 mb-2">
                View and manage all contracts you created.
              </p>
              <a
                href="/client/contracts"
                className="inline-flex text-xs px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600"
              >
                Go to contracts
              </a>
            </section>

            {/* Carte 2 – Créer une mission */}
            <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3">
              <h2 className="text-sm font-semibold mb-1">Create new mission</h2>
              <p className="text-xs text-slate-400 mb-2">
                Start a new freelance mission and let contractors send proposals.
              </p>
              <a
                href="/client/create-contract"
                className="inline-flex text-xs px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600"
              >
                New contract
              </a>
            </section>

            {/* Carte 3 – Pending payments */}
            <section className="rounded border border-slate-800 bg-slate-950/60 px-4 py-3">
              <h2 className="text-sm font-semibold mb-1">Pending payments</h2>
              <p className="text-xs text-slate-400 mb-2">
                See closed contracts with funds locked in the vault and release
                payments to contractors.
              </p>
              <a
                href="/client/pending-payments"
                className="inline-flex text-xs px-3 py-1 rounded bg-amber-500 hover:bg-amber-600"
              >
                View pending payments
              </a>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
