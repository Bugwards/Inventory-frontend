"use client";

import { useState } from "react";
import useBinCard from "@/features/binCard/hooks/useBinCard";

export default function BinCardPage() {
  const [search, setSearch] = useState("");

  const {
    suggestions,
    summary,
    searchItems,
    selectItem,
    setSuggestions,
    reset,
  } = useBinCard();
  return (
    <div className="p-6 space-y-6 bg-zinc-50/50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Bin Card
        </h1>
        <p className="text-gray-500 text-sm">
          Search for items and track stock movements
        </p>
      </div>

      {/* SEARCH */}
      {!summary && (
        <div className="relative">
        <input
          placeholder="Search item..."
          className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-all"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchItems(e.target.value);
          }}
        />

        {/* SUGGESTIONS DROPDOWN */}
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-white shadow-xl rounded-xl mt-2 z-50 border border-gray-100 overflow-hidden">
            {suggestions.map((item: any) => (
              <div
                key={item.itemCode}
                className="px-5 py-3.5 hover:bg-orange-50/50 cursor-pointer transition flex justify-between items-center border-b border-gray-50 last:border-0"
                onClick={() => {
                  selectItem(item.itemCode);
                  setSearch(item.itemName);
                  setSuggestions([]);
                }}
              >
                <span className="font-semibold text-gray-700">{item.itemName}</span>
                <span className="text-primary font-medium text-xs bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                  {item.itemCode}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      )}
      

      {/* SUMMARY */}
      {summary && (
        <div className="space-y-6">

          {/* BACK BUTTON */}
          <button
            onClick={() => {
              reset();
              setSearch("");
            }}
            className="px-5 py-2.5 bg-white text-primary rounded-xl shadow-sm border border-gray-200 hover:bg-orange-50/40 hover:border-primary/30 transition font-semibold text-sm cursor-pointer"
          >
            ← Back to Search
          </button>

          {/* HEADER CARD */}
          <div className="bg-primary text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                {summary.itemName}
              </h2>
              <p className="text-xs opacity-80 mt-1 font-medium">
                Code: {summary.itemCode}
              </p>
            </div>

            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border
              ${summary.movementType === "FAST"
                ? "bg-success/20 text-white border-success/30"
                : "bg-warning/20 text-white border-warning/30"}`}
            >
              {summary.movementType} Movement
            </span>
          </div>

          {/* stock cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Card title="Min Stock" value={summary.minimumLevel} />
            <Card title="Reorder Level" value={summary.reorderLevel} />
            <Card title="Total Inward" value={summary.totalInward} green />
            <Card title="Total Outward" value={summary.totalOutward} red />

          </div>

          {/*Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <Card
              title="Avg Monthly Usage"
              value={summary.averageMonthlyUsage}
            />

          </div>

          {/* HISTORY TABLE */}
          <div className="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">

            <h3 className="font-bold text-gray-800 mb-4">
              Bin Card History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead>
                  <tr className="text-left border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3 px-4">Date</th>
                    <th className="px-4">Type</th>
                    <th className="px-4">Reference</th>
                    <th className="px-4">In</th>
                    <th className="px-4">Out</th>
                    <th className="px-4">Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {summary.history.map((h: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-orange-50/20 last:border-0 transition"
                    >
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{h.date}</td>

                      <td className="px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                          ${h.type === "INWARD"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-error/10 text-error border-error/20"}`}
                        >
                          {h.type}
                        </span>
                      </td>

                      <td className="px-4 text-gray-500">{h.reference}</td>

                      <td className="px-4 text-success font-bold">
                        {h.inwardQty}
                      </td>

                      <td className="px-4 text-error font-bold">
                        {h.outwardQty}
                      </td>

                      <td className="px-4 font-bold text-gray-800">
                        {h.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

/* REUSABLE CARD */
function Card({ title, value, green, red }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>

      <h2
        className={`text-2xl font-bold mt-2
        ${green ? "text-success" : ""}
        ${red ? "text-error" : ""}
        ${!green && !red ? "text-gray-800" : ""}
      `}
      >
        {value ?? 0}
      </h2>
    </div>
  );
}