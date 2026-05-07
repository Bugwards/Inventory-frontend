"use client";

import { useState } from "react";
import { useStockTransfer } from "../hooks/useStockTransfer";

export default function TransferItemsTable({
  readonly = false,
}: {
  readonly?: boolean;
}) {
    const { transferItems, deleteTransferItem, updateTransferItem } =
    useStockTransfer();

  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editedQty, setEditedQty] = useState<number>(0);

  const handleDelete = (itemCode: string, itemName: string) => {
    const confirmed = confirm(`Do you want to remove the item ${itemName}?`);

    if (confirmed) {
      deleteTransferItem(itemCode);
    }
  };

  const handleEdit = (itemCode: string, qty: number) => {
    setEditingCode(itemCode);
    setEditedQty(qty);
  };

  const handleUpdateQty = (itemCode: string) => {
    const item = transferItems.find((i) => i.itemCode === itemCode);

    if (!item) return;

    if (editedQty <= 0) {
      alert("Transfer quantity must be greater than 0");
      return;
    }

    const currentTotal = item.tranferredgrnitem.reduce(
      (sum, grn) => sum + grn.currentQuantity,
      0
    );

    if (editedQty > currentTotal) {
      alert("Transfer quantity cannot be greater than available current quantity");
      return;
    }

    const updatedItem = {
      ...item,
      transferQty: editedQty,
      tranferredgrnitem: [
        {
          ...item.tranferredgrnitem[0],
          TransferQty: editedQty,
        },
      ],
    };

    updateTransferItem(updatedItem);
    setEditingCode(null);
  };

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-slate-700">
        Items selected for Transfer
      </h4>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">Item Group</th>
              <th className="border p-2">Item Code</th>
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Transfer Qty</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transferItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No items added
                </td>
              </tr>
            ) : (
              transferItems.map((item) => (
                <tr key={item.itemCode}>
                  <td className="border p-2">{item.itemGroup}</td>
                  <td className="border p-2">{item.itemCode}</td>
                  <td className="border p-2">{item.itemName}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">{item.unitOfMeasurement}</td>

                  <td className="border p-2 text-right font-bold">
                    {editingCode === item.itemCode ? (
                      <input
                        type="number"
                        value={editedQty}
                        onChange={(e) => setEditedQty(Number(e.target.value))}
                        className="w-20 border px-2 py-1 text-right"
                      />
                    ) : (
                      item.transferQty
                    )}
                  </td>

                <td className="border p-2 text-center">
                   {readonly ? (
                    <span className="text-slate-400">Locked</span>
                   ) : (
                    <>
                     {editingCode === item.itemCode ? (
                        <button
                       onClick={() => handleUpdateQty(item.itemCode)}
                       className="mr-3 text-green-600 hover:underline"
                       >
                          Update
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(item.itemCode, item.transferQty)}
                          className="mr-3 text-blue-600 hover:underline"
                        >
                          Edit Qty
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item.itemCode, item.itemName)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}