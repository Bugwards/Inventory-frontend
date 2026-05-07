"use client";

import { useEffect, useState } from "react";
import useStockReceipt from "../hooks/useStockReceipt";
import StockReceiptItemTable from "./StockReceiptItemTable";
import SearchTransferModal from "./SearchTransferModal";
import CancelReceiptModal from "./CancelReceiptModal";
import { locationOptions } from "../constants/stockReceiptOptions";
import {
  Location,
  ReceiptStatus,
  StockReceiptListResponse,
} from "@/types/stockReceipt";
import {
  approveStockReceipt,
  cancelStockReceipt,
 
  getSelectedStockReceipt,
} from "../services/api";

type Props = {
  openedReceipt?: StockReceiptListResponse | null;
  goToList?: () => void;
  clearOpenedReceipt?: () => void;
};

export default function StockReceiptEntry({
  openedReceipt,
  goToList,
  clearOpenedReceipt,
}: Props) {
  const {
    items,
    locked,
    setLocked,
    populateItems,
    loadItemsFromBackend,
    updateItem,
    save,
    updateReceipt,
    clearItems,
  } = useStockReceipt();

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [status, setStatus] = useState<ReceiptStatus>("UNAPPROVED");
  const [cancelReason, setCancelReason] = useState("");

  const [form, setForm] = useState({
    receiptNo: "New",
    date: new Date().toISOString().split("T")[0],
    fromLocation: "HEAD_OFFICE" as Location,
    receiptLocation: "" as Location,
    transferNo: "",
    comment: "",
  });

  const isEditMode = Boolean(openedReceipt);
  const isUnapproved = status === "UNAPPROVED";
  const readonly = isEditMode && !isUnapproved;

  useEffect(() => {
    if (!openedReceipt) {
        clearItems();
        setLocked(false);
        setStatus("UNAPPROVED");
        setCancelReason("");

        setForm({
          receiptNo: "New",
          date: new Date().toISOString().split("T")[0],
          fromLocation: "HEAD_OFFICE",
          receiptLocation: "GALLE",
          transferNo: "",
          comment: "",
        });
      }
    }, [openedReceipt]);

  useEffect(() => {
    const loadOpenedReceipt = async () => {
      if (!openedReceipt) return;

      try {
        const res = await getSelectedStockReceipt(openedReceipt.receiptNo);
        const data = res.data;

      setForm({
          receiptNo: openedReceipt.receiptNo || "",
          date: data.date || "",
          fromLocation: (data.fromLocation || "ANURADHAPURA") as Location,
          receiptLocation: (data.receiptLocation ||
            openedReceipt.receiptLocation ||
            "GALLE") as Location,
          transferNo: data.transferNo || "",
          comment: data.comment || "",
        });

        setStatus(openedReceipt.status);
        loadItemsFromBackend(data.stockReceiptItems || []);
        setLocked(true);
      } catch (error) {
        console.error(error);
        alert("Failed to open stock receipt record");
      }
    };

    loadOpenedReceipt();
  }, [openedReceipt]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    if (readonly) return;

    if (!form.fromLocation) {
      alert("Please select From Location");
      return;
    }

    if (!form.receiptLocation) {
      alert("Receipt Location not loaded yet");
      return;
    }

    setShowSearchModal(true);
  };

  const handlePopulate = async () => {
    if (readonly) return;

    if (!form.receiptLocation) {
      alert("Receipt Location not loaded yet");
      return;
    }

    if (!form.transferNo.trim()) {
      alert("Please enter or select Transfer No");
      return;
    }

    try {
      await populateItems(form.transferNo.trim());
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        alert("You have no authority to do this action");
      } else {
        alert("Failed to populate items");
      }
    }
  };

  const validateForm = () => {
    if (!form.date) {
      alert("Date is required");
      return false;
    }

    if (!form.fromLocation) {
      alert("From Location is required");
      return false;
    }

    if (!form.receiptLocation) {
      alert("Receipt Location not loaded yet");
      return false;
    }

    if (!form.transferNo.trim()) {
      alert("Transfer No is required");
      return false;
    }

    if (items.length === 0) {
      alert("Please populate items before saving");
      return false;
    }

    return true;
  };

  const buildPayload = () => ({
    date: form.date,
    fromLocation: form.fromLocation,
    reciptLocation: form.receiptLocation,
    transferNo: form.transferNo.trim(),
    comment: form.comment,
    stockReceiptItems: items,
  });

  const handleSave = async () => {
    if (readonly) {
      alert("Approved or cancelled receipts cannot be edited");
      return;
    }

    if (!validateForm()) return;

    try {
      if (isEditMode && openedReceipt) {
        await updateReceipt(openedReceipt.receiptNo, buildPayload());
        alert("Stock Receipt updated successfully");
      } else {
        await save(buildPayload());
        alert("Stock Receipt saved successfully");
      }

      goToList?.();
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        alert("You have no authority to do this action");
      } else {
        alert("Failed to save stock receipt");
      }
    }
  };

  const handleApprove = async () => {
    if (!openedReceipt) return;

    const confirmed = confirm(
      "Do you want to approve the Stock Receipt? Please note that the Receipt cannot be modified after the approval"
    );

    if (!confirmed) return;

    try {
      await approveStockReceipt(openedReceipt.receiptNo);
      setStatus("APPROVED");
      alert("Stock Receipt approved successfully");
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        alert("You have no authority to do this action");
      } else {
        alert("Failed to approve stock receipt");
      }
    }
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!openedReceipt) return;

    try {
      await cancelStockReceipt(openedReceipt.receiptNo);
      setCancelReason(reason);
      setStatus("CANCELLED");
      setShowCancelModal(false);
      alert("Stock Receipt cancelled successfully");
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        alert("You have no authority to do this action");
      } else {
        alert("Failed to cancel stock receipt");
      }
    }
  };

  return (
    <div className="rounded-xl bg-white p-7 shadow">
      <div className="mb-8 flex items-start justify-between">
        <h2 className="text-xl font-bold text-slate-900">Stock Receipt</h2>

        <div className="flex items-center gap-3">
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

          <div className="flex flex-col">
            {!readonly && (
             <button
               onClick={handleSave}
               className="rounded bg-[#FFB401] px-3 py-2 text-white">
                 Save
            </button>
            )}
       
          <p>
           <span
             className={`font-semibold ${
               status === "APPROVED"? "text-green-600"
                : status === "CANCELLED" ? "text-red-600"
                : "text-blue-600"
             }`}>
               Status: {status}
           </span>
          </p>
          </div>
        </div>
      </div>

      {cancelReason && (
        <p className="mb-4 text-sm font-semibold text-red-700">
          Cancelled due to {cancelReason}
        </p>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Receipt No</label>
          <input value={form.receiptNo} disabled className="w-full rounded-xl border bg-slate-100 px-4 py-3" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            disabled={readonly}
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">From Location</label>
          <select
            name="fromLocation"
            value={form.fromLocation}
            onChange={handleChange}
            disabled={readonly || locked}
            className="w-full rounded-xl border px-4 py-3"
          >
            {locationOptions
              .filter((location) => location !== form.receiptLocation)
              .map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">Receipt Location</label>
          <select
            name="receiptLocation"
            value={form.receiptLocation}
            onChange={handleChange}
            disabled={readonly || locked}
            className="w-full rounded-xl border px-4 py-3"
          >
            {locationOptions
              .filter((location) => location !== form.fromLocation)
              .map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
          ))}
         </select>
     </div>

        <div className="col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-600">Transfer No</label>

          <div className="flex gap-2">
            <input
              name="transferNo"
              value={form.transferNo}
              onChange={handleChange}
              disabled={readonly || locked || isEditMode}
              placeholder="Enter transfer number"
              className="w-full rounded-xl border px-4 py-3"
            />

            {!isEditMode && (
              <button
                onClick={handleSearch}
                disabled={readonly || locked || !form.receiptLocation}
                className="rounded bg-gray-600 px-5 text-white disabled:opacity-50"
              >
                Search
              </button>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-600">Comment</label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            disabled={readonly}
            placeholder="Enter any comments"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>
      </div>
 
      <div className="mt-2 border-t pt-4">

        {!isEditMode && (
          <button
            onClick={handlePopulate}
            disabled={readonly || locked || !form.receiptLocation}
            className="mb-4 rounded bg-blue-600  hover:bg-blue-800 px-4 py-2 text-white disabled:opacity-50"
          >
            Populate Items
          </button>
        )}

        <StockReceiptItemTable
          items={items}
          updateItem={updateItem}
          readonly={readonly}
        />
      </div>

      {showSearchModal && (
        <SearchTransferModal
          fromLocation={form.fromLocation}
          receiptLocation={form.receiptLocation}
          onClose={() => setShowSearchModal(false)}
          onSelect={(transferNo) => {
            setForm({
              ...form,
              transferNo,
            });
            setShowSearchModal(false);
          }}
        />
      )}

      {showCancelModal && (
        <CancelReceiptModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
}