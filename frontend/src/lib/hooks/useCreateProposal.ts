"use client";

import { useCallback, useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import { useSolanceProgram } from "@/lib/solana/program";
import { getContractorPda, getProposalPda } from "@/lib/solana/pda";

export function useCreateProposal() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  /**
   * @param contractPda PDA du Contract pour lequel on propose
   * @param amountLamports montant proposé en lamports (BN)
   */
  const createProposal = useCallback(
    async (contractPda: PublicKey, amountLamports: BN) => {
      if (!program || !publicKey) return;
      setLoading(true);
      setError(null);

      try {
        const contractorPda = getContractorPda(publicKey);
        const contractorAccount = await program.account.contractor.fetch(
          contractorPda
        );

        const nextProposalId = new BN(
          contractorAccount.nextProposalId.toString()
        );
        const proposalPda = getProposalPda(contractorPda, nextProposalId);

        await program.methods
          .initializeProposalIx(amountLamports)
          .accounts({
            contractor: publicKey,
            contract: contractPda,
            contractorAccount: contractorPda,
            proposalAccount: proposalPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ commitment: "confirmed" });

        return { contractorPda, proposalPda, proposalId: nextProposalId };
      } catch (e) {
        console.error("createProposal error:", e);
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { createProposal, loading, error };
}
