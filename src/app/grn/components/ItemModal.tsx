"use client";

import { useCallback, useEffect, useState } from "react";
import * as itemApi from "@/features/itemMaster/services/api";

export default function ItemModal({ isOpen, onClose, onAdd }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<any>(null);
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  

  useEffect(() => {
    if (isOpen) loadItems();
  }, [isOpen]);

 const loadItems = useCallback(async () => {
    try {
      const all = await itemApi.fetchAllItems();
      setItems(all);
    } catch (err) {
      console.error("Failed to load items:", err);
      setItems([]);
    }
  }, []);

  const filtered = items.filter((i) =>
    i.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    i.itemCode?.toLowerCase().includes(search.toLowerCase())
  );

  const selectItem = (item: any) => {
    setSelected({
      itemCode: item.itemCode,
      itemName: item.itemName,
      itemGroup: item.itemGroupName || item.itemGroup?.name || "-",
      unit: item.unitOfMeasurement || "PCS",
    });

    setPrice(Number(item.sellingPrice || 0));
    setQty(1);
  };

  const handleAdd = () => {
    if (!selected) return;

    onAdd({
      itemCode: selected.itemCode,
      itemName: selected.itemName,
      itemGroup: selected.itemGroup,
      unit: selected.unit,
      qty,
      price,
    });

    // reset
    setSelected(null);
    setQty(1);
    setPrice(0);
    setSearch("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[750px] p-5 rounded-xl shadow-lg">

        <h2 className="text-lg font-bold text-[#953002]">
          Select Item
        </h2>

        {/* SEARCH */}
        <input
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full mt-3 rounded"
        />

        {/* ITEM LIST */}
        <div className="max-h-[220px] overflow-y-auto border mt-3 rounded">

          {filtered.map((i) => (
            <div
              key={i.itemCode}
              onClick={() => selectItem(i)}
              className={`grid grid-cols-4 p-2 cursor-pointer border-b hover:bg-gray-100 ${
                selected?.itemCode === i.itemCode ? "bg-yellow-100" : ""
              }`}
            >
              <div className="font-semibold text-[#953002]">
                {i.itemCode}
              </div>

              <div>{i.itemName}</div>

              <div className="text-gray-600 text-sm">
                {i.itemGroupName || i.itemGroup?.name || "-"}
              </div>

              <div className="text-gray-600 text-sm">
                {i.unitOfMeasurement || "PCS"}
              </div>
            </div>
          ))}
        </div>

        {/* SELECTED ITEM */}
        {selected && (
          <div className="mt-4 border p-3 rounded bg-gray-50">

            <p className="font-semibold">
              Selected: {selected.itemName}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-2">

              {/* QTY */}
              <div>
                <label className="text-sm">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value)))
                  }
                  className="border p-2 w-full rounded"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="text-sm">Price</label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) =>
                    setPrice(Math.max(0, Number(e.target.value)))
                  }
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-[#953002] text-white rounded"
          >
            Add Item
          </button>
        </div>

      </div>
    </div>
  );
}