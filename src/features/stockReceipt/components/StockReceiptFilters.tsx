"use client";

import { useState } from "react";
import { StockReceiptListResponse } from "@/types/stockReceipt";

type Props = {
  records: StockReceiptListResponse[];
  onFilteredRecords: (records: StockReceiptListResponse[]) => void;
  onCreateNew: () => void;
};

export default function StockReceiptFilters({
  records,
  onFilteredRecords,
  onCreateNew,
}: Props) {
  const [receiptDate, setReceiptDate] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [fromLocation, setFromLocation] = useState("ALL");
  const [receiptLocation, setReceiptLocation] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("receiptNo");
  const [order, setOrder] = useState("DESC");

  const handleRetrieve = () => {
    let result = [...records];

    if (status !== "ALL") {
      result = result.filter((r) => r.status === status);
    }

    if (fromLocation !== "ALL") {
      result = result.filter((r) => r.fromLocation === fromLocation);
    }

    if (receiptLocation !== "ALL") {
      result = result.filter((r) => r.receiptLocation === receiptLocation);
    }

    if (search.trim()) {
      const key = search.toLowerCase();

      result = result.filter(
        (r) =>
          r.receiptNo.toLowerCase().includes(key) ||
          r.transferNo.toLowerCase().includes(key)
      );
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (receiptDate === "THIS_MONTH") {
      result = result.filter((r) => {
        const d = new Date(r.receiptDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    }

    if (receiptDate === "THIS_AND_LAST_MONTH") {
      result = result.filter((r) => {
        const d = new Date(r.receiptDate);
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

        return (
          (d.getMonth() === currentMonth && d.getFullYear() === currentYear) ||
          (d.getMonth() === lastMonthDate.getMonth() &&
            d.getFullYear() === lastMonthDate.getFullYear())
        );
      });
    }

    result.sort((a, b) => {
      const valueA = sortBy === "receiptNo" ? a.receiptNo : a.receiptDate;
      const valueB = sortBy === "receiptNo" ? b.receiptNo : b.receiptDate;

      if (order === "ASC") {
        return valueA.localeCompare(valueB);
      }

      return valueB.localeCompare(valueA);
    });

    onFilteredRecords(result);
  };

  return (
    <div className="rounded bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-bold text-[#953002]">Filters</h3>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold ">
            Receipt Date
          </label>
          <select
            value={receiptDate}
            onChange={(e) => setReceiptDate(e.target.value)}
            className=" w-full rounded-xl border px-3 py-2 "
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
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            From Location
          </label>
          <select
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className=" w-full rounded-xl border px-3 py-2 "
          >
            <option value="ALL">All</option>
            <option value="HEAD_OFFICE">Head Office</option>
            <option value="GALLE">Galle</option>
            <option value="KANDY">Kandy</option>
            <option value="ANURADHAPURA">Anuradhapura</option>
            <option value="GAMPAHA">Gampaha</option>
            <option value="KALUTARA">Kalutara</option>
            <option value="KURUNEGALA">Kurunegala</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">
            Receipt Location
          </label>
          <select
            value={receiptLocation}
            onChange={(e) => setReceiptLocation(e.target.value)}
            className=" w-full rounded-xl border px-3 py-2 "
          >
            <option value="ALL">All</option>
            <option value="HEAD_OFFICE">Head Office</option>
            <option value="GALLE">Galle</option>
            <option value="KANDY">Kandy</option>
            <option value="ANURADHAPURA">Anuradhapura</option>
            <option value="GAMPAHA">Gampaha</option>
            <option value="KALUTARA">Kalutara</option>
            <option value="KURUNEGALA">Kurunegala</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">
            Search Receipt No / Transfer No
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter receipt or transfer number..."
            className=" w-full rounded-xl border px-3 py-2 "
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className=" w-full rounded-xl border px-3 py-2 "
          >
            <option value="receiptNo">Receipt No</option>
            <option value="receiptDate">Receipt Date</option>
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
          className="rounded-lg bg-[#FFB401] hover:bg-orange-500 px-5 py-2 font-semibold text-white"
        >
          Retrieve
        </button>

        <button
          onClick={onCreateNew}
          className="rounded-lg bg-blue-500 hover:bg-blue-600 px-5 py-2 font-semibold text-white"
        >
          Create New Stock Receipt
        </button>
      </div>
    </div>
  );
}