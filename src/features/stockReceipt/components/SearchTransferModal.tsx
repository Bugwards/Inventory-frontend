"use client";

import { useState } from "react";
import { getApprovedTransfers } from "../services/api";
import {
  Location,
  StockTransferListResponse,
} from "@/types/stockReceipt";
import ApprovedTransferTable from "./ApprovedTransferTable";

type Props = {
  fromLocation: Location;
  receiptLocation: Location;
  onClose: () => void;
  onSelect: (transferNo: string) => void;
};

export default function SearchTransferModal({
  fromLocation,
  receiptLocation,
  onClose,
  onSelect,
}: Props) {
  const [page, setPage] = useState(0);
  const [transferNoSearch, setTransferNoSearch] = useState("");
  const [transfers, setTransfers] = useState<StockTransferListResponse[]>(
    []
  );

  const retrieveTransfers = async (targetPage = 0) => {
    try {
      const res = await getApprovedTransfers(
        targetPage,
        fromLocation,
        receiptLocation
      );

      const data: StockTransferListResponse[] = res.data || [];

      const filtered = transferNoSearch.trim()
        ? data.filter((t) =>
            t.transferNo
              .toLowerCase()
              .includes(transferNoSearch.toLowerCase())
          )
        : data;

      setTransfers(filtered);
      setPage(targetPage);

      if (filtered.length === 0) {
        alert("no any transfer");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to retrieve transfer records");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-[1000px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-5">
          <h2 className="text-xl font-bold">
            Search Stock Transfer Records
          </h2>

          <button onClick={onClose} className="font-bold text-red-500">
            X
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">Transfer Date</label>
            <select disabled className="input w-full">
              <option>All Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <input value="APPROVED" disabled className="input w-full" />
          </div>

          <div>
            <label className="block text-sm mb-1">From Location</label>
            <input value={fromLocation} disabled className="input w-full" />
          </div>

          <div>
            <label className="block text-sm mb-1">To Location</label>
            <input value={receiptLocation} disabled className="input w-full" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-sm mb-1">
              Search Transfer No
            </label>
            <input
              value={transferNoSearch}
              onChange={(e) => setTransferNoSearch(e.target.value)}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Sort By</label>
            <select disabled className="input w-full">
              <option>Transfer No</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => retrieveTransfers(0)}
              className="bg-orange-500 text-white px-6 py-2 rounded"
            >
              Retrieve
            </button>
          </div>
        </div>

        <p className="text-sm text-blue-600 mb-3">
          Showing {transfers.length} records
        </p>

        <ApprovedTransferTable
          transfers={transfers}
          onSelect={onSelect}
        />

        <div className="flex justify-between mt-5">
          <button
            onClick={() => retrieveTransfers(Math.max(0, page - 1))}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button
            onClick={() => retrieveTransfers(page + 1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}