"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import {
  getOpeningStockById,
  approveOpeningStock,
  cancelOpeningStock,
} from "@/services/openingStockService";

import OpeningStockForm from "../components/OpeningStockForm";

import {
  canManageOpeningStock,
  canApproveOpeningStock,
} from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export default function OpeningStockDetailPage() {
  const { id } = useParams();

  // ============================================================
  // USER ROLE
  // ============================================================

  const [role, setRole] = useState("");
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRoleLoaded(true);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      setRole(decoded.role || "");
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    } finally {
      setRoleLoaded(true);
    }
  }, []);

  // ============================================================
  // PERMISSIONS
  // ============================================================

  const canManage = canManageOpeningStock(role);
  const canApprove = canApproveOpeningStock(role);

  // ============================================================
  // STATE
  // ============================================================

  const [openingStock, setOpeningStock] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [msg, setMsg] = useState("");

  // ============================================================
  // MESSAGE
  // ============================================================

  const showMsg = (text: string) => {
    setMsg(text);

    setTimeout(() => {
      setMsg("");
    }, 3000);
  };

  // ============================================================
  // LOAD
  // ============================================================

  const load = useCallback(async () => {
    try {
      const res = await getOpeningStockById(Number(id));

      if (!res) return;

      const mapped = {
        ...res,

        items: (res.items || []).map((it: any) => ({
          id: it.openingStockItemId,
          itemId: it.itemId,
          itemCode: it.itemCode || "",
          name: it.itemName || "N/A",
          qty: Number(it.quantity) || 0,
          price: Number(it.unitPrice) || 0,
        })),
      };

      setOpeningStock(mapped);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  // ============================================================
  // APPROVE
  // ============================================================

  const handleApprove = async () => {
    if (!openingStock) return;

    if (!canApprove) {
      showMsg(
        "You are not authorized to approve Opening Stock."
      );
      return;
    }

    try {
      await approveOpeningStock(
        openingStock.openingStockId
      );

      showMsg(
        "Opening Stock approved successfully"
      );

      load();
    } catch (err) {
      console.error(err);

      showMsg(
        "Failed to approve Opening Stock"
      );
    }
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = async () => {
    if (!openingStock) return;

    if (!canApprove) {
      showMsg(
        "You are not authorized to cancel Opening Stock."
      );
      return;
    }

    if (!cancelReason.trim()) {
      showMsg("Please enter cancel reason");
      return;
    }

    try {
      await cancelOpeningStock(
        openingStock.openingStockId,
        cancelReason
      );

      showMsg(
        "Opening Stock cancelled successfully"
      );

      setCancelReason("");

      load();
    } catch (err) {
      console.error(err);

      showMsg("Cancel Failed");
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (!openingStock) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-xl shadow p-6 text-gray-500">
            Loading...
          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // STATUS
  // ============================================================

  const isEditable =
    openingStock.status === "UNAPPROVED";

  // Only users allowed to edit AND an unapproved record
  // can actually edit the form.
  const canEditForm =
    roleLoaded &&
    canManage &&
    isEditable;

  // Only users allowed to approve/cancel AND unapproved
  // records get the approval action area.
  const canPerformApprovalActions =
    roleLoaded &&
    canApprove &&
    isEditable;

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ===================================================== */}
        {/* PAGE HEADER                                           */}
        {/* ===================================================== */}

        <div className="bg-white rounded-xl shadow border overflow-hidden">

          <div className="px-6 py-5 border-b">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              {/* TITLE */}

              <div>

                <p className="text-sm text-gray-500 mb-1">
                  Inventory Management
                </p>

                <h1
                  className="text-2xl font-bold"
                  style={{ color: "#953002" }}
                >
                  Opening Stock
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Entry No:{" "}
                  <span className="font-semibold text-gray-700">
                    {openingStock.entryNo || "-"}
                  </span>
                </p>

              </div>

              {/* STATUS */}

              <div>

                <span
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{
                    backgroundColor:
                      openingStock.status === "APPROVED"
                        ? "green"
                        : openingStock.status === "CANCELLED"
                          ? "red"
                          : "#953002",
                  }}
                >
                  {openingStock.status}
                </span>

              </div>

            </div>

          </div>

          {/* ===================================================== */}
          {/* READ ONLY INDICATOR                                   */}
          {/* ===================================================== */}

          {roleLoaded &&
            !canManage &&
            !canApprove && (
              <div className="px-6 py-4 bg-gray-50 border-b">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-500
                    shadow-sm
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-gray-400" />

                  View Only
                </div>

              </div>
            )}

          {/* ===================================================== */}
          {/* ACTION AREA                                           */}
          {/* ===================================================== */}

          {canPerformApprovalActions && (
            <div className="px-6 py-4 bg-gray-50 border-b">

              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

                {/* ACTION DESCRIPTION */}

                <div>

                  <h2 className="font-semibold text-gray-800">
                    Record Actions
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Review the opening stock before approving or
                    cancelling this record.
                  </p>

                </div>

                {/* ACTION CONTROLS */}

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                  {/* CANCEL REASON */}

                  <div className="flex-1 sm:w-72">

                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Cancellation Reason
                    </label>

                    <input
                      placeholder="Enter cancel reason..."
                      value={cancelReason}
                      onChange={(e) =>
                        setCancelReason(e.target.value)
                      }
                      className="border border-gray-300 px-4 py-2.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                    />

                  </div>

                  {/* CANCEL */}

                  <button
                    onClick={handleCancel}
                    className="bg-red-900 hover:bg-red-800 text-white px-6 py-2.5 rounded-xl font-semibold shadow transition sm:self-end"
                  >
                    Cancel OS
                  </button>

                  {/* APPROVE */}

                  <button
                    onClick={handleApprove}
                    className="bg-green-900 hover:bg-green-800 text-white px-6 py-2.5 rounded-xl font-semibold shadow transition sm:self-end"
                  >
                    Approve OS
                  </button>

                </div>

              </div>

            </div>
          )}

          {/* ===================================================== */}
          {/* UNAPPROVED BUT NOT APPROVER                           */}
          {/* ===================================================== */}

          {roleLoaded &&
            isEditable &&
            canManage &&
            !canApprove && (
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">

                <p className="text-sm text-blue-700 font-medium">
                  You can edit this Opening Stock record.
                  Approval and cancellation require an authorized
                  approving authority.
                </p>

              </div>
            )}

          {/* ===================================================== */}
          {/* APPROVER BUT NOT EDITOR                               */}
          {/* ===================================================== */}

          {roleLoaded &&
            isEditable &&
            canApprove &&
            !canManage && (
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">

                <p className="text-sm text-amber-700 font-medium">
                  You can approve or cancel this record.
                  Editing Opening Stock details is restricted.
                </p>

              </div>
            )}

          {/* ===================================================== */}
          {/* MESSAGE                                               */}
          {/* ===================================================== */}

          {msg && (
            <div className="px-6 pt-4">

              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">

                <div className="flex items-center gap-2">

                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: "#953002",
                    }}
                  />

                  <p className="text-sm font-semibold text-gray-800">
                    {msg}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ===================================================== */}
          {/* OPENING STOCK FORM                                    */}
          {/* ===================================================== */}

          <div className="p-4 md:p-6">

            <OpeningStockForm
              initialData={openingStock}
              isEdit={true}
              canEdit={canEditForm}
            />

          </div>

        </div>

      </div>

    </div>
  );
}