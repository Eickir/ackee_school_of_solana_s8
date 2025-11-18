"use client";

import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRole } from "@/components/layout/RoleProvider";

export default function HomePage() {
  const { connected } = useWallet();
  const { role, setRole } = useRole();
  const router = useRouter();

  const handleChooseClient = () => {
    setRole("client");
    router.push("/client");
  };

  const handleChooseContractor = () => {
    setRole("contractor");
    router.push("/contractor");
  };

  return (
    <div className="h-full min-h-[70vh] flex flex-col justify-center gap-8">
      {/* Hero section */}
      <section className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Manage freelance missions <span className="text-indigo-400">on Solana</span>.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl">
          Solance lets clients create on-chain missions and contractors submit proposals.
          Funds are locked in a vault and released on-chain once the work is done.
        </p>
      </section>

      {/* Etat: wallet non connecté */}
      {!connected && (
        <section className="space-y-2">
          <p className="text-sm text-amber-400">
            To get started, connect your wallet using the button in the top-right corner.
          </p>
          <p className="text-xs text-slate-500">
            Once connected, you can choose whether you want to act as a client or as a contractor.
          </p>
        </section>
      )}

      {/* Etat: wallet connecté */}
      {connected && (
        <section className="grid gap-4 md:grid-cols-2">
          {/* Carte Client */}
          <button
            type="button"
            onClick={handleChooseClient}
            className="text-left rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-4 hover:border-indigo-500 hover:bg-slate-900 transition-colors"
          >
            <h2 className="text-sm font-semibold mb-1">I&apos;m a Client</h2>
            <p className="text-xs text-slate-400 mb-3">
              Create missions, receive proposals, choose your contractor and lock funds in
              a secure on-chain vault.
            </p>
            <span className="inline-flex text-xs px-3 py-1 rounded-full bg-indigo-500 text-white">
              Go to client dashboard →
            </span>
          </button>

          {/* Carte Contractor */}
          <button
            type="button"
            onClick={handleChooseContractor}
            className="text-left rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-4 hover:border-emerald-500 hover:bg-slate-900 transition-colors"
          >
            <h2 className="text-sm font-semibold mb-1">I&apos;m a Contractor</h2>
            <p className="text-xs text-slate-400 mb-3">
              Browse open missions, send proposals with your price, and get paid on-chain
              once the work is validated.
            </p>
            <span className="inline-flex text-xs px-3 py-1 rounded-full bg-emerald-500 text-white">
              Go to contractor dashboard →
            </span>
          </button>
        </section>
      )}

      {/* Petit rappel du rôle actif */}
      {connected && role && (
        <p className="text-[11px] text-slate-500">
          Current mode: <span className="font-semibold capitalize text-slate-200">{role}</span>.
          You can switch by coming back to the home page.
        </p>
      )}
    </div>
  );
}
