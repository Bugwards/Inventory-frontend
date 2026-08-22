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
      await api.updateItem(item.itemCode, {
        ...form,
        reorderQuantity: form.maintainReorder ? Number(form.reorderQuantity) : 0,
        minimumLevel: form.maintainReorder ? Number(form.minimumLevel) : 0,
      });

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary">Update Item</h2>
          <p className="text-xs text-gray-500 mt-1">
            Edit item details and save changes.
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Item Code</label>
            <input
              placeholder="Item Code"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.itemCode}
              onChange={(e) =>
                setForm({ ...form, itemCode: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Item Name</label>
            <input
              placeholder="Item Name"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.itemName}
              onChange={(e) =>
                setForm({ ...form, itemName: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Item Description</label>
            <textarea
              placeholder="Description"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.itemDescription}
              onChange={(e) =>
                setForm({ ...form, itemDescription: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-3 py-2 bg-gray-50 p-4 rounded-xl space-y-2">
            <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700 select-none">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
              Active
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700 select-none">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={form.maintainReorder}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maintainReorder: e.target.checked,
                    reorderQuantity: e.target.checked
                      ? form.reorderQuantity
                      : 0,
                    minimumLevel: e.target.checked
                      ? form.minimumLevel
                      : 0,
                  })
                }
              />
              Maintain Reorder
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Reorder Quantity</label>
            <input
              type="number"
              placeholder="Reorder Quantity"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={form.reorderQuantity}
              disabled={!form.maintainReorder}
              onChange={(e) =>
                setForm({ ...form, reorderQuantity: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Minimum Level</label>
            <input
              type="number"
              placeholder="Minimum Level"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={form.minimumLevel}
              disabled={!form.maintainReorder}
              onChange={(e) =>
                setForm({ ...form, minimumLevel: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-primary text-white hover:bg-orange-800 px-6 py-2.5 rounded-xl transition font-semibold text-sm shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}