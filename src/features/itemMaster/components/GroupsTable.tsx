"use client";

export default function GroupsTable({ data, onGroupClick }: any) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-x-auto border">
      <table className="w-full text-sm">
        <thead className="bg-[#953002]">
          <tr>
            <th className="text-left px-6 py-3">Group Code</th>
            <th className="text-left px-6 py-3">Group Name</th>
            <th className="text-left px-6 py-3">Description</th>
            <th className="text-left px-6 py-3">GL Account</th>
            <th className="text-left px-6 py-3">Maintain Reorder</th>
            <th className="text-left px-6 py-3">Items Count</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                No item groups found
              </td>
            </tr>
          ) : (
            data.map((group: any, index: number) => (
              <tr
                key={group.code || group.id || index}
                className="border-t hover:bg-slate-100 transition"
              >
                <td className="px-6 py-3 font-medium">
                  <button
                    onClick={() => onGroupClick?.(group.code)}
                    className="text-blue-600 font-semibold hover:underline" >
                    {group.code || "-"}
                  </button>
                </td>

                <td className="px-6 py-3">{group.name || "-"}</td>

                <td className="px-6 py-3">
                  {group.description || "-"}
                </td>

                <td className="px-6 py-3">
                  {group.glAccount || "-"}
                </td>

                <td className="px-6 py-3">
                  {group.maintainReorder ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>

                <td className="px-6 py-3">
                  {group.itemCount ?? 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}