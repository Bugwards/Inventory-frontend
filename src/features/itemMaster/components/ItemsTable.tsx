"use client";

export default function ItemsTable({ data, onItemClick }: any) {
  return (
    <div className="bg-white border rounded-2xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#953002] border ">
          <tr>
            <th className="text-left px-6 py-3">Item Code</th>
            <th className="text-left px-6 py-3">Item Group</th>
            <th className="text-left px-6 py-3">Item Name</th>
            <th className="text-left px-6 py-3">Description</th>
            <th className="text-left px-6 py-3">Unit</th>
            <th className="text-left px-6 py-3">Active</th>
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
                <td className="px-6 py-3 font-medium">
                  <button
                    onClick={() => onItemClick(item.itemCode)}
                    className="text-blue-600 font-semibold hover:underline"
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

                <td className="px-6 py-3">
                  {item.active ? (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-500">
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