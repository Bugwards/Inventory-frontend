"use client";

import { useEffect, useState } from "react";
import {
  approveStockTransfer,
  cancelStockTransfer,
  saveCancelReason,
  saveStockTransfer,
  updateStockTransferRecord,
} from "../services/api";
import { useStockTransfer } from "../hooks/useStockTransfer";
import AddTransferItemModal from "./AddTransferItemModal";
import TransferItemsTable from "./TransferItemsTable";
import GrnBreakdownTable from "./GrnBreakdownTable";
import { getCurrentUserLocation } from "../services/api";
import CancelTransferModal from "./CancelTransferModal";

export default function StockTransferEntry() {
  const {
    transferItems,
    clearTransferItems,
    setTransferItems,
    setActiveTab,
    openedTransfer,
    setOpenedTransfer,
  } = useStockTransfer();

  const [date, setDate] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [requestRef, setRequestRef] = useState("");
  const [comment, setComment] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isEditMode = openedTransfer !== null;
  const isUnapproved = openedTransfer?.status === "UNAPPROVED";
  const isReadonly = isEditMode && !isUnapproved;

  useEffect(() => {
    if (openedTransfer) {
      setDate(openedTransfer.data.date);
      setToLocation(openedTransfer.data.toLocation);
      setRequestRef(openedTransfer.data.requestRef || "");
      setComment(openedTransfer.data.comment || "");
      setTransferItems(openedTransfer.data.items || []);
    }
  }, [openedTransfer, setTransferItems]);

  const resetForm = () => {
    setDate("");
    setToLocation("");
    setRequestRef("");
    setComment("");
    setDocumentName("");
    clearTransferItems();
    setOpenedTransfer(null);
  };

  useEffect(() => {
  const loadCurrentUserLocation = async () => {
    try {
      const location = await getCurrentUserLocation();
      setFromLocation(location);
    } catch (error) {
      console.error(error);
      alert("Failed to load current user location");
    }
  };

  loadCurrentUserLocation();
}, []);

  const validateForm = () => {
    if (!date) {
      alert("Date is mandatory");
      return false;
    }

    if (!isEditMode) {
      const today = new Date().toISOString().split("T")[0];

      if (date !== today) {
        alert("Transfer Date must be today date");
        return false;
      }
    }

    if (!toLocation) {
      alert("To Location is mandatory");
      return false;
    }

    if (transferItems.length === 0) {
      alert("At least one transfer item is required");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (isReadonly) {
      alert("Approved, transferred, or cancelled transfers cannot be edited");
      return;
    }

    if (!validateForm()) return;

    try {
      const payload = {
        date,
        toLocation,
        requestRef,
        comment,
        items: transferItems,
      };

      if (isEditMode && openedTransfer) {
        await updateStockTransferRecord(openedTransfer.transferNo, payload);
        alert("Stock Transfer updated successfully");
      } else {
        await saveStockTransfer(payload);
        alert("Stock Transfer saved successfully");
      }

      resetForm();
      setActiveTab("list");
    } catch (error) {
      console.error(error);
      alert("Failed to save stock transfer");
    }
  };

  const handleApprove = async () => {
    if (!openedTransfer) return;

    const confirmed = confirm(
      "Do you want to approve the Stock Transfer? Please note that the Transfer cannot be modified after the approval"
    );

    if (!confirmed) return;

    try {
      await approveStockTransfer(openedTransfer.transferNo);
      alert("Stock Transfer approved successfully");

      resetForm();
      setActiveTab("list");
    } catch (error) {
      console.error(error);
      alert("Failed to approve stock transfer");
    }
  };

  const handleCancelConfirm = async (reason: string) => {
  if (!openedTransfer) return;

  try {
    await saveCancelReason(openedTransfer.transferNo, reason);
    await cancelStockTransfer(openedTransfer.transferNo);

    setShowCancelModal(false);

    alert("Stock Transfer cancelled successfully");

    resetForm();
    setActiveTab("list");
  } catch (error) {
    console.error(error);
    alert("Failed to cancel stock transfer");
  }
};

  return (
    <div className="rounded-xl bg-white p-7 shadow">
      <div className="mb-8 flex items-start justify-between">
        <h2 className="text-xl font-bold text-slate-900">Stock Transfer</h2>

        <div className="text-right">
          <div className="flex justify-end gap-3">
            {isEditMode && isUnapproved && (
              <>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="rounded-xl bg-red-500 hover:bg red-800 px-6 py-3 font-semibold text-white shadow hover:bg-red-800"
                >
                  Cancel
                </button>

                <button
                  onClick={handleApprove}
                  className="rounded-xl bg-blue-500 hover:bg blue-800 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
                >
                  Approve
                </button>
              </>
            )}

            {!isReadonly && (
              <button
                onClick={handleSave}
                className="rounded-xl bg-[#FFB401] px-6 py-3 font-semibold text-white shadow hover:bg-orange-600"
              >
                Save
              </button>
            )}
          </div>

          <p className="mt-2 text-sm">
            Status:{" "}
            <span
              className={`font-semibold ${
                openedTransfer?.status === "APPROVED"
                  ? "text-green-600"
                  : openedTransfer?.status === "CANCELED"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {openedTransfer?.status || "UNAPPROVED"}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            Transfer No
          </label>
          <input
            value={openedTransfer?.transferNo || "New"}
            disabled
            className="w-full rounded-xl border bg-slate-100 px-4 py-3 text-slate-700"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            Date
          </label>
          <input
            type="date"
            value={date}
            min={!isEditMode ? new Date().toISOString().split("T")[0] : undefined}
            max={!isEditMode ? new Date().toISOString().split("T")[0] : undefined}
            disabled={isReadonly}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            From Location
          </label>
         <input
          value={fromLocation || "Loading..."}
          disabled
          className="w-full rounded-xl border bg-slate-100 px-4 py-3 text-slate-700"
        />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            To Location *
          </label>
          <select
            value={toLocation}
            disabled={isReadonly}
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
          >
            <option value="">Select To location</option>
            <option value="COLOMBO">Colombo</option>
            <option value="GALLE">Galle</option>
            <option value="GAMPAHA">Gampaha</option>
            <option value="JAFFNA">Jaffna</option>
            <option value="KANDY">Kandy</option>
            <option value="KALUTARA">Kaluthara</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-600">
          Request Ref
        </label>
        <input
          value={requestRef}
          disabled={isReadonly}
          onChange={(e) => setRequestRef(e.target.value)}
          placeholder="Enter reference number (optional)"
          className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-600">
          Comment
        </label>
        <textarea
          value={comment}
          disabled={isReadonly}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter any comments (optional)"
          className="h-24 w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-slate-600">
          Add a Document
        </label>
        <input
          type="file"
          disabled={isReadonly}
          onChange={(e) => setDocumentName(e.target.files?.[0]?.name || "")}
          className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
        />

        {documentName && (
          <p className="mt-2 text-sm text-slate-600">
            Attached: {documentName}
          </p>
        )}
      </div>

      <div className="mt-8 border-t pt-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Transfer Items
        </h3>

        {!isReadonly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Transfer Item
          </button>
        )}

        <div className="grid grid-cols-2 gap-6">
          <TransferItemsTable readonly={isReadonly} />
          <GrnBreakdownTable />
        </div>
      </div>

      {isModalOpen && !isReadonly && (
        <AddTransferItemModal onClose={() => setIsModalOpen(false)} />
      )}

      {showCancelModal && (
        <CancelTransferModal
           onClose={() => setShowCancelModal(false)}
           onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
}