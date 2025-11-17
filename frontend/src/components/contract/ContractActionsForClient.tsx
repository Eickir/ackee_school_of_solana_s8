"use client";

import { useState } from "react";
import { useChooseProposal } from "@/lib/hooks/useChooseProposal";
import { useClaimPayment } from "@/lib/hooks/useClaimPayment";

interface Props {
  contractPubkey: string;
  contract: any;
}

export function ContractActionsForClient({ contractPubkey, contract }: Props) {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const { chooseProposal, loading: loadingChoose, error: chooseError } =
    useChooseProposal(contractPubkey);
  const { claimPayment, loading: loadingClaim, error: claimError } =
    useClaimPayment(contractPubkey);

  const onChooseProposal = async () => {
    if (!selectedProposal) return;
    await chooseProposal(selectedProposal);
  };

  const onClaimPayment = async () => {
    await claimPayment();
  };

  // À ce stade on ne sait pas encore quelles proposals sont affichées,
  // donc on laisse un bouton générique à brancher plus tard
  return (
    <div className="space-y-3 text-sm">
      {chooseError && (
        <p className="text-xs text-red-400">{chooseError}</p>
      )}
      {claimError && (
        <p className="text-xs text-red-400">{claimError}</p>
      )}

      {/* À brancher avec une liste de proposals côté parent */}
      <p className="text-xs text-slate-400">
        (Here you can render a select list of proposals and call{" "}
        <code>chooseProposal</code>.)
      </p>

      <button
        onClick={onChooseProposal}
        disabled={loadingChoose || !selectedProposal}
        className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
      >
        {loadingChoose ? "Choosing..." : "Choose proposal & fund vault"}
      </button>

      <button
        onClick={onClaimPayment}
        disabled={loadingClaim}
        className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
      >
        {loadingClaim ? "Claiming..." : "Release payment to contractor"}
      </button>
    </div>
  );
}
