import { StockTransferListResponse } from "@/types/stockReceipt";

type Props = {
  transfers: StockTransferListResponse[];
  onSelect: (transferNo: string) => void;
};

export default function ApprovedTransferTable({
  transfers,
  onSelect,
}: Props) {
  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Transfer No</th>
          <th className="border p-2">Transfer Date</th>
          <th className="border p-2">From Location</th>
          <th className="border p-2">To Location</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Approved Date</th>
          <th className="border p-2">Select</th>
        </tr>
      </thead>

      <tbody>
        {transfers.length === 0 ? (
          <tr>
            <td colSpan={7} className="border p-4 text-center">
              No transfers loaded
            </td>
          </tr>
        ) : (
          transfers.map((transfer) => (
            <tr key={transfer.transferNo}>
              <td className="border p-2 text-blue-600">
                {transfer.transferNo}
              </td>
              <td className="border p-2">{transfer.transferDate}</td>
              <td className="border p-2">{transfer.fromLocation}</td>
              <td className="border p-2">{transfer.toLocation}</td>
              <td className="border p-2">{transfer.status}</td>
              <td className="border p-2">
                {transfer.approvedDate || "-"}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => onSelect(transfer.transferNo)}
                  className="text-blue-600 underline"
                >
                  Select
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}