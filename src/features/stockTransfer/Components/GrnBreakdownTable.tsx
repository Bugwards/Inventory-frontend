"use client";

import { useStockTransfer } from "../hooks/useStockTransfer";

export default function GrnBreakdownTable() {
  const { transferItems } = useStockTransfer();

  const allGrns = transferItems.flatMap((item) =>
    item.tranferredgrnitem.map((grn) => ({
      itemCode: item.itemCode,
      ...grn,
    }))
  );

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-slate-700">
        GRN wise transfer breakdown
      </h4>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="border p-2">GRN No</th>
              <th className="border p-2">GRN Date</th>
              <th className="border p-2">Current Qty</th>
              <th className="border p-2">Transfer Qty</th>
            </tr>
          </thead>

          <tbody>
            {allGrns.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No GRN breakdown
                </td>
              </tr>
            ) : (
              allGrns.map((grn, index) => (
               <tr key={`${grn.itemCode}-${grn.grnNumber}-${index}`}>
                  <td className="border p-2">{grn.grnNumber}</td>
                  <td className="border p-2">{grn.grnDate}</td>
                  <td className="border p-2 text-right">
                    {grn.currentQuantity}
                  </td>
                  <td className="border p-2 text-right font-bold">
                    {grn.TransferQty}
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