"use client";

import { useState } from "react";
import { StockReceiptItem } from "@/types/stockReceipt";
import UpdateReceivedModal from "./updateReceivedModal";

type Props = {
  items: StockReceiptItem[];
  updateItem: (item: StockReceiptItem) => void;
  readonly?: boolean;
};

export default function StockReceiptItemTable({
  items,
  updateItem,
  readonly = false,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<StockReceiptItem | null>(
    null
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="mb-2 font-semibold">Received Items</h4>

        <table className="w-full border text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Item Group</th>
              <th className="border p-2">Item Code</th>
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Transferred Qty</th>
              <th className="border p-2">Received Qty</th>
              <th className="border p-2">Edit</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="border p-6 text-center">
                  No items received
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.itemCode}>
                  <td className="border p-2">{item.itemGroup}</td>
                  <td className="border p-2">{item.itemCode}</td>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">{item.unitOfMeasurement}</td>
                  <td className="border p-2">{item.transferredQty}</td>
                  <td className="border p-2">{item.receivedQty}</td>
                  <td className="border p-2 text-center">
                    {readonly ? (
                      <span className="text-gray-400">Locked</span>
                    ) : (
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-blue-600"
                      >
                        ✏️
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">GRN wise received Items</h4>

        <table className="w-full border text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">GRN No</th>
              <th className="border p-2">GRN Date</th>
              <th className="border p-2">Transferred Qty</th>
              <th className="border p-2">Received Qty</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="border p-6 text-center">
                  No GRN breakdown
                </td>
              </tr>
            ) : (
              items.flatMap((item) =>
                item.stockReceiptItemGrn.map((grn) => (
                  <tr key={`${item.itemCode}-${grn.grnNo}`}>
                    <td className="border p-2">{grn.grnNo}</td>
                    <td className="border p-2">{grn.grnDate}</td>
                    <td className="border p-2">{grn.transferredQty}</td>
                    <td className="border p-2">{grn.receivedQty}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>

        {items.some((item) => item.mismatchReason) && (
          <div className="mt-4 text-sm">
            <p className="text-blue-600">Qty mismatch reason</p>
            {items
              .filter((item) => item.mismatchReason)
              .map((item) => (
                <p key={item.itemCode}>
                  {item.itemCode}: {item.mismatchReason}
                </p>
              ))}
          </div>
        )}
      </div>

      {selectedItem && !readonly && (
        <UpdateReceivedModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSave={(updatedItem) => {
            updateItem(updatedItem);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}