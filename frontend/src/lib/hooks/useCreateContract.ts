"use client";

import { useCallback, useState } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import { useSolanceProgram } from "@/lib/solana/program";
import { getClientPda, getContractPda } from "@/lib/solana/pda";

export function useCreateContract() {
  const program = useSolanceProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const createContract = useCallback(
    async (title: string, topic: string) => {
      if (!program || !publicKey) return;
      setLoading(true);
      setError(null);

      try {
        const clientPda = getClientPda(publicKey);
        const clientAccount = await program.account.client.fetch(clientPda);

        const nextId = new BN(clientAccount.nextContractId.toString());
        const contractPda = getContractPda(clientPda, nextId);

        await program.methods
          .initializeContractIx(title, topic)
          .accounts({
            signer: publicKey,
            clientAccount: clientPda,
            contractAccount: contractPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ commitment: "confirmed" });

        return { clientPda, contractPda, contractId: nextId };
      } catch (e) {
        console.error("createContract error:", e);
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return { createContract, loading, error };
}
