import { StockIssueFilterRequest } from "@/types/stockIssue";

interface Props {
  filters: StockIssueFilterRequest;
  onChange: (filters: StockIssueFilterRequest) => void;
  onSearch: () => void;
}

export default function StockIssueFilters({
  filters,
  onChange,
  onSearch,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-700">Filters</span>
      </div>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500">
            Issue Date
          </label>
          <select
            value={filters.issueDateFilter}
            onChange={(e) =>
              onChange({
                ...filters,
                issueDateFilter: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
          >
            <option value="ALL">All</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_AND_THIS_MONTH">This & Last Month</option>
            <option value="DATE_RANGE">Date Period</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
          >
            <option value="ALL">All</option>
            <option value="UNAPPROVED">Unapproved</option>
            <option value="APPROVED">Approved</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) =>
              onChange({
                ...filters,
                location: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
          >
            <option value="ALL">All</option>
            <option value="Colombo">Colombo</option>
            <option value="Kandy">Kandy</option>
            <option value="Galle">Galle</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) =>
              onChange({
                ...filters,
                department: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
          >
            <option value="ALL">All</option>
            <option value="IT_DEPT">IT</option>
            <option value="HR_DEPT">HR</option>
            <option value="FINANCE_DEPT">Finance</option>
          </select>
        </div>
      </div>

      {/* DATE RANGE */}
      {filters.issueDateFilter === "DATE_RANGE" && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500">
              From Date
            </label>
            <input
              type="date"
              value={filters.fromDate || ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  fromDate: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-500">
              To Date
            </label>
            <input
              type="date"
              value={filters.toDate || ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  toDate: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
            />
          </div>
        </div>
      )}

      {/* BOTTOM ROW */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500">
            Search (Issue No)
          </label>
          <input
            value={filters.search}
            onChange={(e) =>
              onChange({
                ...filters,
                search: e.target.value,
              })
            }
            placeholder="Search issue no..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
          >
            <option value="ISSUE_NO">Issue No</option>
            <option value="ISSUE_DATE">Issue Date</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-slate-500">
            Order
          </label>
          <select
            value={filters.sortDirection}
            onChange={(e) =>
              onChange({
                ...filters,
                sortDirection: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onSearch}
            className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
          >
            Retrieve
          </button>
        </div>
      </div>
    </div>
  );
}