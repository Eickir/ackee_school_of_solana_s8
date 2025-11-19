"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanceProgram } from "@/lib/solana/program";

const CONTRACTOR_SEED = "contractor";

function lamportsToSol(v: any): string {
  if (v === null || v === undefined) return "-";
  try {
    return (Number(v) / 1_000_000_000).toFixed(3);
  } catch {
    return "-";
  }
}

function formatStatus(status: any): string {
  if (!status) return "Unknown";
  if (status.opened !== undefined) return "Opened";
  if (status.accepted !== undefined) return "Accepted";
  if (status.closed !== undefined) return "Closed";
  return "Unknown";
}

export default function PendingPaymentsPage() {
  const { publicKey, connected } = useWallet();
  const program = useSolanceProgram();

  const [contractorPda, setContractorPda] = useState<PublicKey | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  // 1) Calcul du Contractor PDA à partir du wallet connecté
  useEffect(() => {
    if (!program || !publicKey) return;
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(CONTRACTOR_SEED), publicKey.toBuffer()],
      program.programId
    );
    setContractorPda(pda);
  }, [program, publicKey]);

  // 2) Chargement des contrats "Closed" pour ce contractor
  useEffect(() => {
    if (!program || !contractorPda) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        // On filtre côté RPC sur le contractor (Option<Pubkey> = Some(pubkey))
        // Layout approx : 8 (discrim) + 32 (client) + 1 (option tag) = 41
        const allForContractor = await (program.account as any).contract.all([
          {
            memcmp: {
              offset: 8 + 32 + 1,
              bytes: contractorPda.toBase58(),
            },
          },
        ]);

        // Ensuite, on garde seulement ceux qui sont en status Closed
        const closed = allForContractor.filter((c: any) => {
          const s = c.account.status;
          return s && s.closed !== undefined;
        });

        setContracts(closed);
      } catch (e: any) {
        console.error("load pending payments error:", e);
        setError(e.message ?? "Failed to load pending payments");
      } finally {
        setLoading(false);
      }
    })();
  }, [program, contractorPda, reloadCounter]);

  const hasData = useMemo(
    () => contracts && contracts.length > 0,
    [contracts]
  );

  return (
    <div className="h-full min-h-[70vh] flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            Pending payments
          </h1>
          <p className="text-sm text-slate-400">
            Contracts you&apos;ve completed (Closed) and are waiting for client payment.
          </p>
        </div>
        <Link
          href="/contractor"
          className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700"
        >
          ← Back to contractor dashboard
        </Link>
      </header>

      {!connected && (
        <p className="text-sm text-amber-400">
          Please connect your wallet to see your pending payments.
        </p>
      )}

      {connected && !contractorPda && (
        <p className="text-sm text-slate-400">
          Loading your contractor profile…
        </p>
      )}

      {connected && contractorPda && (
        <>
          {(loading) && (
            <p className="text-sm text-slate-400">Loading contracts…</p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {!loading && !error && !hasData && (
            <p className="text-sm text-slate-400">
              You don&apos;t have any contracts in{" "}
              <span className="font-semibold">Closed</span> status yet.
            </p>
          )}

          {hasData && (
            <div className="grid gap-3 md:grid-cols-2">
              {contracts.map((c: any) => {
                const pk = c.publicKey as PublicKey;
                const statusLabel = formatStatus(c.account.status);
                const title = c.account.title ?? "(no title)";
                const topic = c.account.topic ?? "";
                const amountStr = c.account.amount
                  ? `${lamportsToSol(c.account.amount)} SOL`
                  : "Not set";

                return (
                  <div
                    key={pk.toBase58()}
                    className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 flex flex-col gap-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h2 className="text-sm font-semibold">{title}</h2>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {topic}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-slate-800 text-[10px]">
                        {statusLabel} / Waiting payment
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-slate-500">Amount</p>
                      <p className="font-mono">{amountStr}</p>
                    </div>

                    <div className="space-y-1 mt-1">
                      <p className="text-slate-500">Contract address</p>
                      <p className="font-mono break-all">
                        {pk.toBase58()}
                      </p>
                    </div>

                    <div className="mt-3 flex justify-between items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        The client must call <span className="font-mono">claimPaymentIx</span>.
                      </span>
                      {/* Si tu veux un lien vers la vue client/contract (lecture seule) */}
                      {/* <Link
                        href={`/client/contracts/${pk.toBase58()}`}
                        className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                      >
                        View details
                      </Link> */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
