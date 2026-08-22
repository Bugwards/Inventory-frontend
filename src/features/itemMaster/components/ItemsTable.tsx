"use client";

export default function ItemsTable({ data, onItemClick }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-primary border-b border-primary/20 text-white text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="text-left px-6 py-4">Item Code</th>
            <th className="text-left px-6 py-4">Item Group</th>
            <th className="text-left px-6 py-4">Item Name</th>
            <th className="text-left px-6 py-4">Description</th>
            <th className="text-left px-6 py-4">Unit</th>
            <th className="text-left px-6 py-4">Active</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                No items found
              </td>
            </tr>
          ) : (
            data.map((item: any, index: number) => (
              <tr
                key={item.itemCode || index}
                className="border-t hover:bg-slate-100 transition"
              >
                <td className="px-6 py-3.5 font-medium">
                  <button
                    onClick={() => onItemClick(item.itemCode)}
                    className="text-primary font-bold hover:underline cursor-pointer"
                  >
                    {item.itemCode || "-"}
                  </button>
                </td>

                <td className="px-6 py-3">
                  {item.itemGroupName || item.itemGroup?.name || "-"}
                </td>

                <td className="px-6 py-3">{item.itemName || "-"}</td>

                <td className="px-6 py-3">
                  {item.itemDescription || "-"}
                </td>

                <td className="px-6 py-3">
                  {item.unitOfMeasurement || "-"}
                </td>

                <td className="px-6 py-3.5">
                  {item.active ? (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-success/15 text-success border border-success/20">
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-gray-200/50 text-gray-500 border border-gray-300/30">
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}