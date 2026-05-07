"use client";

import { useState } from "react";
import {
  StockReceiptItem,
  StockReceiptItemGrn,
} from "@/types/stockReceipt";
import { mismatchReasons } from "../constants/stockReceiptOptions";

type Props = {
  item: StockReceiptItem;
  onClose: () => void;
  onSave: (item: StockReceiptItem) => void;
};

export default function UpdateReceivedModal({ item, onClose, onSave }: Props) {
  const [grnList, setGrnList] = useState<StockReceiptItemGrn[]>(
    JSON.parse(JSON.stringify(item.stockReceiptItemGrn))
  );

  const [reason, setReason] = useState(item.mismatchReason || "");

  const handleQtyChange = (index: number, value: string) => {
    const qty = Number(value);

    if (qty < 0) {
      alert("Received Qty cannot be negative");
      return;
    }

    const updated = [...grnList];
    updated[index].receivedQty = qty;
    setGrnList(updated);
  };

  const handleUpdate = () => {
    const totalReceived = grnList.reduce(
      (sum, grn) => sum + Number(grn.receivedQty),
      0
    );

    if (totalReceived !== item.transferredQty && !reason) {
      alert("Please select Qty mismatch reason");
      return;
    }

    onSave({
      ...item,
      receivedQty: totalReceived,
      mismatchReason:
        totalReceived === item.transferredQty ? undefined : reason,
      stockReceiptItemGrn: grnList,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-[850px]">
        <h2 className="font-bold text-xl mb-5">Update Received Items</h2>

        <div className="grid grid-cols-4 gap-4 text-sm mb-5">
          <div>
            <p className="text-gray-500">Item Group</p>
            <p>{item.itemGroup}</p>
          </div>

          <div>
            <p className="text-gray-500">Item Code</p>
            <p>{item.itemCode}</p>
          </div>

          <div>
            <p className="text-gray-500">Item Name</p>
            <p>{item.itemName}</p>
          </div>

          <div>
            <p className="text-gray-500">Item Description</p>
            <p>{item.description}</p>
          </div>
        </div>

        <h3 className="font-semibold mb-2">GRN wise received quantity</h3>

        <table className="w-full border text-sm mb-5">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">GRN No</th>
              <th className="border p-2">GRN Date</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Transferred Qty</th>
              <th className="border p-2">Received Qty</th>
            </tr>
          </thead>

          <tbody>
            {grnList.map((grn, index) => (
              <tr key={grn.grnNo}>
                <td className="border p-2">{grn.grnNo}</td>
                <td className="border p-2">{grn.grnDate}</td>
                <td className="border p-2">{item.unitOfMeasurement}</td>
                <td className="border p-2">{grn.transferredQty}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={grn.receivedQty}
                    onChange={(e) =>
                      handleQtyChange(index, e.target.value)
                    }
                    className="border px-2 py-1 w-24"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-5">
          <label className="block text-sm mb-1">
            Qty mismatch reason
          </label>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select reason</option>
            {mismatchReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="border px-5 py-2 rounded">
            Close
          </button>

          <button
            onClick={handleUpdate}
            className="bg-orange-500 text-white px-5 py-2 rounded"
          >
            Update Received Quantity
          </button>
        </div>
      </div>
    </div>
  );
}