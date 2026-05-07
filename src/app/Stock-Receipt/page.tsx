"use client";

import StockReceiptHeader from "@/features/stockReceipt/components/StockReceiptHeader";
import StockReceiptTabs from "@/features/stockReceipt/components/StockReceiptTabs";

export default function StockReceiptPage() {
  return (
    <div className="p-6">
      <StockReceiptHeader />
      <StockReceiptTabs />
    </div>
  );
}