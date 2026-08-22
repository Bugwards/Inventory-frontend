"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import StockPickerModal from "./StockPickerModal";
import { saveAdjustment } from "@/services/stockAdjustmentService";
import { canManageStockAdjustment } from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export default function StockAdjustmentForm() {
  const router = useRouter();

  const primary = "#953002";
  const accent = "#FFB401";

  const today =
    new Date().toISOString().split("T")[0];

  // ============================================================
  // ROLE
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
      const decoded =
        jwtDecode<JwtPayload>(token);

      setRole(decoded.role || "");
    } catch (error) {
      console.error(
        "Failed to decode JWT:",
        error
      );
    } finally {
      setRoleLoaded(true);
    }
  }, []);

  const canManageAdjustment =
    canManageStockAdjustment(role);

  // ============================================================
  // MESSAGE
  // ============================================================

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] =
    useState<"success" | "error">("success");

  const showMsg = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMsg(text);
    setMsgType(type);

    setTimeout(() => {
      setMsg("");
    }, 3000);
  };

  // ============================================================
  // FORM
  // ============================================================

  const [form, setForm] = useState({
    adjustmentDate: "",
    stockLocation: "",
    reason: "",
    comment: "",
  });

  const [items, setItems] =
    useState<any[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  // ============================================================
  // ADD ITEM
  // ============================================================

  const handleSelectStock = (stock: any) => {
    if (!canManageAdjustment) {
      showMsg(
        "You are not authorized to perform this action.",
        "error"
      );
      return;
    }

    const exists = items.find(
      (i) => i.stockId === stock.stockId
    );

    if (exists) {
      showMsg(
        "Item already added",
        "error"
      );
      return;
    }

    setItems([
      ...items,
      {
        stockId: stock.stockId,
        itemName: stock.itemName,
        grnNo: stock.grnNo,
        currentQty: stock.currentQty,
        adjustmentQty: 0,
      },
    ]);

    setShowModal(false);
  };

  // ============================================================
  // UPDATE QTY
  // ============================================================

  const updateQty = (
    index: number,
    value: number
  ) => {
    if (!canManageAdjustment) return;

    const copy = [...items];

    copy[index].adjustmentQty = value;

    setItems(copy);
  };

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const removeItem = (index: number) => {
    if (!canManageAdjustment) return;

    if (confirm("Remove item?")) {
      const copy = [...items];

      copy.splice(index, 1);

      setItems(copy);
    }
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    if (!form.adjustmentDate) {
      return "Date required";
    }

    if (!form.stockLocation) {
      return "Location required";
    }

    if (!form.reason) {
      return "Reason required";
    }

    if (!items.length) {
      return "Add at least one item";
    }

    for (const item of items) {

      if (item.adjustmentQty === 0) {
        return "Qty cannot be 0";
      }

      if (
        item.adjustmentQty < 0 &&
        Math.abs(item.adjustmentQty) >
        item.currentQty
      ) {
        return `Not enough stock for ${item.itemName}`;
      }
    }

    return null;
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async () => {

    if (!canManageAdjustment) {
      showMsg(
        "You are not authorized to perform this action.",
        "error"
      );
      return;
    }

    const error = validate();

    if (error) {
      showMsg(error, "error");
      return;
    }

    try {

      const payload = {
        adjustmentDate:
          form.adjustmentDate,

        location:
          form.stockLocation,

        reason:
          form.reason,

        comment:
          form.comment,

        items: items.map((i) => ({
          stockId: i.stockId,
          quantity: i.adjustmentQty,
        })),
      };

      await saveAdjustment(payload);

      showMsg(
        "Saved Successfully",
        "success"
      );

      router.push("/stock-adjustment");

    } catch (err) {

      console.error(err);

      showMsg(
        "Error Saving",
        "error"
      );
    }
  };

  // ============================================================
  // PERMISSION LOADING
  // ============================================================

  if (!roleLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white px-6 py-4 rounded-xl shadow">

          <p className="text-sm font-medium text-gray-600">
            Checking permissions...
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // UNAUTHORIZED
  // ============================================================

  if (!canManageAdjustment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md w-full text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

            <span className="text-2xl">
              🔒
            </span>

          </div>

          <h1 className="text-xl font-bold text-gray-800">
            Access Restricted
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            You are not authorized to create
            a Stock Adjustment.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/stock-adjustment"
              )
            }
            className="
              mt-6
              w-full
              rounded-xl
              bg-[#953002]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow
              transition
              hover:bg-[#7a2401]
            "
          >
            Back to Stock Adjustment
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // FORM
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">

      <div className="max-w-6xl mx-auto space-y-4">

        {/* BACK */}
        <div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/stock-adjustment"
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1.5
              rounded-lg
              text-md
              font-bold
              text-gray-700
              hover:text-[#953002]
              hover:bg-gray-200/60
              transition
              cursor-pointer
            "
          >
            <ArrowLeft className="w-4 h-4" />

            <span>
              Back
            </span>

          </button>

        </div>

        {/* MESSAGE */}

        {msg && (
          <div
            className={`p-3 rounded ${msgType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {msg}
          </div>
        )}

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <h1
            className="text-2xl font-bold"
            style={{
              color: primary,
            }}
          >
            Create Stock Adjustment
          </h1>

        </div>

        {/* FORM CARD */}

        <div className="bg-white p-5 rounded-xl shadow space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* DATE */}

            <div>

              <label className="font-semibold">
                Date
              </label>

              <input
                type="date"
                value={
                  form.adjustmentDate
                }
                max={today}
                onChange={(e) =>
                  setForm({
                    ...form,
                    adjustmentDate:
                      e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              />

            </div>

            {/* LOCATION */}

            <div>

              <label className="font-semibold">
                Location
              </label>

              <select
                value={
                  form.stockLocation
                }
                onChange={(e) => {

                  if (items.length > 0) {

                    const confirmChange =
                      window.confirm(
                        "Changing location will clear all added items. Continue?"
                      );

                    if (!confirmChange) {
                      return;
                    }
                  }

                  setItems([]);

                  setForm({
                    ...form,
                    stockLocation:
                      e.target.value,
                  });
                }}
                className="border p-2 w-full rounded"
              >

                <option value="">
                  Select
                </option>

                <option value="HEAD_OFFICE">
                  Head Office
                </option>

                <option value="KALUTARA">
                  Kalutara
                </option>

                <option value="KANDY">
                  Kandy
                </option>

                <option value="GALLE">
                  Galle
                </option>

                <option value="GAMPAHA">
                  Gampaha
                </option>

                <option value="ANURADHAPURA">
                  Anuradhapura
                </option>

              </select>

            </div>

            {/* REASON */}

            <div>

              <label className="font-semibold">
                Reason
              </label>

              <input
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason:
                      e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
                placeholder="Damage / Loss"
              />

            </div>

            {/* COMMENT */}

            <div>

              <label className="font-semibold">
                Comment
              </label>

              <input
                value={form.comment}
                onChange={(e) =>
                  setForm({
                    ...form,
                    comment:
                      e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
                placeholder="Optional"
              />

            </div>

          </div>

        </div>

        {/* ITEM HEADER */}

        <div className="flex justify-between items-center">

          <h2
            className="text-lg font-bold"
            style={{
              color: primary,
            }}
          >
            ITEM DETAILS
          </h2>

          <button
            type="button"
            onClick={() => {

              if (!form.stockLocation) {
                showMsg(
                  "Select location first",
                  "error"
                );
                return;
              }

              setShowModal(true);
            }}
            className="
              bg-[#953002]
              hover:bg-[#7a2401]
              text-white
              px-4
              py-2
              rounded
            "
          >
            + Add Item
          </button>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-xl shadow border overflow-hidden">

          <div
            className="p-3 text-white font-bold"
            style={{
              background:
                `linear-gradient(90deg, ${primary}, ${accent})`,
            }}
          >
            STOCK ADJUSTMENT ITEMS
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm min-w-[700px]">

              <thead className="bg-gray-100 text-gray-700">

                <tr>

                  <th className="p-3 text-left">
                    Item
                  </th>

                  <th className="p-3 text-left">
                    Reference
                  </th>

                  <th className="p-3 text-center">
                    Current
                  </th>

                  <th className="p-3 text-center">
                    Adjustment
                  </th>

                  <th className="p-3 text-center">
                    New Qty
                  </th>

                  <th className="p-3 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.length === 0 && (
                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-400"
                    >
                      No items added
                    </td>

                  </tr>
                )}

                {items.map(
                  (item, index) => {

                    const newQty =
                      item.currentQty +
                      item.adjustmentQty;

                    return (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="p-3">
                          {item.itemName}
                        </td>

                        <td
                          className="
                            p-3
                            text-[#953002]
                            font-medium
                          "
                        >
                          {item.grnNo}
                        </td>

                        <td className="p-3 text-center">
                          {item.currentQty}
                        </td>

                        <td className="p-3 text-center">

                          <input
                            type="number"
                            value={
                              item.adjustmentQty
                            }
                            onChange={(e) =>
                              updateQty(
                                index,
                                Number(
                                  e.target.value
                                )
                              )
                            }
                            className="
                              border
                              p-1
                              w-20
                              rounded
                              text-center
                            "
                          />

                        </td>

                        <td className="p-3 text-center font-semibold">
                          {newQty}
                        </td>

                        <td className="p-3 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            className="
                              text-red-600
                              font-semibold
                            "
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* SAVE */}

        <div className="flex justify-end">

          <button
            type="button"
            onClick={handleSave}
            className="
              bg-[#953002]
              hover:bg-[#7a2401]
              text-white
              px-6
              py-2
              rounded
              font-semibold
            "
          >
            Save Adjustment
          </button>

        </div>

        {/* MODAL */}

        {showModal && (
          <StockPickerModal
            location={
              form.stockLocation
            }
            onSelect={
              handleSelectStock
            }
            onClose={() =>
              setShowModal(false)
            }
          />
        )}

      </div>

    </div>
  );
}