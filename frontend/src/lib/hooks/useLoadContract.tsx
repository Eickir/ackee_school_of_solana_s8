"use client";

import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useSolanceProgram } from "@/lib/solana/program";

export function useLoadContract(contractPk: PublicKey | null) {
  const program = useSolanceProgram();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!program || !contractPk) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const contract = await (program.account as any).contract.fetch(contractPk);
        setData(contract);
      } catch (e: any) {
        console.error("load contract error:", e);
        setError(e.message ?? "Failed to load contract");
      } finally {
        setLoading(false);
      }
    })();
  }, [program, contractPk]);

  return { data, loading, error };
}
