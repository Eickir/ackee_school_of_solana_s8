"use client";

import { useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { useSolanceProgram } from "@/lib/solana/program";

const CONTRACTOR_SEED = "contractor";

export function useUpdateProposal() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProposal = useCallback(
    async (
      contractPk: PublicKey,
      proposalPda: PublicKey,
      newAmountLamports: bigint | number
    ) => {
      if (!program || !publicKey) throw new Error("Wallet not connected");
      setLoading(true);
      setError(null);

      try {
        const [contractorPda] = PublicKey.findProgramAddressSync(
          [Buffer.from(CONTRACTOR_SEED), publicKey.toBuffer()],
          program.programId
        );

        const amountBn =
          typeof newAmountLamports === "bigint"
            ? new BN(newAmountLamports.toString())
            : new BN(newAmountLamports);

        await program.methods
          .updateProposalIx(amountBn)
          .accounts({
            contractor: publicKey,
            contractorAccount: contractorPda,
            proposalAccount: proposalPda,
            contract: contractPk,
          })
          .rpc();
      } catch (e: any) {
        console.error("updateProposalIx error:", e);
        setError(e.message ?? "Failed to update proposal");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { updateProposal, loading, error };
}
