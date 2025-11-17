// frontend/app/contracts/[contractPk]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";
import { useChooseProposal } from "@/hooks/useChooseProposal";
import { useClaimPayment } from "@/hooks/useClaimPayment";
import { useMarkWorkDone } from "@/hooks/useMarkWorkDone";

type ContractAccount = any;
type ProposalAccount = {
  publicKey: PublicKey;
  account: any;
};

export default function ContractDetailPage() {
  const params = useParams();
  const { publicKey } = useWallet();
  const program = useSolanceProgram();

  const [contract, setContract] = useState<ContractAccount | null>(null);
  const [proposals, setProposals] = useState<ProposalAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInfo, setActionInfo] = useState<string | null>(null);

  const { chooseProposal, loading: choosing } = useChooseProposal();
  const { claimPayment, loading: claiming } = useClaimPayment();
  const { markWorkDone, loading: marking } = useMarkWorkDone();

  const contractPk = useMemo(() => {
    try {
      return new PublicKey(params.contractPk as string);
    } catch {
      return null;
    }
  }, [params.contractPk]);

  const isClient = useMemo(() => {
    if (!publicKey || !contract) return false;
    return contract.client?.toBase58?.() === publicKey.toBase58();
  }, [publicKey, contract]);

  useEffect(() => {
    const load = async () => {
      if (!program || !contractPk) return;
      setLoading(true);
      try {
        const contractAccount = await program.account.contract.fetch(
          contractPk
        );
        setContract(contractAccount);

        // Proposals: filter where first field (contract pubkey) = contractPk
        const allProposals = await program.account.proposal.all([
          {
            memcmp: {
              offset: 8, // 8 bytes for discriminator, then contract: Pubkey
              bytes: contractPk.toBase58(),
            },
          },
        ]);

        setProposals(allProposals);
      } catch (e) {
        console.error("Error loading contract/proposals:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [program, contractPk]);

  const handleChooseProposal = async (proposal: ProposalAccount) => {
    if (!contractPk) return;
    try {
      await chooseProposal(contractPk, proposal.publicKey);
      setActionInfo(
        `Proposal ${proposal.publicKey.toBase58()} chosen. Funds locked in vault.`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaimPayment = async () => {
    if (!contractPk) return;
    try {
      await claimPayment(contractPk);
      setActionInfo("Payment claimed from vault.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkWorkDone = async () => {
    if (!contractPk) return;
    try {
      await markWorkDone(contractPk);
      setActionInfo("Work marked as done.");
    } catch (e) {
      console.error(e);
    }
  };

  if (!contractPk) {
    return (
      <div className="mt-10">
        <p className="text-red-400 text-sm">Invalid contract public key.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-10">
        <p className="text-sm text-slate-300">Loading contract...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="mt-10">
        <p className="text-sm text-red-400">Contract not found.</p>
      </div>
    );
  }

  const statusLabel = contract.status; // enum string-ish via Anchor

  return (
    <div className="mt-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          Contract {contractPk.toBase58().slice(0, 8)}…
        </h1>
        <p className="text-xs text-slate-400 break-all">
          Contract address: {contractPk.toBase58()}
        </p>
      </div>

      {/* Contract details */}
      <section className="border border-slate-800 rounded-lg p-4 space-y-2">
        <h2 className="font-medium text-lg">{contract.title}</h2>
        <p className="text-sm text-slate-300 whitespace-pre-wrap">
          {contract.topic}
        </p>
        <p className="text-xs text-slate-400">
          Status: <span className="font-mono">{String(statusLabel)}</span>
        </p>
      </section>

      {/* Proposals list */}
      <section className="space-y-3">
        <h3 className="font-semibold text-base">Proposals</h3>
        {proposals.length === 0 && (
          <p className="text-xs text-slate-400">
            No proposals yet for this contract.
          </p>
        )}

        <div className="space-y-3">
          {proposals.map((p) => (
            <div
              key={p.publicKey.toBase58()}
              className="border border-slate-800 rounded-lg p-3 text-sm flex flex-col gap-2"
            >
              <p className="text-xs text-slate-400 break-all">
                Proposal: {p.publicKey.toBase58()}
              </p>
              <p>
                Amount:{" "}
                <span className="font-mono">
                  {p.account.amount?.toString?.() ?? p.account.amount} lamports
                </span>
              </p>

              {isClient && (
                <button
                  type="button"
                  disabled={choosing}
                  onClick={() => handleChooseProposal(p)}
                  className="self-start inline-flex items-center justify-center rounded-md bg-emerald-500 hover:bg-emerald-600 px-3 py-1 text-xs font-medium disabled:opacity-60"
                >
                  {choosing ? "Choosing..." : "Choose this proposal"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-3">
        <h3 className="font-semibold text-base">Actions</h3>
        <div className="flex flex-wrap gap-2">
          {/* Client-side: claim payment */}
          {isClient && (
            <button
              type="button"
              disabled={claiming}
              onClick={handleClaimPayment}
              className="inline-flex items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
            >
              {claiming ? "Claiming..." : "Claim payment"}
            </button>
          )}

          {/* Contractor-side: mark work done (pour l’instant accessible à tous) */}
          <button
            type="button"
            disabled={marking}
            onClick={handleMarkWorkDone}
            className="inline-flex items-center justify-center rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
          >
            {marking ? "Marking..." : "Mark work done"}
          </button>
        </div>

        {actionInfo && (
          <p className="text-xs text-emerald-400 whitespace-pre-wrap">
            {actionInfo}
          </p>
        )}
      </section>
    </div>
  );
}
