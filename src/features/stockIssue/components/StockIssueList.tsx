"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StockIssueFilters from "./StockIssueFilters";
import StockIssueTable from "./StockIssueTable";
import {
  StockIssueFilterRequest,
  StockIssueListRow,
} from "@/types/stockIssue";
import { filterStockIssues } from "../services/api";

export default function StockIssueList() {
  const router = useRouter();

  const [filters, setFilters] = useState<StockIssueFilterRequest>({
    issueDateFilter: "ALL",
    status: "ALL",
    location: "ALL",
    department: "ALL",
    search: "",
    sortBy: "ISSUE_NO",
    sortDirection: "DESC",
  });

  const [rows, setRows] = useState<StockIssueListRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await filterStockIssues(filters);
      setRows(response);
    } catch (error) {
      console.error(error);
      alert("Failed to retrieve stock issues");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueClick = (issueNo: string) => {
    router.push(`/stock-issue/${encodeURIComponent(issueNo)}`);
  };

  return (
    <div className="mt-4 space-y-4">
      <StockIssueFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
          Loading stock issue records...
        </div>
      ) : (
        <StockIssueTable rows={rows} onIssueClick={handleIssueClick} />
      )}
    </div>
  );
}