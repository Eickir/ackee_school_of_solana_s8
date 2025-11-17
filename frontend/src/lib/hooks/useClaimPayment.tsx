"use client";

import { useCallback, useState } from "react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";

const CLIENT_SEED = "client";
const VAULT_SEED = "vault";

export function useClaimPayment() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claimPayment = useCallback(
    async (
      contractPk: PublicKey,
      contractorWalletPk: PublicKey,
      contractorAccountPk: PublicKey
    ) => {
      if (!program || !publicKey) throw new Error("Wallet not connected");
      setLoading(true);
      setError(null);

      try {
        const [clientPda] = PublicKey.findProgramAddressSync(
          [Buffer.from(CLIENT_SEED), publicKey.toBuffer()],
          program.programId
        );

        const [vaultPda] = PublicKey.findProgramAddressSync(
          [Buffer.from(VAULT_SEED), contractPk.toBuffer()],
          program.programId
        );

        await program.methods
          .claimPaymentIx()
          .accounts({
            client: publicKey,
            contractor: contractorWalletPk,
            clientAccount: clientPda,
            contractorAccount: contractorAccountPk,
            contract: contractPk,
            vault: vaultPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (e: any) {
        console.error("claimPaymentIx error:", e);
        setError(e.message ?? "Failed to claim payment");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { claimPayment, loading, error };
}
