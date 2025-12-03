"use client";

import { useCallback, useState } from "react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";

const CLIENT_SEED = "client";

export function useInitializeClient() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [lastClientPda, setLastClientPda] = useState<PublicKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = useCallback(async () => {
    if (!program || !publicKey) throw new Error("Wallet not connected");
    setLoading(true);
    setError(null);

    try {
      const [clientPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(CLIENT_SEED), publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeClientIx()
        .accounts({
          client: publicKey,
          clientAccount: clientPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setLastClientPda(clientPda);
      return clientPda;
    } catch (e: any) {
      console.error("initializeClientIx error:", e);
      setError(e.message ?? "Failed to initialize client");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  return { initializeClient, loading, error, lastClientPda };
}
