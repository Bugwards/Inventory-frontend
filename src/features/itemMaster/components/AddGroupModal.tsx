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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">

        <h2 className="text-xl font-semibold">Create Group</h2>

        <label>Group Code</label>
        <input
          placeholder="Ex: PEN"
          className="input"
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />

        <label>Group Name</label>
        <input
          placeholder="Ex: Pens"
          className="input"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <label>Group Description</label>
        <textarea
          placeholder="Description"
          className="input"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <label>GL Account</label>
        <input
          placeholder="Ex: GL001"
          className="input"
          onChange={(e) =>
            setForm({ ...form, glAccount: e.target.value })
          }
        />

        <label className="flex gap-2">
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

        <div className="flex justify-end gap-3">
          <button onClick={() => setOpen(false)}>Cancel</button>

          <button
            onClick={handleSubmit}
            className="bg-secondary px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}