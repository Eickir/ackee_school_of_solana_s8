"use client";

import { PublicKey } from "@solana/web3.js";

type ContractorAccount = {
  owner: PublicKey;
  nextProposalId: bigint | number;
};

interface Props {
  contractorAccount: ContractorAccount;
}

export function ContractorDashboard({ contractorAccount }: Props) {
  return (
    <section className="border border-slate-800 rounded-lg p-4 space-y-3">
      <h2 className="font-semibold">Contractor Area</h2>
      <p className="text-sm text-slate-300">
        Contractor: <code>{contractorAccount.owner.toBase58()}</code>
      </p>
      <p className="text-xs text-slate-400">
        Next proposal id:{" "}
        {(contractorAccount.nextProposalId as any).toString()}
      </p>
      {/* Tu pourras ajouter ici la liste des proposals de ce contractor */}
    </section>
  );
}
