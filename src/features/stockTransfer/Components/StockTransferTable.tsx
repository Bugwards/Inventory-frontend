"use client";

import { StockTransferListResponse } from "@/types/stockTransfer";
import { getSelectedStockTransferRecord } from "../services/api";
import { useStockTransfer } from "../hooks/useStockTransfer";

interface Props {
  records: StockTransferListResponse[];
}

function formatLocation(location: string) {
  return location.replace("_", " ");
}

function getStatusClass(status: string) {
  if (status === "APPROVED") return "bg-green-200 text-green-700";
  if (status === "CANCELLED") return "bg-red-100 text-red-800";
  if (status === "TRANSFERRED") return "bg-blue-200 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function StockTransferTable({ records }: Props) {
  const { setActiveTab, setOpenedTransfer, setTransferItems } =
    useStockTransfer();

  const handleOpenTransfer = async (record: StockTransferListResponse) => {
    try {
      const data = await getSelectedStockTransferRecord(record.transferNo);

      setOpenedTransfer({
        transferNo: record.transferNo,
        status: record.status,
        data,
      });

      setTransferItems(data.items || []);
      setActiveTab("entry");
    } catch (error) {
      console.error(error);
      alert("Failed to open stock transfer record");
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-5 font-bold">Showing {records.length} Records</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase text-slate-500">
            <th className="p-3">Transfer No</th>
            <th className="p-3">Transfer Date</th>
            <th className="p-3">From Location</th>
            <th className="p-3">To Location</th>
            <th className="p-3">Status</th>
            <th className="p-3">Approved Date</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr> 
              <td colSpan={6} className="p-8 text-center text-slate-500">  
                No stock transfers loaded
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.transferNo} className="border-b">
                <td className="p-3">
                          
                  <button 
                    onClick={() => handleOpenTransfer(record)}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {record.transferNo}
                  </button>
                </td>

                <td className="p-3">{record.transferDate}</td>
                <td className="p-3">{formatLocation(record.fromLocation)}</td>
                <td className="p-3">{formatLocation(record.toLocation)}</td>

                <td className="p-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>

                <td className="p-3">{record.approvedDate || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
