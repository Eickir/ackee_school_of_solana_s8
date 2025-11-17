"use client";

interface Proposal {
  pubkey: string;
  amount: number;
  contractor: string;
}

interface Props {
  proposals: Proposal[];
}

export function ProposalList({ proposals }: Props) {
  if (!proposals.length) {
    return <p className="text-sm text-slate-400">No proposals yet.</p>;
  }

  return (
    <div className="space-y-2">
      {proposals.map((p) => (
        <div
          key={p.pubkey}
          className="border border-slate-800 rounded-lg p-3 text-sm flex items-center justify-between"
        >
          <div>
            <p>
              Amount: {(p.amount / 1_000_000_000).toFixed(2)} SOL
            </p>
            <p className="text-xs text-slate-400">
              Contractor: <code>{p.contractor}</code>
            </p>
            <p className="text-[11px] text-slate-500">
              Proposal: <code>{p.pubkey}</code>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
