import { IssueItem } from "@/types/stockIssue";

interface Props {
  items: IssueItem[];
}

export default function GrnBreakdownTable({ items }: Props) {
  const grnRows = items.flatMap((item) =>
    item.grnItems.map((grn) => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
      ...grn,
    }))
  );

  return (
    <div>
      <h4 className="mb-2 text-xs font-bold text-slate-700">
        Issue Items GRN wise breakdown
      </h4>

      <div className="overflow-x-auto rounded-lg border border-slate-300">
        <table className="w-full min-w-[650px] border-collapse text-xs">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-2 py-2 text-left text-slate-800">
                GRN No
              </th>
              <th className="border border-slate-300 px-2 py-2 text-left text-slate-800">
                GRN Date
              </th>
              <th className="border border-slate-300 px-2 py-2 text-right text-slate-800">
                Current Qty
              </th>
              <th className="border border-slate-300 px-2 py-2 text-right text-slate-800">
                Issue Qty
              </th>
            </tr>
          </thead>

          <tbody>
            {grnRows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="h-24 border border-slate-300 text-center text-slate-500"
                >
                  No GRN breakdown
                </td>
              </tr>
            ) : (
              grnRows.map((row) => (
                <tr
                  key={`${row.itemCode}-${row.grnNumber}`}
                  className="hover:bg-slate-50"
                >
                  <td className="border border-slate-300 px-2 py-2 text-slate-800">
                    {row.grnNumber}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-slate-800">
                    {row.grnDate}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-right text-slate-800">
                    {row.currentQty}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-right font-semibold text-slate-800">
                    {row.issuedQuantity}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}