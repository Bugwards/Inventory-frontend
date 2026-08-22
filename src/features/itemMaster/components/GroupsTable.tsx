"use client";

export default function GroupsTable({ data, onGroupClick }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-primary border-b border-primary/20 text-white text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="text-left px-6 py-4">Group Code</th>
            <th className="text-left px-6 py-4">Group Name</th>
            <th className="text-left px-6 py-4">Description</th>
            <th className="text-left px-6 py-4">GL Account</th>
            <th className="text-left px-6 py-4">Maintain Reorder</th>
            <th className="text-left px-6 py-4">Items Count</th>
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
                <td className="px-6 py-3.5 font-medium">
                  <button
                    onClick={() => onGroupClick?.(group.code)}
                    className="text-blue-600 font-semibold hover:underline" >
                    {group.code || "-"}
                  </button>
                </td>

                <td className="px-6 py-3.5">{group.name || "-"}</td>

                <td className="px-6 py-3.5">
                  {group.description || "-"}
                </td>

                <td className="px-6 py-3.5">
                  {group.glAccount || "-"}
                </td>

                <td className="px-6 py-3.5">
                  {group.maintainReorder ? (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-success/15 text-success border border-success/20">Yes</span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-gray-200/50 text-gray-500 border border-gray-300/30">No</span>
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