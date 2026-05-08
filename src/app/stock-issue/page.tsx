"use client";

import { useState } from "react";
import InventoryLayout from "@/features/stockIssue/components/InventoryLayout";
import StockIssueHeader from "@/features/stockIssue/components/StockIssueHeader";
import StockIssueTabs from "@/features/stockIssue/components/StockIssueTabs";
import StockIssueEntry from "@/features/stockIssue/components/StockIssueEntry";
import StockIssueList from "@/features/stockIssue/components/StockIssueList";

export default function StockIssuePage() {
  const [activeTab, setActiveTab] = useState<"entry" | "list">("list");

  return (
    <InventoryLayout>
      <StockIssueHeader />

      <StockIssueTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "entry" ? <StockIssueEntry /> : <StockIssueList />}
    </InventoryLayout>
  );
}