"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getStockView } from "@/services/stockAdjustmentService";

export default function StockPickerModal({
  location,
  onSelect,
  onClose,
}: any) {

  const primary = "#953002";
  const accent = "#FFB401";

  const [stocks, setStocks] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const res = await getStockView(location);
    setStocks(res || []);
  }, [location]);

  useEffect(() => {
    if (location) load();
  }, [location, load]);

  // ================= FILTER =================
  const filteredStocks = useMemo(() => {
    return stocks.filter((s: any) =>
      s.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      s.itemCode?.toLowerCase().includes(search.toLowerCase()) ||
      s.grnNo?.toLowerCase().includes(search.toLowerCase())
    );
  }, [stocks, search]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      {/* MODAL */}
      <div className="bg-white w-[1000px] max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: primary }}
            >
              Select Stock
            </h2>


          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <div className="p-4 border-b bg-white">
          <input
            placeholder="Search item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full rounded outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        {/* TABLE */}
        <div className="overflow-y-auto flex-1">

          <table className="w-full text-sm min-w-[900px]">

            <thead className="sticky top-0 z-10">
              <tr
                className="text-white uppercase text-xs"
                style={{
                  background: `linear-gradient(90deg, ${primary}, ${accent})`,
                }}
              >
                <th className="px-5 py-3 text-left">Item</th>
                <th className="px-5 py-3 text-left">Ref No</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-center">Qty</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStocks.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                  >
                    No stock available
                  </td>
                </tr>
              )}

              {filteredStocks.map((s: any, index: number) => (
                <tr
                  key={s.stockId}
                  className={`border-b transition hover:bg-orange-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >

                  <td className="px-5 py-3 font-medium">
                    {s.itemName}
                  </td>

                  <td
                    className="px-5 py-3 font-medium"
                    style={{ color: primary }}
                  >
                    {s.grnNo || "OPENING"}
                  </td>

                  <td className="px-5 py-3">
                    {s.createdAt
                      ? new Date(s.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-5 py-3 text-center font-semibold">
                    {s.currentQty}
                  </td>

                  <td className="px-5 py-3 text-right">
                    {s.unitPrice?.toLocaleString() || "0"}
                  </td>

                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() =>
                        onSelect({
                          stockId: s.stockId,
                          itemName: s.itemName,
                          grnId: s.grnId,
                          grnNo: s.grnNo,
                          currentQty: s.currentQty,
                          unitPrice: s.unitPrice,
                        })
                      }
                      className="text-white px-3 py-1.5 rounded text-xs font-semibold hover:opacity-90"
                      style={{ backgroundColor: primary }}
                    >
                      Select
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">

          <p className="text-sm text-gray-500">
            Showing {filteredStocks.length} items
          </p>

          <button
            onClick={onClose}
            className="text-white px-4 py-2 rounded font-semibold"
            style={{ backgroundColor: primary }}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}