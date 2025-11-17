"use client";

import { useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";
import { getContractorPda } from "@/lib/solana/pda";

export function useMarkWorkDone() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  /**
   * @param contractPda PDA du contract pour lequel le travail est terminé
   */
  const markWorkDone = useCallback(
    async (contractPda: PublicKey) => {
      if (!program || !publicKey) return;
      setLoading(true);
      setError(null);

      try {
        const contractorPda = getContractorPda(publicKey);

        await program.methods
          .markWorkDoneIx()
          .accounts({
            contractor: publicKey,
            contractorAccount: contractorPda,
            contract: contractPda,
          })
          .rpc({ commitment: "confirmed" });
      } catch (e) {
        console.error("markWorkDone error:", e);
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { markWorkDone, loading, error };
}
