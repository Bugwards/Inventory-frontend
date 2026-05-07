"use client";

import { StockReceiptListResponse } from "@/types/stockReceipt";

type Props = {
  records: StockReceiptListResponse[];
  onOpenReceipt: (receipt: StockReceiptListResponse) => void;
};

function getStatusClass(status: string) {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "CANCELLED" || status === "CANCELED")
    return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

function formatLocation(location: string) {
  return location.replace("_", " ");
}

export default function StockReceiptTable({
  records,
  onOpenReceipt,
}: Props) {
  return (
    <div className="rounded bg-white p-6 shadow">
      <h3 className="mb-5 font-bold">Showing {records.length} Records</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase text-gray-500">
            <th className="p-3">Receipt No</th>
            <th className="p-3">Receipt Date</th>
            <th className="p-3">Transfer No</th>
            <th className="p-3">From Location</th>
            <th className="p-3">Receipt Location</th>
            <th className="p-3">Status</th>
            <th className="p-3">Approved Date</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">
                No stock receipts loaded
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.receiptNo} className="border-b">
                <td className="p-3">
                  <button
                    onClick={() => onOpenReceipt(record)}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {record.receiptNo}
                  </button>
                </td>

                <td className="p-3">{record.receiptDate}</td>
                <td className="p-3">{record.transferNo}</td>
                <td className="p-3">{formatLocation(record.fromLocation)}</td>
                <td className="p-3">
                  {formatLocation(record.receiptLocation)}
                </td>

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