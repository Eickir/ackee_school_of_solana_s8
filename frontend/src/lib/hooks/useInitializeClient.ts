"use client";

import { useCallback, useState } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";
import { getClientPda } from "@/lib/solana/pda";

export function useInitializeClient() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const initializeClient = useCallback(async () => {
    if (!program || !publicKey) return;
    setLoading(true);
    setError(null);

    try {
      const clientPda = getClientPda(publicKey);

      await program.methods
        .initializeClientIx()
        .accounts({
          client: publicKey,
          clientAccount: clientPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });

      return clientPda;
    } catch (e) {
      console.error("initializeClient error:", e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  return { initializeClient, loading, error };
}
