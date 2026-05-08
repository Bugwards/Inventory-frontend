import { StockIssueListRow } from "@/types/stockIssue";

interface Props {
  rows: StockIssueListRow[];
  onIssueClick: (issueNo: string) => void;
}

function getStatusClasses(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "UNAPPROVED":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function StockIssueTable({ rows, onIssueClick }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <p className="mb-4 text-sm font-semibold text-slate-700">
        Showing {rows.length} Records
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2">Issue No</th>
              <th className="px-3 py-2">Issue Date</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Approved Date</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="rounded-xl bg-slate-50 px-3 py-8 text-center text-slate-500"
                >
                  No stock issue records found
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.issueNo}
                  className="rounded-xl bg-slate-50 text-slate-700 shadow-sm"
                >
                  <td className="rounded-l-xl px-3 py-3">
                    <button
                      type="button"
                      onClick={() => onIssueClick(row.issueNo)}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {row.issueNo}
                    </button>
                  </td>

                  <td className="px-3 py-3">{row.issueDate}</td>

                  <td className="px-3 py-3">{row.location}</td>

                  <td className="px-3 py-3">{row.department}</td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>

                  <td className="rounded-r-xl px-3 py-3">
                    {row.status === "UNAPPROVED"
                      ? "-"
                      : row.approvedDate || "-"}
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