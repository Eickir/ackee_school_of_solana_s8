"use client";

import { ContractForm } from "@src/components/contract/ContractForm.tsx";

export default function NewContractPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create a new contract</h1>
      <ContractForm />
    </div>
  );
}
