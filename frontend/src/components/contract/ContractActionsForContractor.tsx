"use client";

import { useState } from "react";
import { useSubmitProposal } from "@/lib/hooks/useSubmitProposal";
import { useMarkWorkDone } from "@/lib/hooks/useMarkWorkDone";

interface Props {
  contractPubkey: string;
  contract: any;
}

export function ContractActionsForContractor({
  contractPubkey,
  contract
}: Props) {
  const [amount, setAmount] = useState("");
  const {
    submitProposal,
    loading: loadingSubmit,
    error: submitError
  } = useSubmitProposal(contractPubkey);
  const {
    markWorkDone,
    loading: loadingMark,
    error: markError
  } = useMarkWorkDone(contractPubkey);

  const onSubmitProposal = async () => {
    const lamports = Math.floor(parseFloat(amount) * 1_000_000_000);
    await submitProposal(lamports);
  };

  const onMarkDone = async () => {
    await markWorkDone();
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2">
        <label className="block text-xs">Propose an amount (in SOL)</label>
        <input
          className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1.0"
        />
        {submitError && (
          <p className="text-xs text-red-400">{submitError}</p>
        )}
        <button
          onClick={onSubmitProposal}
          disabled={loadingSubmit}
          className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
        >
          {loadingSubmit ? "Submitting..." : "Submit proposal"}
        </button>
      </div>

      <div className="space-y-1">
        {markError && (
          <p className="text-xs text-red-400">{markError}</p>
        )}
        <button
          onClick={onMarkDone}
          disabled={loadingMark}
          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 disabled:opacity-50"
        >
          {loadingMark ? "Marking..." : "Mark work as done"}
        </button>
      </div>
    </div>
  );
}
