"use client";

import { ChangeEvent, useState } from "react";
import { Calendar, MapPin, Paperclip, X } from "lucide-react";
import { departmentOptions } from "../constants/stockIssueOptions";
import { useStockIssue } from "../hooks/useStockIssue";
import AddIssueItemModal from "./AddIssueItemModal";
import IssueItemsTable from "./IssueItemsTable";
import GrnBreakdownTable from "./GrnBreakdownTable";
import SuccessModal from "./SuccessModal";

export default function StockIssueEntry() {
  const {
    today,
    issueNo,
    date,
    setDate,
    currentLocation,
    department,
    setDepartment,
    requestRef,
    setRequestRef,
    comment,
    setComment,
    documentName,
    setDocumentName,
    items,
    addOrReplaceIssueItem,
    deleteIssueItem,
    saveStockIssue,
    saving,
    error,
    successMessage,
  } = useStockIssue();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDocumentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setDocumentName(file.name);
    }
  };


  return (
    <div className="mt-4 rounded-xl bg-white p-5 shadow-md">
      {/* TOP CARD HEADER */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-800">
  Stock Issue Entry
</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              const saved = await saveStockIssue();

               if (saved) {
                   setShowSuccessModal(true);
                          }
                                  }}
            disabled={saving}
            className="rounded-md bg-orange-500 px-5 py-2 text-sm font-bold text-white shadow hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <p className="text-xs font-medium text-slate-600">
            Status:{" "}
            <span className="font-bold text-blue-700">Unapproved</span>
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* HEADER FIELDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Issue No
          </label>

          <input
            value={issueNo || "New"}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Date <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="date"
              value={date || ""}
              min={today}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-teal-600"
            />

            <Calendar
              size={16}
              className="pointer-events-none absolute right-3 top-3.5 text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            From Location
          </label>

          <div className="relative">
            <input
              value={currentLocation || ""}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
            />

            <MapPin
              size={16}
              className="absolute right-3 top-3.5 text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Department <span className="text-red-500">*</span>
          </label>

          <select
            value={department || ""}
            onChange={(e) => setDepartment(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-teal-600"
          >
            <option value="">Select department</option>

            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* REQUEST REF */}
      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Request Ref
        </label>

        <input
          value={requestRef || ""}
          onChange={(e) => setRequestRef(e.target.value)}
          placeholder="Enter reference number"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-teal-600"
        />
      </div>

      {/* COMMENT */}
      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Comment
        </label>

        <textarea
          value={comment || ""}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter any comments (optional)"
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-teal-600"
        />
      </div>

      {/* DOCUMENT */}
      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Add a Document
        </label>

        {!documentName ? (
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500 hover:bg-slate-50">
            <Paperclip size={16} />
            Choose file...
            <input
              type="file"
              className="hidden"
              onChange={handleDocumentChange}
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
            <a href="#" className="text-blue-700 underline">
              {documentName}
            </a>

            <button
              type="button"
              onClick={() => setDocumentName("")}
              className="text-red-600"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ISSUE ITEMS */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-800">Issued Items</h3>

        <div className="mt-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Issue Item
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <IssueItemsTable items={items} onDelete={deleteIssueItem} />

        <GrnBreakdownTable items={items} />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <AddIssueItemModal
          onClose={() => setIsModalOpen(false)}
          onAddItem={(item) => {
            addOrReplaceIssueItem(item);
            setIsModalOpen(false);
          }}
        />
      )}

     {showSuccessModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <span className="text-3xl text-green-600">✓</span>
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        Saved Successfully
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        Stock Issue saved successfully.
      </p>

      <button
        type="button"
        onClick={() => setShowSuccessModal(false)}
        className="mt-5 w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
}