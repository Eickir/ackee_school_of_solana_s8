"use client";

import Link from "next/link";
import { PublicKey } from "@solana/web3.js";

type ClientAccount = {
  owner: PublicKey;
  nextContractId: bigint | number;
};

interface Props {
  clientAccount: ClientAccount;
}

export function ClientDashboard({ clientAccount }: Props) {
  return (
    <section className="border border-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Client Area</h2>
        <Link
          href="/contracts/new"
          className="px-3 py-1 text-sm rounded bg-indigo-500 hover:bg-indigo-600"
        >
          Create contract
        </Link>
      </div>
      <p className="text-sm text-slate-300">
        Client: <code>{clientAccount.owner.toBase58()}</code>
      </p>
      <p className="text-xs text-slate-400">
        Next contract id:{" "}
        {(clientAccount.nextContractId as any).toString()}
      </p>
      {/* Tu pourras ajouter ici une liste des contrats de ce client */}
    </section>
  );
}
