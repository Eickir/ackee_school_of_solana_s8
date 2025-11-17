"use client";

import { FormEvent, useState } from "react";
import { useCreateContract } from "@/lib/hooks/useCreateContract";

export function ContractForm() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const { createContract, loading, error, lastContractPda } = useCreateContract();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await createContract(title, topic);
      console.log("Contract created:", res, res.contractPda.toBase58());
      // ici tu peux :
      // - vider le formulaire
      // - afficher un toast
      // - rediriger vers la page du contrat
    } catch (e) {
      // l’erreur est déjà dans `error`
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Topic / Description</label>
        <textarea
          className="w-full rounded bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
          rows={5}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={500}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {lastContractPda && (
        <p className="text-xs text-emerald-400 break-all">
          Contract créé : {lastContractPda.toBase58()}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create contract"}
      </button>
    </form>
  );
}
