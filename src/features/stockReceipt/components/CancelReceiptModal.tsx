"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function CancelReceiptModal({ onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  const handleCancelReceipt = () => {
    if (!reason.trim()) {
      alert("Cancellation reason is required");
      return;
    }

    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[700px] rounded bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          This will cancel the Stock Receipt Record.
        </h2>

        <p className="mb-6 font-semibold">
          Please note that the Stock Receipt cannot be modified after
          cancellation.
        </p>

        <label className="mb-2 block font-semibold">
          Please enter the reason for cancellation
        </label>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mb-6 h-28 w-full border p-3"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancelReceipt}
            className="rounded bg-red-700 px-6 py-2 font-semibold text-white"
          >
            Cancel Receipt
          </button>

          <button
            onClick={onClose}
            className="rounded border px-6 py-2 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}