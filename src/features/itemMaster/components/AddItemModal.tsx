"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as api from "../services/api";
import { isMin3, isAlphaNumeric } from "../utils/validation";

export default function AddItemModal({ open, setOpen, onSuccess }: any) {
  const [groups, setGroups] = useState<any[]>([]);

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

  //Load grps
  useEffect(() => {
    api.fetchGroups(0).then((res) => {
      setGroups(res.data.content || res.data);
    });
  }, []);

  if (!open) return null;

  //  validation
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

  return null;
};

const handleSubmit = async () => {
  const error = validate();

  if (error) {
    toast.error(error);
    return;
  }

  // validate group properly
  if (!form.itemGroup) {
    toast.error("Please select a valid Item Group");
    return;
  }

    const payload = {
    itemCode: form.itemCode,
    itemName: form.itemName,
    itemDescription: form.description,
    unitOfMeasurement: form.uom,
    active: form.active,

    maintainReorder: form.maintainReorder,
    reorderQuantity: Number(form.reorderQuantity),
    minimumLevel: Number(form.minimumLevel),

    itemGroup: {
      code: form.itemGroup,
    },
  };

  //  log BEFORE sending
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
      minimumLevel:"",
    });

  } catch (err: any) {
    //  show REAL backend error
    console.error("ERROR:", err.response?.data);

    toast.error(
      err.response?.data?.message ||
      err.response?.data ||
      "Failed to create item"
    );
  }
};
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-xl p-6 rounded-2xl space-y-4">

        <h2 className="text-xl font-semibold">Create Item</h2>

        <label>Item Code</label>
        <input
          placeholder="Ex: ITEM001"
          className="input"
          value={form.itemCode}
          onChange={(e) =>
            setForm({ ...form, itemCode: e.target.value })
          }
        />

        <label >Item Name</label>
        <input
          placeholder="Ex: Ballpoint Pen"
          className="input"
          value={form.itemName}
          onChange={(e) =>
            setForm({ ...form, itemName: e.target.value })
          }
        />

        {/*  GROUP DROPDOWN */}
        <label >Item Group</label>
        <select
          className="input"
          value={form.itemGroup}
          onChange={(e) => {
            const selectedId = e.target.value;

            const selectedGroup = groups.find(
              (g: any) => g.code === selectedId
            );

            console.log("FULL GROUP:", selectedGroup);

            setForm({
              ...form,
              itemGroup: selectedId, // store ID
            });
          }}
        >
          <option value=""disabled>Select Group</option>

          {groups.map((g: any) => (
            <option key={g.code} value={g.code}>
              {g.name}
            </option>
          ))}
        </select>

        <label >Item Description</label>
        <textarea
          placeholder="Description"
          className="input"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <label >Unit of Measurement</label>
        <select
            className="input"
            value={form.uom}
            onChange={(e) =>
                setForm({ ...form, uom: e.target.value })
            }
        >
            <option value="" disabled>Select UOM</option>

            <option value="PCS">PCS</option>
            <option value="Nos">Nos</option>
            <option value="Kg">Kg</option>
            <option value="L">Liters</option>
            <option value="Box">Box</option>
            <option value="Pack">Pack</option>
        </select>
        
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
              setForm({ ...form, maintainReorder: e.target.checked })
            }
          />
          Maintain Reorder
        </label>

        <label >Reorder Quantity</label>
        <input
          type="number"
          placeholder="Reorder Quantity"
          className="input"
          value={form.reorderQuantity}
          onChange={(e) =>
            setForm({ ...form, reorderQuantity: e.target.value })
          }
        />

        <label >Minimum Level</label>
        <input
            type="number"
            placeholder="Minimum Level"
            className="input"
            value={form.minimumLevel}
            onChange={(e) =>
              setForm({ ...form, minimumLevel: e.target.value })
            }
          />

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