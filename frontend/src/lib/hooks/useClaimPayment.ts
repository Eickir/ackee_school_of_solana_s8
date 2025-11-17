"use client";

import { useCallback, useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";
import { getClientPda, getVaultPda } from "@/lib/solana/pda";

export function useClaimPayment() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  /**
   * @param contractPda PDA du contract dont on veut libérer le paiement
   */
  const claimPayment = useCallback(
    async (contractPda: PublicKey) => {
      if (!program || !publicKey) return;
      setLoading(true);
      setError(null);

      try {
        const clientPda = getClientPda(publicKey);
        const contractAccount = await program.account.contract.fetch(
          contractPda
        );

        // Dans ton état, Contract.contractor = Pubkey du Contractor account
        const contractorAccountPk: PublicKey = contractAccount.contractor;

        const vaultPda = getVaultPda(contractPda);

        await program.methods
          .claimPaymentIx()
          .accounts({
            client: publicKey,
            contractor: contractAccount.contractorWallet ?? publicKey, // à adapter selon ton state exact
            clientAccount: clientPda,
            contractorAccount: contractorAccountPk,
            contract: contractPda,
            vault: vaultPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ commitment: "confirmed" });
      } catch (e) {
        console.error("claimPayment error:", e);
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { claimPayment, loading, error };
}
