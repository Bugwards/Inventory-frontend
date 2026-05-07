"use client";

import { useEffect, useState } from "react";
import StockTransferFilters from "./StockTransferFilters";
import StockTransferTable from "./StockTransferTable";
import { getStockTransferList } from "../services/api";
import { StockTransferListResponse } from "@/types/stockTransfer";

const PAGE_SIZE = 5;

export default function StockTransferList() {
  const [records, setRecords] = useState<StockTransferListResponse[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<
    StockTransferListResponse[]
  >([]);

  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadTransfers = async (pageNumber: number) => {
    if (pageNumber < 0) return;

    try {
      setLoading(true);

      const data = await getStockTransferList(pageNumber);

      setRecords(data);
      setFilteredRecords(data);
      setHasNext(data.length === PAGE_SIZE);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
      alert("Failed to load stock transfer list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers(0);
  }, []);

  const handleNextPage = () => {
    if (!hasNext) return;
    loadTransfers(page + 1);
  };

  const handlePreviousPage = () => {
    if (page === 0) return;
    loadTransfers(page - 1);
  };

  const handleRefresh = () => {
    setPage(0);
    setHasNext(true);
    loadTransfers(0);
  };

  return (
    <div className="space-y-5">
      <StockTransferFilters
        records={records}
        onFilteredRecords={setFilteredRecords}
        onRefresh={handleRefresh}
      />

      <StockTransferTable records={filteredRecords} />

      <div className="flex justify-end gap-3">
        <button
          onClick={handlePreviousPage}
          disabled={loading || page === 0}
          className="rounded-full bg-slate-600 px-5 py-3 text-xl font-bold text-white shadow hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↑
        </button>

        <button
          onClick={handleNextPage}
          disabled={loading || !hasNext}
          className="rounded-full bg-teal-600 px-5 py-3 text-xl font-bold text-white shadow hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↓
        </button>
      </div>
    </div>
  );
}