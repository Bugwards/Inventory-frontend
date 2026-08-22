"use client";
import { useState } from "react";

export default function CancelModal({ isOpen, onClose, onConfirm }: any) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 w-[400px] rounded shadow space-y-4">
        <h2 className="text-lg font-semibold text-red-600">Cancel GRN</h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason..."
          className="border w-full p-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onConfirm(reason)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>

          <button onClick={onClose} className="border px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}