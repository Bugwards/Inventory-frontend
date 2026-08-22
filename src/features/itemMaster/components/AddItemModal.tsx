"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as api from "../services/api";
import { isMin3, isAlphaNumeric } from "../utils/validation";

export default function AddItemModal({ open, setOpen, onSuccess, groups }: any) {
  // const [groups, setGroups] = useState<any[]>([]);

  const [form, setForm] = useState({
    itemCode: "",
    itemName: "",
    itemGroup: "",
    description: "",
    uom: "",
    active: true,
    maintainReorder: false,
    reorderQuantity: "",
    minimumLevel: "",
  });

  {/*useEffect(() => {
    api.fetchAllGroups().then((groups) => {
      setGroups(groups);
    });
  }, []);*/}

  if (!open) return null;

  const validate = () => {
    if (!isMin3(form.itemCode))
      return "Item Code must be at least 3 characters";

    if (!isAlphaNumeric(form.itemCode))
      return "Item Code must be letters + numbers only";

    if (!isMin3(form.itemName))
      return "Item Name must be at least 3 characters";

    if (!form.itemGroup)
      return "Select Item Group";

    if (!form.uom)
      return "Select Unit of Measurement";

    if (form.maintainReorder) {
      if (!form.reorderQuantity)
        return "Reorder Quantity is required";

      if (!form.minimumLevel)
        return "Minimum Level is required";
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      itemCode: form.itemCode,
      itemName: form.itemName,
      itemDescription: form.description,
      unitOfMeasurement: form.uom,
      active: form.active,

      maintainReorder: form.maintainReorder,
      reorderQuantity: form.maintainReorder
        ? Number(form.reorderQuantity)
        : 0,
      minimumLevel: form.maintainReorder
        ? Number(form.minimumLevel)
        : 0,

      itemGroup: {
        code: form.itemGroup,
      },
    };

    console.log("SENDING PAYLOAD:", payload);

    try {
      await api.createItem(payload);

      toast.success("Item created successfully");

      onSuccess();
      setOpen(false);

      setForm({
        itemCode: "",
        itemName: "",
        itemGroup: "",
        description: "",
        uom: "",
        active: true,
        maintainReorder: false,
        reorderQuantity: "",
        minimumLevel: "",
      });
    } catch (err: any) {
      console.error("ERROR:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create item"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary">Create Item</h2>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the details below to create a new item record.
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Item Code</label>
            <input
              placeholder="Ex: ITEM001"
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
              placeholder="Ex: Ballpoint Pen"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.itemName}
              onChange={(e) =>
                setForm({ ...form, itemName: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Item Group</label>
            <select
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.itemGroup}
              onChange={(e) =>
                setForm({
                  ...form,
                  itemGroup: e.target.value,
                })
              }
            >
              <option value="" disabled>
                Select Group
              </option>

              {groups.map((g: any) => (
                <option key={g.code} value={g.code}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Item Description</label>
            <textarea
              placeholder="Description"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Unit of Measurement</label>
            <select
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.uom}
              onChange={(e) =>
                setForm({ ...form, uom: e.target.value })
              }
            >
              <option value="" disabled>
                Select UOM
              </option>

              <option value="PCS">PCS</option>
              <option value="Nos">Nos</option>
              <option value="Kg">Kg</option>
              <option value="L">Liters</option>
              <option value="Box">Box</option>
              <option value="Pack">Pack</option>
            </select>
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
                      : "",
                    minimumLevel: e.target.checked
                      ? form.minimumLevel
                      : "",
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
                setForm({ ...form, reorderQuantity: e.target.value })
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
                setForm({ ...form, minimumLevel: e.target.value })
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-primary text-white hover:bg-orange-800 px-6 py-2.5 rounded-xl transition font-semibold text-sm shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}