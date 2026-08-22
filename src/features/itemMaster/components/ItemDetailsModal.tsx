"use client";

export default function ItemDetailsModal({
  open,
  item,
  onClose,
  onUpdate,
}: any) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-primary">Item Details</h2>
          <p className="text-xs text-gray-500 mt-1">
            View selected item information.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Detail label="Item Code" value={item.itemCode} />
            <Detail label="Item Name" value={item.itemName} />
            <Detail label="Description" value={item.itemDescription} className="sm:col-span-2" />
            <Detail label="Active" value={item.active ? "Yes" : "No"} />
            <Detail
              label="Maintain Reorder"
              value={item.maintainReorder ? "Yes" : "No"}
            />
            {item.maintainReorder && (
              <>
                <Detail label="Reorder Quantity" value={item.reorderQuantity} />
                <Detail label="Minimum Level" value={item.minimumLevel} />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium text-sm"
          >
            Close
          </button>

          <button
            onClick={onUpdate}
            className="bg-primary text-white hover:bg-orange-800 px-6 py-2.5 rounded-xl transition font-semibold text-sm shadow-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, className = "" }: any) {
  return (
    <div className={`bg-orange-50/40 border border-orange-100/50 p-3.5 rounded-xl ${className}`}>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <p className="font-bold text-gray-800 mt-1">{value ?? "-"}</p>
    </div>
  );
}