"use client";

import { useEffect, useState } from "react";
import { StockReceiptListResponse } from "@/types/stockReceipt";
import { getStockReceiptList } from "../services/api";
import StockReceiptFilters from "./StockReceiptFilters";
import StockReceiptTable from "./StockReceiptTable";

type Props = {
  onCreateNew: () => void;
  onOpenReceipt: (receipt: StockReceiptListResponse) => void;
};

const PAGE_SIZE = 5;

export default function StockReceiptList({
  onCreateNew,
  onOpenReceipt,
}: Props) {
  const [records, setRecords] = useState<StockReceiptListResponse[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<
    StockReceiptListResponse[]
  >([]);

  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadReceipts = async (targetPage: number) => {
    if (targetPage < 0) return;

    try {
      setLoading(true);

      const res = await getStockReceiptList(targetPage);
      const data = res.data || [];

      setRecords(data);
      setFilteredRecords(data);
      setHasNext(data.length === PAGE_SIZE);
      setPage(targetPage);
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        alert("You have no authority to do this action");
      } else {
        alert("Failed to load stock receipt list");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts(0);
  }, []);

  return (
    <div className="space-y-4">
      <StockReceiptFilters
        records={records}
        onFilteredRecords={setFilteredRecords}
        onCreateNew={onCreateNew}
      />

      <StockReceiptTable
        records={filteredRecords}
        onOpenReceipt={onOpenReceipt}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => loadReceipts(page - 1)}
          disabled={loading || page === 0}
          className="rounded-full bg-gray-600 px-5 py-3 text-xl font-bold text-white disabled:opacity-40"
        >
          ↑
        </button>

        <button
          onClick={() => loadReceipts(page + 1)}
          disabled={loading || !hasNext}
          className="rounded-full bg-teal-600 px-5 py-3 text-xl font-bold text-white disabled:opacity-40"
        >
          ↓
        </button>
      </div>
    </div>
  );
}