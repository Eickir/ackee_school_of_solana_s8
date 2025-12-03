"use client";

import { useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";

const CONTRACTOR_SEED = "contractor";

export function useMarkWorkDone() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markWorkDone = useCallback(
    async (contractPk: PublicKey) => {
      if (!program || !publicKey) throw new Error("Wallet not connected");
      setLoading(true);
      setError(null);

      try {
        const [contractorPda] = PublicKey.findProgramAddressSync(
          [Buffer.from(CONTRACTOR_SEED), publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .markWorkDoneIx()
          .accounts({
            contractor: publicKey,
            contractorAccount: contractorPda,
            contract: contractPk,
          })
          .rpc();
      } catch (e: any) {
        console.error("markWorkDoneIx error:", e);
        setError(e.message ?? "Failed to mark work done");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { markWorkDone, loading, error };
}
