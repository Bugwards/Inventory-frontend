"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function CancelTransferModal({ onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Cancellation reason is mandatory");
      return;
    }

    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[720px] rounded-md bg-white p-10 shadow-2xl">
        <h2 className="mb-7 text-2xl font-bold text-slate-900">
          This will cancel the Stock Transfer Record.
        </h2>

        <p className="mb-8 text-lg font-semibold text-slate-900">
          Please note that the Stock Transfer cannot be modified after cancellation.
        </p>

        <label className="mb-3 block text-lg font-semibold text-slate-900">
          Please enter the reason for cancellation
        </label>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="h-36 w-full border border-slate-700 p-3 outline-none"
        />

        <div className="mt-8 flex justify-end gap-5">
          <button
            onClick={handleConfirm}
            className="rounded-md bg-red-700 px-8 py-3 text-lg font-bold text-white hover:bg-red-800"
          >
            Cancel Transfer
          </button>

          <button
            onClick={onClose}
            className="rounded-md border border-slate-700 px-8 py-3 text-lg font-bold text-slate-900 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}