"use client";

import { useCallback, useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";
import { getClientPda, getVaultPda } from "@/lib/solana/pda";

export function useChooseProposal() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  /**
   * @param contractPda  PDA du contract choisi
   * @param proposalPda  PDA de la proposal choisie
   */
  const chooseProposal = useCallback(
    async (contractPda: PublicKey, proposalPda: PublicKey) => {
      if (!program || !publicKey) return;
      setLoading(true);
      setError(null);

      try {
        const clientPda = getClientPda(publicKey);
        const proposalAccount = await program.account.proposal.fetch(
          proposalPda
        );

        // Dans ton program, Proposal.contractor = Pubkey du Contractor account
        const contractorAccountPk: PublicKey = proposalAccount.contractor;

        const vaultPda = getVaultPda(contractPda);

        await program.methods
          .chooseProposalIx()
          .accounts({
            signer: publicKey,
            clientAccount: clientPda,
            contract: contractPda,
            proposalAccount: proposalPda,
            contractorAccount: contractorAccountPk,
            vault: vaultPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ commitment: "confirmed" });

        return { vaultPda };
      } catch (e) {
        console.error("chooseProposal error:", e);
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { chooseProposal, loading, error };
}
