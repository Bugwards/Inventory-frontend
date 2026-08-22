"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import {
  getGRNById,
  approveGRN,
  cancelGRN,
} from "@/services/grnService";

import GRNForm from "../components/GRNForm";

import {
  canApproveGRN,
  canCancelGRN,
} from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export default function GRNDetailPage() {
  const { id } = useParams();

  const primary = "#953002";
  const accent = "#FFB401";

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

  const canApprove = canApproveGRN(role);
  const canCancel = canCancelGRN(role);

  // ============================================================
  // GRN
  // ============================================================

  const [grn, setGrn] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");

  // ================= MESSAGE =================
  const [msg, setMsg] = useState("");

  const showMsg = (text: string) => {
    setMsg(text);

    setTimeout(() => {
      setMsg("");
    }, 3000);
  };

  // ================= LOAD =================
  const load = useCallback(async () => {

    const res = await getGRNById(Number(id));

    if (!res) return;

    const mapped = {
      ...res,

      items: (res.items || []).map((it: any) => ({
        id: it.grnItemId,
        itemId: it.itemId,
        itemCode: it.itemCode || "",
        name: it.itemName || "N/A",
        qty: it.quantity,
        price: it.unitPrice || 0,
      })),
    };

    setGrn(mapped);

  }, [id]);

  useEffect(() => {

    if (id) {
      load();
    }

  }, [id, load]);

  // ============================================================
  // APPROVE
  // ============================================================

  const handleApprove = async () => {

    if (!canApprove) {
      showMsg(
        "You are not authorized to approve GRNs."
      );

      return;
    }

    if (grn.status !== "UNAPPROVED") {
      showMsg(
        "Only unapproved GRNs can be approved."
      );

      return;
    }

    try {

      await approveGRN(grn.grnId);

      showMsg(
        "GRN approved successfully"
      );

      load();

    } catch (err) {

      console.error(err);

      showMsg(
        "Failed to approve GRN"
      );

    }
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = async () => {

    if (!canCancel) {
      showMsg(
        "You are not authorized to cancel GRNs."
      );

      return;
    }

    if (grn.status !== "UNAPPROVED") {
      showMsg(
        "Only unapproved GRNs can be cancelled."
      );

      return;
    }

    if (!cancelReason.trim()) {
      showMsg(
        "Please enter cancel reason"
      );

      return;
    }

    try {

      await cancelGRN(
        grn.grnId,
        cancelReason
      );

      showMsg(
        "GRN cancelled successfully"
      );

      setCancelReason("");

      load();

    } catch (err) {

      console.error(err);

      showMsg(
        "Failed to cancel GRN"
      );

    }
  };

  // ================= LOADING =================
  if (!grn) {

    return (
      <div className="min-h-[300px] flex items-center justify-center">

        <div className="text-center">

          <div
            className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin mx-auto mb-3"
            style={{
              borderTopColor: primary,
            }}
          />

          <p className="text-sm text-gray-500">
            Loading GRN details...
          </p>

        </div>

      </div>
    );

  }

  const isEditable =
    grn.status === "UNAPPROVED";

  const canShowActionCard =
    roleLoaded &&
    isEditable &&
    (canApprove || canCancel);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ================= PAGE HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>

            <p className="text-sm text-gray-500 font-medium mb-1">
              Goods Received Note
            </p>

            <div className="flex flex-wrap items-center gap-3">

              <h1
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: primary }}
              >
                {grn.grnNumber}
              </h1>

              {/* STATUS BADGE */}
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{
                  backgroundColor:
                    grn.status === "APPROVED"
                      ? "green"
                      : grn.status === "CANCELLED"
                        ? "red"
                        : primary,
                }}
              >
                {grn.status}
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-1">
              View and manage GRN details
            </p>

          </div>

        </div>


        {/* ====================================================== */}
        {/* VIEW ONLY INDICATOR                                    */}
        {/* ====================================================== */}

        {roleLoaded &&
          isEditable &&
          !canApprove &&
          !canCancel && (

            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                text-sm
                font-medium
                text-gray-500
                shadow-sm
              "
            >

              <span className="h-2 w-2 rounded-full bg-gray-400" />

              You have view-only access to GRN actions.

            </div>

          )}


        {/* ================= ACTION CARD ================= */}

        {canShowActionCard && (

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* ACTION HEADER */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">

              <h2 className="font-semibold text-gray-800">
                GRN Actions
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Review the GRN before approving or cancelling it
              </p>

            </div>


            {/* ACTION BODY */}
            <div className="p-5">

              <div className="flex flex-col lg:flex-row lg:items-end gap-4">

                {/* CANCEL REASON */}

                {canCancel && (
                  <div className="flex-1">

                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Cancellation Reason
                    </label>

                    <input
                      type="text"
                      placeholder="Enter reason if you want to cancel this GRN..."
                      value={cancelReason}
                      onChange={(e) =>
                        setCancelReason(e.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
                    />

                  </div>
                )}


                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3">

                  {/* CANCEL */}

                  {canCancel && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 rounded-lg bg-red-900 hover:bg-red-800 text-white font-semibold shadow-sm transition"
                    >
                      Cancel GRN
                    </button>
                  )}


                  {/* APPROVE */}

                  {canApprove && (
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="px-6 py-2.5 rounded-lg bg-green-900 hover:bg-green-800 text-white font-semibold shadow-sm transition"
                    >
                      Approve GRN
                    </button>
                  )}

                </div>

              </div>


              {/* MESSAGE */}

              {msg && (
                <div
                  className={`mt-4 px-4 py-3 rounded-lg text-sm font-semibold ${msg.toLowerCase().includes("success")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                  {msg}
                </div>
              )}

            </div>

          </div>

        )}


        {/* ================= LOCKED STATUS ================= */}

        {!isEditable && (

          <div
            className={`rounded-xl border px-5 py-4 ${grn.status === "APPROVED"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
              }`}
          >

            <div className="flex items-center gap-3">

              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${grn.status === "APPROVED"
                    ? "bg-green-100"
                    : "bg-red-100"
                  }`}
              >

                <span
                  className={`font-bold ${grn.status === "APPROVED"
                      ? "text-green-700"
                      : "text-red-700"
                    }`}
                >
                  {grn.status === "APPROVED"
                    ? "✓"
                    : "!"}
                </span>

              </div>

              <div>

                <p
                  className={`font-semibold ${grn.status === "APPROVED"
                      ? "text-green-800"
                      : "text-red-800"
                    }`}
                >
                  GRN {grn.status}
                </p>

                <p
                  className={`text-sm ${grn.status === "APPROVED"
                      ? "text-green-700"
                      : "text-red-700"
                    }`}
                >
                  This GRN is locked and can no longer be modified.
                </p>

              </div>

            </div>

          </div>

        )}


        {/* ================= GRN FORM ================= */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          <div
            className="px-5 py-4 border-b border-gray-200"
            style={{
              borderTop: `4px solid ${primary}`,
            }}
          >

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <div>

                <h2
                  className="text-lg font-bold"
                  style={{ color: primary }}
                >
                  GRN Details
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Goods received note information and item details
                </p>

              </div>

              <span className="text-xs text-gray-400">
                GRN ID: {grn.grnId}
              </span>

            </div>

          </div>


          <div className="p-1">

            <GRNForm
              initialData={grn}
              isEdit={true}
            />

          </div>

        </div>

      </div>

    </div>
  );
}