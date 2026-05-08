"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Edit, Plus, Save, XCircle } from "lucide-react";

import {
  IssueItem,
  StockIssueDetailResponse,
  StockIssueRequest,
} from "@/types/stockIssue";

import {
  getSelectedIssueRecord,
  updateStockIssueRecord,
  approveStockIssue,
  cancelStockIssue,
  saveCancelReason,
} from "../services/api";

import AddIssueItemModal from "./AddIssueItemModal";

interface Props {
  issueNo: string;
}

export default function StockIssueDetailPage({ issueNo }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<StockIssueDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cancelReason, setCancelReason] = useState("");
  const [showCancelBox, setShowCancelBox] = useState(false);

  const [messageModal, setMessageModal] = useState<{
  show: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "warning";
}>({
  show: false,
  title: "",
  message: "",
  type: "warning",
});

const showMessage = (
  title: string,
  message: string,
  type: "success" | "error" | "warning" = "warning"
) => {
  setMessageModal({
    show: true,
    title,
    message,
    type,
  });
};

const [confirmModal, setConfirmModal] = useState<{
  show: boolean;
  title: string;
  message: string;
  action: "APPROVE" | "CANCEL" | "UPDATE" | null;
}>({
  show: false,
  title: "",
  message: "",
  action: null,
});

  useEffect(() => {
    loadIssue();
  }, [issueNo]);

  const groupItemsByItemCode = (
    items: StockIssueRequest["items"]
  ): StockIssueRequest["items"] => {
    const map = new Map<string, StockIssueRequest["items"][number]>();

    items.forEach((item) => {
      const existing = map.get(item.itemCode);

      if (!existing) {
        map.set(item.itemCode, {
          ...item,
          grnItems: [...(item.grnItems || [])],
        });
      } else {
        existing.grnItems = [
          ...(existing.grnItems || []),
          ...(item.grnItems || []),
        ];

        existing.totalIssuedQuantity = existing.grnItems.reduce(
          (total, grn) => total + Number(grn.issuedQuantity || 0),
          0
        );
      }
    });

    return Array.from(map.values()).map((item) => ({
      ...item,
      totalIssuedQuantity: (item.grnItems || []).reduce(
        (total, grn) => total + Number(grn.issuedQuantity || 0),
        0
      ),
    }));
  };

  const loadIssue = async () => {
    try {
      setLoading(true);

      const data = await getSelectedIssueRecord(issueNo);

      const groupedData: StockIssueDetailResponse = {
        ...data,
        items: groupItemsByItemCode(data.items || []),
      };

      setForm(groupedData);
      setSelectedItemIndex(0);
      setEditingItemIndex(null);
    } catch (error) {
      console.error(error);
      alert("Failed to load stock issue details");
    } finally {
      setLoading(false);
    }
  };

  const isLocked =
    form?.status === "APPROVED" || form?.status === "CANCELLED";

  const selectedItem = form?.items?.[selectedItemIndex];

  const statusText = form?.status || "UNAPPROVED";

  const handleHeaderChange = (
    field: keyof StockIssueRequest,
    value: string
  ) => {
    if (!form || isLocked) return;

    setForm({
      ...form,
      [field]: value,
    });
  };

  const recalculateItemTotal = (
    item: StockIssueRequest["items"][number]
  ) => {
    return (item.grnItems || []).reduce(
      (total, grn) => total + Number(grn.issuedQuantity || 0),
      0
    );
  };

  const handleGrnChange = (
    itemIndex: number,
    grnIndex: number,
    field: string,
    value: string | number
  ) => {
    if (!form || isLocked) return;

    const updatedItems = [...form.items];
    const selected = updatedItems[itemIndex];

    const updatedGrnItems = [...selected.grnItems];

    updatedGrnItems[grnIndex] = {
      ...updatedGrnItems[grnIndex],
      [field]: value,
    };

    updatedItems[itemIndex] = {
      ...selected,
      grnItems: updatedGrnItems,
      totalIssuedQuantity: updatedGrnItems.reduce(
        (total, grn) => total + Number(grn.issuedQuantity || 0),
        0
      ),
    };

    setForm({
      ...form,
      items: updatedItems,
    });
  };

  const addOrReplaceIssueItem = (newItem: IssueItem) => {
    if (!form || isLocked) return;

    const normalizedItem = {
      itemCode: newItem.itemCode,
      itemGroupName: newItem.itemGroupName,
      itemName: newItem.itemName,
      description: newItem.description,
      unitOfMesuremnet: newItem.unitOfMeasurement,
      totalIssuedQuantity: newItem.grnItems.reduce(
        (total, grn) => total + Number(grn.issuedQuantity || 0),
        0
      ),
      grnItems: newItem.grnItems.map((grn) => ({
        grnNumber: grn.grnNumber,
        grnDate: grn.grnDate,
        currentQuantity: grn.currentQty,
        issuedQuantity: grn.issuedQuantity,
      })),
    };

    const existingIndex = form.items.findIndex(
      (item) => item.itemCode === newItem.itemCode
    );

    let updatedItems = [...form.items];

    if (existingIndex >= 0) {
      updatedItems[existingIndex] = normalizedItem;
      setSelectedItemIndex(existingIndex);
    } else {
      updatedItems = [...updatedItems, normalizedItem];
      setSelectedItemIndex(updatedItems.length - 1);
    }

    setForm({
      ...form,
      items: updatedItems,
    });

    setEditingItemIndex(null);
  };

  const handleUpdate = async () => {
  if (!form || isLocked) return;

  try {
    setSaving(true);

    await updateStockIssueRecord(issueNo, form);

    showMessage(
      "Updated Successfully",
      "Stock issue updated successfully.",
      "success"
    );

    await loadIssue();
  } catch (error: any) {
    console.error(error);

    if (error?.response?.status === 403) {
      showMessage(
        "Not Authorized",
        "You are not authorized to update this stock issue.",
        "error"
      );
      return;
    }

    showMessage(
      "Update Failed",
      "Failed to update stock issue.",
      "error"
    );
  } finally {
    setSaving(false);
  }
};

  const handleApprove = async () => {
  if (isLocked) return;

  try {
    await approveStockIssue(issueNo);

    showMessage(
      "Approved Successfully",
      "Stock issue approved successfully.",
      "success"
    );

    setTimeout(() => {
      router.push("/stock-issue");
    }, 1000);
  } catch (error: any) {
    console.error(error);

    if (error?.response?.status === 403) {
      showMessage(
        "Not Authorized",
        "You are not authorized to approve this stock issue.",
        "error"
      );
      return;
    }

    showMessage("Approve Failed", "Failed to approve stock issue.", "error");
  }
};
  
  
const handleCancel = async () => {
  if (isLocked) return;

  if (!cancelReason.trim()) {
    showMessage(
      "Cancel Reason Required",
      "Please enter cancel reason.",
      "warning"
    );
    return;
  }

  try {
    await saveCancelReason(issueNo, cancelReason);
    await cancelStockIssue(issueNo);

    showMessage(
      "Cancelled Successfully",
      "Stock issue cancelled successfully.",
      "success"
    );

    setTimeout(() => {
      router.push("/stock-issue");
    }, 1000);
  } catch (error: any) {
    console.error(error);

    if (error?.response?.status === 403) {
      showMessage(
        "Not Authorized",
        "You are not authorized to cancel this stock issue.",
        "error"
      );
      return;
    }

    showMessage("Cancel Failed", "Failed to cancel stock issue.", "error");
  }
};

  const actionButtonDisabledClass =
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-current";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
          Loading stock issue details...
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="rounded-2xl bg-white p-6 text-sm text-red-600 shadow-md">
          Stock issue record not found.
        </div>
      </div>
    );
  }

  const handleConfirmYes = async () => {
  const action = confirmModal.action;

  setConfirmModal({
    show: false,
    title: "",
    message: "",
    action: null,
  });

  if (action === "UPDATE") {
    await handleUpdate();
  }

  if (action === "APPROVE") {
    await handleApprove();
  }

  if (action === "CANCEL") {
    await handleCancel();
  }
};

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 pt-4 md:px-6">
        <h1 className="text-2xl font-bold leading-none text-slate-800">
          Stock Issue Details
        </h1>

        <p className="mt-1 text-sm text-slate-500">
        <b> View, update, approve or cancel selected stock issue</b>
        </p>
      </div>

      <div className="px-4 pb-6 md:px-6">
        <div className="mt-4 rounded-xl bg-white p-5 shadow-md">
          {/* TOP BAR */}
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Stock Issue
              </h2>

              <p className="mt-1 text-xs font-medium text-slate-600">
                Status:{" "}
                <span
                  className={`font-bold ${
                    statusText === "APPROVED"
                      ? "text-green-600"
                      : statusText === "CANCELLED"
                      ? "text-red-600"
                      : "text-blue-700"
                  }`}
                >
                  {statusText}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <ArrowLeft size={15} />
                Back
              </button>

              <button
                type="button"
                onClick={() =>
                 setConfirmModal({
                   show: true,
                   title: "Update Stock Issue",
                   message: "Are you sure you want to update this stock issue?",
                   action: "UPDATE",
                                 })
                                }
                disabled={saving || isLocked}
                className={`inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-orange-600 ${actionButtonDisabledClass}`}
              >
                <Save size={15} />
                {saving ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                onClick={() =>
                    setConfirmModal({
                              show: true,
                              title: "Approve Stock Issue",
                              message: "Are you sure you want to approve this stock issue?",
                              action: "APPROVE",
                                    })
                                    }
                              disabled={isLocked}
  className={`inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-emerald-700 ${actionButtonDisabledClass}`}
       >
  <CheckCircle size={15} />
  Approve
   </button>

              <button
                type="button"
                onClick={() => setShowCancelBox(true)}
                disabled={isLocked}
                className={`inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-red-600 ${actionButtonDisabledClass}`}
              >
                <XCircle size={15} />
                Cancel
              </button>
            </div>
          </div>

          {/* HEADER FIELDS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Issue No
              </label>

              <input
                value={issueNo || ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Issue Date
              </label>

              <input
                type="date"
                value={form.date || ""}
                disabled={isLocked}
                onChange={(e) => handleHeaderChange("date", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-teal-600 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Department
              </label>

              <select
                value={form.department || ""}
                disabled={isLocked}
                onChange={(e) =>
                  handleHeaderChange("department", e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-teal-600 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="">Select department</option>
                <option value="IT_DEPT">IT Department</option>
                <option value="HR_DEPT">HR Department</option>
                <option value="FINANCE_DEPT">Finance Department</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Request Ref
              </label>

              <input
                value={form.requestRef || ""}
                disabled={isLocked}
                onChange={(e) =>
                  handleHeaderChange("requestRef", e.target.value)
                }
                placeholder="Enter request reference"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 outline-none focus:border-teal-600 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Comment
            </label>

            <textarea
              value={form.comment || ""}
              disabled={isLocked}
              onChange={(e) => handleHeaderChange("comment", e.target.value)}
              placeholder="Enter comment"
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 outline-none focus:border-teal-600 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          {/* ISSUE ITEMS */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-800">
                Issue Items
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={isLocked}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={15} />
                Add Issue Item
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-2">
              {/* ITEM GRID */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-slate-700">
                  Items selected for Issue
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[780px] border-collapse text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border border-slate-200 px-2 py-2 text-left">
                          Item Group
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-left">
                          Item Code
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-left">
                          Item Name
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-left">
                          Description
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-left">
                          Unit
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-right">
                          Issue Qty
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {form.items.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="h-24 border border-slate-200 text-center text-slate-500"
                          >
                            No items added
                          </td>
                        </tr>
                      ) : (
                        form.items.map((item, itemIndex) => {
                          const totalIssuedQty = recalculateItemTotal(item);

                          return (
                            <tr
                              key={`${item.itemCode}-${itemIndex}`}
                              onClick={() => setSelectedItemIndex(itemIndex)}
                              className={`cursor-pointer transition ${
                                selectedItemIndex === itemIndex
                                  ? "bg-blue-50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <td className="border border-slate-200 px-2 py-2 text-slate-900">
                                {item.itemGroupName || "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 font-semibold text-blue-700">
                                {item.itemCode || "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-slate-900">
                                {item.itemName || "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-slate-900">
                                {item.description || "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-slate-900">
                                { item.unitOfMesuremnet ||
                                  "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-right font-bold text-slate-900">
                                {totalIssuedQty}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-center">
                                <button
                                  type="button"
                                  disabled={isLocked}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItemIndex(itemIndex);
                                    setEditingItemIndex(itemIndex);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  <Edit size={13} />
                                  Edit
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Click an item row to view all GRN breakdown records.
                </p>
              </div>

              {/* GRN GRID */}
              <div>
                <h4 className="mb-2 text-xs font-bold text-slate-700">
                  Issue Items GRN wise breakdown
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[620px] border-collapse text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border border-slate-200 px-2 py-2 text-left">
                          GRN No
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-left">
                          GRN Date
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-right">
                          Current Qty
                        </th>
                        <th className="border border-slate-200 px-2 py-2 text-right">
                          Issue Qty
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {!selectedItem || selectedItem.grnItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="h-24 border border-slate-200 text-center text-slate-500"
                          >
                            No GRN breakdown
                          </td>
                        </tr>
                      ) : (
                        selectedItem.grnItems.map((grn, grnIndex) => {
                          const canEditThisItem =
                            editingItemIndex === selectedItemIndex && !isLocked;

                          return (
                            <tr
                              key={`${selectedItem.itemCode}-${grn.grnNumber}-${grnIndex}`}
                              className="hover:bg-slate-50"
                            >
                              <td className="border border-slate-200 px-2 py-2 font-semibold text-slate-900">
                                {grn.grnNumber || "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-slate-900">
                                {grn.grnDate || "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-right text-slate-900">
                                {grn.currentQuantity ?? grn.currentQuantity ?? "-"}
                              </td>

                              <td className="border border-slate-200 px-2 py-2 text-right">
                                <input
                                  type="number"
                                  value={grn.issuedQuantity ?? ""}
                                  disabled={!canEditThisItem}
                                  onChange={(e) =>
                                    handleGrnChange(
                                      selectedItemIndex,
                                      grnIndex,
                                      "issuedQuantity",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1 text-right text-xs font-semibold text-slate-950 outline-none focus:border-teal-600 disabled:bg-slate-100 disabled:text-slate-500"
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {selectedItem && (
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <p>
                      Showing GRN breakdown for{" "}
                      <span className="font-bold text-blue-700">
                        {selectedItem.itemCode}
                      </span>
                    </p>

                    {editingItemIndex === selectedItemIndex && !isLocked && (
                      <button
                        type="button"
                        onClick={() => setEditingItemIndex(null)}
                        className="rounded-md bg-teal-700 px-3 py-1 font-semibold text-white hover:bg-teal-800"
                      >
                        Done Editing
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CANCEL BOX */}
          {showCancelBox && !isLocked && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
              <label className="mb-2 block text-sm font-bold text-red-800">
                Cancel Reason
              </label>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 outline-none focus:border-red-500"
                placeholder="Enter reason for cancellation"
              />

              <div className="mt-3 flex flex-wrap gap-2">
               <button
  type="button"
  onClick={() => {
    if (!cancelReason.trim()) {
      showMessage(
        "Cancel Reason Required",
        "Please enter cancel reason.",
        "warning"
      );
      return;
    }

    setConfirmModal({
      show: true,
      title: "Cancel Stock Issue",
      message: "Are you sure you want to cancel this stock issue?",
      action: "CANCEL",
    });
  }}
  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow hover:bg-red-600"
>
  Confirm Cancel
</button>
                <button
                  type="button"
                  onClick={() => setShowCancelBox(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && !isLocked && (
        <AddIssueItemModal
          onClose={() => setIsModalOpen(false)}
          onAddItem={(item) => {
            addOrReplaceIssueItem(item);
            setIsModalOpen(false);
          }}
        />
      )}

      {messageModal.show && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-3xl font-bold ${
          messageModal.type === "success"
            ? "bg-green-100 text-green-600"
            : messageModal.type === "error"
            ? "bg-red-100 text-red-600"
            : "bg-yellow-100 text-yellow-600"
        }`}
      >
        {messageModal.type === "success"
          ? "✓"
          : messageModal.type === "error"
          ? "!"
          : "!"}
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        {messageModal.title}
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        {messageModal.message}
      </p>

      <button
        type="button"
        onClick={() =>
          setMessageModal({
            show: false,
            title: "",
            message: "",
            type: "warning",
          })
        }
        className="mt-5 w-full rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
      >
        OK
      </button>
    </div>
  </div>
)}  

{confirmModal.show && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-3xl font-bold text-yellow-600">
        ?
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        {confirmModal.title}
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        {confirmModal.message}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() =>
            setConfirmModal({
              show: false,
              title: "",
              message: "",
              action: null,
            })
          }
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          No
        </button>

        <button
          type="button"
          onClick={handleConfirmYes}
          className={`rounded-lg px-4 py-2 text-sm font-bold text-white ${
  confirmModal.action === "CANCEL"
    ? "bg-red-500 hover:bg-red-600"
    : confirmModal.action === "UPDATE"
    ? "bg-orange-500 hover:bg-orange-600"
    : "bg-emerald-600 hover:bg-emerald-700"
}`}
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}