"use client";

import { useCallback, useState } from "react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";

const CONTRACTOR_SEED = "contractor";

export function useInitializeContractor() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [lastContractorPda, setLastContractorPda] = useState<PublicKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeContractor = useCallback(async () => {
    if (!program || !publicKey) throw new Error("Wallet not connected");
    setLoading(true);
    setError(null);

    try {
      const [contractorPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(CONTRACTOR_SEED), publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeContractorIx()
        .accounts({
          contractor: publicKey,
          contractorAccount: contractorPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setLastContractorPda(contractorPda);
      return contractorPda;
    } catch (e: any) {
      console.error("initializeContractorIx error:", e);
      setError(e.message ?? "Failed to initialize contractor");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  return { initializeContractor, loading, error, lastContractorPda };
}
