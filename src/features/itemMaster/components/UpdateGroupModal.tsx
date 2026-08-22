"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as api from "../services/api";

export default function UpdateGroupModal({
  open,
  group,
  onClose,
  onSuccess,
}: any) {
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (group) {
      setForm({
        name: group.name || "",
        description: group.description || "",
        glAccount: group.glAccount || "",
        maintainReorder: group.maintainReorder ?? false,
      });
    }
  }, [group]);

  if (!open || !form || !group) return null;

  const handleSave = async () => {
    try {
      await api.updateItemGroup(group.code, form);
      toast.success("Item group updated successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to update item group"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary">Update Item Group</h2>
          <p className="text-xs text-gray-500 mt-1">
            Edit item group details and save changes.
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="bg-orange-50 p-3.5 rounded-xl border border-orange-100">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Group Code</p>
            <p className="font-bold text-primary mt-0.5">{group.code}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Group Name</label>
            <input
              placeholder="Group Name"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
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
            <label className="text-sm font-semibold text-gray-700">GL Account</label>
            <input
              placeholder="GL Account"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.glAccount}
              onChange={(e) =>
                setForm({ ...form, glAccount: e.target.value })
              }
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700 select-none">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
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