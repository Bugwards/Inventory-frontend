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
    <div className="p-6 space-y-6 bg-white min-h-screen">

      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#953002]">
          Bin Card
        </h1>
        <p className="text-gray-500 text-sm">
          Search for items and track stock movements
        </p>
      </div>

      {/* 🔍 SEARCH */}
      {!summary && (
        <div className="relative">
        <input
          placeholder="Search item..."
          className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#953002] outline-none bg-white"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchItems(e.target.value);
          }}
        />

        {/* 🔥 SUGGESTIONS DROPDOWN */}
        {suggestions.length > 0 && (
          <div className="absolute w-full shadow-xl rounded-xl mt-2 z-50 border">
            {suggestions.map((item: any) => (
              <div
                key={item.itemCode}
                className="px-4 py-3 hover:bg-slate-100 cursor-pointer transition flex justify-between"
                onClick={() => {
                  selectItem(item.itemCode);
                  setSearch(item.itemName);
                  setSuggestions([]);
                }}
              >
                <span className="font-medium">{item.itemName}</span>
                <span className="text-gray-400 text-sm">
                  {item.itemCode}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      )}
      

      {/* 📊 SUMMARY */}
      {summary && (
        <div className="space-y-6 ">

          {/* 🔙 BACK BUTTON */}
          <button
            onClick={() => {
              reset();
              setSearch("");
            }}
            className="px-4 py-2 bg-white text-[#953002] rounded-lg shadow hover:bg-gray-100 transition"
          >
            ← Back to Search
          </button>

          {/* 🔥 HEADER CARD */}
          <div className="bg-[#953002] text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {summary.itemName}
              </h2>
              <p className="text-sm opacity-80">
                Code: {summary.itemCode}
              </p>
            </div>

            <span className={`px-4 py-1 rounded-full text-sm font-medium 
              ${summary.movementType === "FAST"
                ? "bg-green-300 text-green-800"
                : "bg-yellow-300 text-yellow-800"}`}
            >
              {summary.movementType}
            </span>
          </div>

          {/* 📦 STOCK CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">

            <Card title="Min Stock" value={summary.minimumLevel} />
            <Card title="Reorder Level" value={summary.reorderLevel} />
            <Card title="Total Inward" value={summary.totalInward} green />
            <Card title="Total Outward" value={summary.totalOutward} red />

          </div>

          {/* 📈 ANALYTICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <Card
              title="Avg Monthly Usage"
              value={summary.averageMonthlyUsage}
            />

          </div>

          {/* 📜 HISTORY TABLE */}
          <div className="border border-[#953002] p-5 rounded-2xl shadow-md">

            <h3 className="font-semibold mb-4 text-gray-700">
              Bin Card History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead>
                  <tr className="text-left border-b-3 text-gray-500">
                    <th className="py-2">Date</th>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {summary.history.map((h: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-slate-100 transition"
                    >
                      <td className="py-2">{h.date}</td>

                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${h.type === "INWARD"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}`}
                        >
                          {h.type}
                        </span>
                      </td>

                      <td>{h.reference}</td>

                      <td className="text-green-600 font-medium">
                        {h.inwardQty}
                      </td>

                      <td className="text-red-600 font-medium">
                        {h.outwardQty}
                      </td>

                      <td className="font-semibold text-gray-800">
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

/* 🔥 REUSABLE CARD */
function Card({ title, value, green, red }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2
        className={`text-xl font-semibold mt-1
        ${green ? "text-green-600" : ""}
        ${red ? "text-red-600" : ""}
      `}
      >
        {value ?? 0}
      </h2>
    </div>
  );
}