"use client";

import { useStockTransfer } from "../hooks/useStockTransfer";

export default function StockTransferTabs() {
  const { activeTab, setActiveTab } = useStockTransfer();

  return (
    <div className="mb-3 grid grid-cols-2 rounded-xl bg-white shadow">
      <button
        onClick={() => setActiveTab("entry")}
        className={`rounded-l-xl py-4 text-sm font-semibold ${
          activeTab === "entry"
            ? "bg-[#953002] text-white"
            : "text-slate-600"
        }`}
      >
        Stock Transfer Entry
      </button>

      <button
        onClick={() => setActiveTab("list")}
        className={`rounded-r-xl py-4 text-sm font-semibold ${
          activeTab === "list"
            ? "bg-[#953002] text-white"
            : "text-slate-600"
        }`}
      >
        Stock Transfer List
      </button>
    </div>
  );
}