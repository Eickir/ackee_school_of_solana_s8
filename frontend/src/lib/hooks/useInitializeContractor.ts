"use client";

import { useCallback, useState } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";
import { getContractorPda } from "@/lib/solana/pda";

export function useInitializeContractor() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const initializeContractor = useCallback(async () => {
    if (!program || !publicKey) return;
    setLoading(true);
    setError(null);

    try {
      const contractorPda = getContractorPda(publicKey);

      await program.methods
        .initializeContractorIx()
        .accounts({
          contractor: publicKey,
          contractorAccount: contractorPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });

      return contractorPda;
    } catch (e) {
      console.error("initializeContractor error:", e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  return { initializeContractor, loading, error };
}
