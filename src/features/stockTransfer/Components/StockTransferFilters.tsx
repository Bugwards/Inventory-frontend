"use client";

import { useState } from "react";
import { StockTransferListResponse } from "@/types/stockTransfer";
import { useStockTransfer } from "../hooks/useStockTransfer";

interface Props {
  records: StockTransferListResponse[];
  onFilteredRecords: (records: StockTransferListResponse[]) => void;
  onRefresh: () => void;
}

export default function StockTransferFilters({
  records,
  onFilteredRecords,
  onRefresh,
}: Props) {
  const { setActiveTab, setOpenedTransfer, clearTransferItems } =
    useStockTransfer();

  const [transferDate, setTransferDate] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [fromLocation, setFromLocation] = useState("ALL");
  const [toLocation, setToLocation] = useState("ALL");
  const [searchNo, setSearchNo] = useState("");
  const [sortBy, setSortBy] = useState("transferNo");
  const [order, setOrder] = useState("DESC");

  const handleRetrieve = () => {
    let result = [...records];

    if (status !== "ALL") {
      result = result.filter((r) => r.status === status);
    }

    if (fromLocation !== "ALL") {
      result = result.filter((r) => r.fromLocation === fromLocation);
    }

    if (toLocation !== "ALL") {
      result = result.filter((r) => r.toLocation === toLocation);
    }

    if (searchNo.trim()) {
      result = result.filter((r) =>
        r.transferNo.toLowerCase().includes(searchNo.toLowerCase())
      );
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (transferDate === "THIS_MONTH") {
      result = result.filter((r) => {
        const d = new Date(r.transferDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    }

    if (transferDate === "THIS_AND_LAST_MONTH") {
      result = result.filter((r) => {
        const d = new Date(r.transferDate);
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

        return (
          (d.getMonth() === currentMonth && d.getFullYear() === currentYear) ||
          (d.getMonth() === lastMonthDate.getMonth() &&
            d.getFullYear() === lastMonthDate.getFullYear())
        );
      });
    }

    result.sort((a, b) => {
      const valueA = sortBy === "transferNo" ? a.transferNo : a.transferDate;
      const valueB = sortBy === "transferNo" ? b.transferNo : b.transferDate;

      if (order === "ASC") {
        return valueA.localeCompare(valueB);
      }

      return valueB.localeCompare(valueA);
    });

    onFilteredRecords(result);
  };

  const handleCreateNewTransfer = () => {
    setOpenedTransfer(null);
    clearTransferItems();
    setActiveTab("entry");
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-bold text-teal-700">Filters</h3>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Transfer Date
          </label>
          <select
            value={transferDate}
            onChange={(e) => setTransferDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="ALL">All Days</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="THIS_AND_LAST_MONTH">This and Last Month</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="ALL">All</option>
            <option value="UNAPPROVED">Unapproved</option>
            <option value="APPROVED">Approved</option>
            <option value="TRANSFERRED">Transferred</option>
            <option value="CANCELED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            From Location
          </label>
          <select
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="ALL">All</option>
            <option value="ANURADHAPURA">Anuradhapura</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            To Location
          </label>
          <select
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="ALL">All</option>
            <option value="COLOMBO">Colombo</option>
            <option value="GALLE">Galle</option>
            <option value="GAMPAHA">Gampaha</option>
            <option value="JAFFNA">Jaffna</option>
            <option value="KANDY">Kandy</option>
            <option value="KALUTARA">Kaluthara</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Search Transfer No
          </label>
          <input
            value={searchNo}
            onChange={(e) => setSearchNo(e.target.value)}
            placeholder="Enter transfer number..."
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="transferNo">Transfer No</option>
            <option value="transferDate">Transfer Date</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Order</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={handleRetrieve}
          className="rounded-xl bg-[#FFB401] hover:bg-orange-500 px-5 py-2 font-semibold text-white shadow"
        >
          Retrieve
        </button>

        <button
          onClick={handleCreateNewTransfer}
          className="rounded-xl bg-blue-500 hover:bg-blue-600 px-5 py-2 font-semibold text-white shadow"
        >
          Create New Transfer
        </button>

        <button
          onClick={onRefresh}
          className="rounded-xl hover:bg-slate-200 border px-5 py-2 font-semibold"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}