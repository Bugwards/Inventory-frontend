import { Trash2 } from "lucide-react";
import { IssueItem } from "@/types/stockIssue";

interface Props {
  items: IssueItem[];
  onDelete: (itemCode: string) => void;
}

export default function IssueItemsTable({ items, onDelete }: Props) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold text-slate-700">
        Items selected for Issue
      </h4>

      <div className="overflow-x-auto rounded-lg border border-slate-300">
        <table className="w-full min-w-[700px] border-collapse text-xs">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-2 py-2 text-left text-slate-800">
                Item Group
              </th>
              <th className="border border-slate-300 px-2 py-2 text-left text-slate-800">
                Item Code
              </th>
              <th className="border border-slate-300 px-2 py-2 text-left text-slate-800">
                Item Name
              </th>
              <th className="border border-slate-300 px-2 py-2 text-left text-slate-800">
                Description
              </th>
              <th className="border border-slate-300 px-2 py-2 text-left text-slate-800">
                Unit
              </th>
              <th className="border border-slate-300 px-2 py-2 text-right text-slate-800">
                Issue Qty
              </th>
              <th className="border border-slate-300 px-2 py-2 text-center text-slate-800">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-24 border border-slate-300 text-center text-slate-500"
                >
                  No items added
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.itemCode} className="hover:bg-slate-50">
                  <td className="border border-slate-300 px-2 py-2 text-slate-800">
                    {item.itemGroupName}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-slate-800 font-semibold">
                    {item.itemCode}
                  </td>
                  <td className="border border-slate-300 px-2 text-slate-800 py-2">
                    {item.itemName}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-slate-800">
                    {item.description}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-slate-800">
                    {item.unitOfMeasurement}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-right text-slate-800 font-semibold">
                    {item.totalIssuedQuantity}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-slate-800">
                    <button
                      type="button"
                      onClick={() => onDelete(item.itemCode)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={15} />
                    </button>
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