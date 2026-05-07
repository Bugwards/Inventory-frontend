"use client";

import StockTransferHeader from "@/features/stockTransfer/Components/StockTransferHeader";
import StockTransferTabs from "@/features/stockTransfer/Components/StockTransferTabs";
import StockTransferEntry from "@/features/stockTransfer/Components/StockTransferEntry";
import StockTransferList from "@/features/stockTransfer/Components/StockTransferList";
import { useStockTransfer } from "@/features/stockTransfer/hooks/useStockTransfer";

export default function StockTransferPage() {
  const { activeTab } = useStockTransfer();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <StockTransferHeader />
      <StockTransferTabs />

      {activeTab === "entry" ? <StockTransferEntry /> : <StockTransferList />}
    </div>
  );
}