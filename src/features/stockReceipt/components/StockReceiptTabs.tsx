"use client";

import { useState } from "react";
import StockReceiptEntry from "./StockReceiptEntry";
import StockReceiptList from "./StockReceiptList";
import { StockReceiptListResponse } from "@/types/stockReceipt";

export default function StockReceiptTabs() {
  const [activeTab, setActiveTab] = useState<"entry" | "list">("entry");
  const [openedReceipt, setOpenedReceipt] =
    useState<StockReceiptListResponse | null>(null);

  const openNewReceipt = () => {
    setOpenedReceipt(null);
    setActiveTab("entry");
  };

  const openExistingReceipt = (receipt: StockReceiptListResponse) => {
    setOpenedReceipt(receipt);
    setActiveTab("entry");
  };

  return (
    <div>
      <div className="mb-3  grid grid-cols-2 flex overflow-hidden rounded-lg  bg-white shadow">
        <button
          onClick={() => setActiveTab("entry")}
          className={`rounded-l-xl py-4 text-sm font-semibold ${
            activeTab === "entry"
              ? "bg-[#953002] text-white"
              : "text-slate-600"
          }`}
        >
          Stock Receipt Entry
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`rounded-r-xl py-4 text-sm font-semibold ${
          activeTab === "list"
            ? "bg-[#953002] text-white"
            : "text-slate-600"
          }`}
        >
          Stock Receipt List
        </button>
      </div>

      {activeTab === "entry" ? (
        <StockReceiptEntry
          openedReceipt={openedReceipt}
          goToList={() => setActiveTab("list")}
          clearOpenedReceipt={() => setOpenedReceipt(null)}
        />
      ) : (
        <StockReceiptList
          onCreateNew={openNewReceipt}
          onOpenReceipt={openExistingReceipt}
        />
      )}
    </div>
  );
}