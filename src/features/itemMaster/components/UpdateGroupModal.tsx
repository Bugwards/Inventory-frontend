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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#953002]">
            Update Item Group
          </h2>
          <p className="text-sm text-gray-500">
            Edit item group details and save changes
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-xl">
            <p className="text-gray-500 text-xs">Group Code</p>
            <p className="font-semibold text-gray-800">{group.code}</p>
        </div>

        <label>Group Name</label>
        <input
          className="input"
          placeholder="Group Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Description</label>
        <textarea
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <label>GL Account</label>
        <input
          className="input"
          placeholder="GL Account"
          value={form.glAccount}
          onChange={(e) =>
            setForm({ ...form, glAccount: e.target.value })
          }
        />

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

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#953002] text-white hover:bg-orange-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}