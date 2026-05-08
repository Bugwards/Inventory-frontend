"use client";

import InventorySidebar from "./InventorySidebar";
import InventoryTopbar from "./InventoryTopbar";

interface Props {
  children: React.ReactNode;
}

export default function InventoryLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <InventorySidebar />
      <InventoryTopbar />

      <main className="ml-64 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}