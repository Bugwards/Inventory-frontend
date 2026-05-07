"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as api from "../services/api";

export default function UpdateItemModal({
  open,
  item,
  onClose,
  onSuccess,
}: any) {
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (item) {
      setForm({
        itemCode: item.itemCode || "",
        itemName: item.itemName || "",
        itemDescription: item.itemDescription || "",
        active: item.active ?? true,
        maintainReorder: item.maintainReorder ?? false,
        reorderQuantity: item.reorderQuantity ?? 0,
        minimumLevel: item.minimumLevel ?? 0,
      });
    }
  }, [item]);

  if (!open || !form || !item) return null;

  const handleSave = async () => {
    try {
      await api.updateItem(item.itemCode, form);
      toast.success("Item updated successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to update item"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#953002]">Update Item</h2>
          <p className="text-sm text-gray-500">
            Edit item details and save changes
          </p>
        </div>

        <label >Item Code</label>
        <input
          className="input"
          placeholder="Item Code"
          value={form.itemCode}
          onChange={(e) =>
            setForm({ ...form, itemCode: e.target.value })
          }
        />

        <label >Item Name</label>
        <input
          className="input"
          placeholder="Item Name"
          value={form.itemName}
          onChange={(e) =>
            setForm({ ...form, itemName: e.target.value })
          }
        />
        
        <label >Item Description</label>
        <textarea
          className="input"
          placeholder="Description"
          value={form.itemDescription}
          onChange={(e) =>
            setForm({ ...form, itemDescription: e.target.value })
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({ ...form, active: e.target.checked })
            }
          />
          Active
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.maintainReorder}
            onChange={(e) =>
              setForm({
                ...form,
                maintainReorder: e.target.checked,
              })
            }
          />
          Maintain Reorder
        </label>

        <label >Reorder Quantity</label>
        <input
          type="number"
          className="input"
          placeholder="Reorder Quantity"
          value={form.reorderQuantity}
          onChange={(e) =>
            setForm({
              ...form,
              reorderQuantity: Number(e.target.value),
            })
          }
        />

        <label >Minimum Level</label>
        <input
          type="number"
          className="input"
          placeholder="Minimum Level"
          value={form.minimumLevel}
          onChange={(e) =>
            setForm({
              ...form,
              minimumLevel: Number(e.target.value),
            })
          }
        />

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#953002] text-white hover:bg-white hover:text-[#953002] hover:border "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}