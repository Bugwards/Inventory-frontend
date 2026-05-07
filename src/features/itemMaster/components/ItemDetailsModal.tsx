"use client";

export default function ItemDetailsModal({
  open,
  item,
  onClose,
  onUpdate,
}: any) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#953002]">Item Details</h2>
          <p className="text-sm text-gray-500">
            View selected item information
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Detail label="Item Code" value={item.itemCode} />
          <Detail label="Item Name" value={item.itemName} />
          <Detail label="Description" value={item.itemDescription} />
          <Detail label="Active" value={item.active ? "Yes" : "No"} />
          <Detail
            label="Maintain Reorder"
            value={item.maintainReorder ? "Yes" : "No"}
          />
          <Detail label="Reorder Quantity" value={item.reorderQuantity} />
          <Detail label="Minimum Level" value={item.minimumLevel} />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border hover:bg-gray-50"
          >
            Close
          </button>

          <button
            onClick={onUpdate}
            className="px-4 py-2 rounded-xl bg-[#953002] text-white hover:bg-orange-800"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div className="bg-orange-50 p-3 rounded-xl">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-gray-800">{value ?? "-"}</p>
    </div>
  );
}