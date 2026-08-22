"use client";
import { useState } from "react";
import { toast } from "sonner";
import * as api from "../services/api";
import { isMin3, isUppercaseOnly, isAlphaNumeric, isAlphaNumericMandatory } from "../utils/validation";

export default function AddGroupModal({ open, setOpen, onSuccess }: any) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    glAccount: "",
    maintainReorder: true,
  });

  if (!open) return null;

 const validate = () => {

  //  Mandatory check 1st
  if (!form.code.trim()) return "Group Code is required";
  if (!form.name.trim()) return "Group Name is required";
  if (!form.glAccount.trim()) return "GL Account is required";

  //Validation 
  if (!isMin3(form.code)) return "Code must be at least 3 characters";

  if (!isUppercaseOnly(form.code))
    return "Code must be in Block Capitals";

  if (!isMin3(form.name))
    return "Name must be at least 3 characters";

  if (!isAlphaNumericMandatory(form.glAccount))
    return "GL Account is Invalid";

  return null;
};
  const handleSubmit = async () => {
    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      await api.createGroup(form);

      toast.success("Group created");

      onSuccess();
      setOpen(false);

    } catch {
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary">Create Group</h2>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the details below to create a new item group.
          </p>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Group Code</label>
            <input
              placeholder="Ex: PEN"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Group Name</label>
            <input
              placeholder="Ex: Pens"
              className="input border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Group Description</label>
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
              placeholder="Ex: GL001"
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