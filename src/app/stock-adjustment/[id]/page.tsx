"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
} from "lucide-react";

import {
  getAdjustmentById,
} from "@/services/stockAdjustmentService";

export default function StockAdjustmentDetailPage() {

  const { id } = useParams();
  const router = useRouter();

  const [adj, setAdj] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  const primary = "#953002";
  const accent = "#FFB401";

  // ============================================================
  // LOAD
  // ============================================================

  const load = useCallback(async () => {

    try {

      setError("");

      const res =
        await getAdjustmentById(
          Number(id)
        );

      setAdj(res);

    } catch (err) {

      console.error(
        "Failed to load adjustment:",
        err
      );

      setError(
        "Failed to load Stock Adjustment."
      );
    }

  }, [id]);

  useEffect(() => {

    if (id) {
      load();
    }

  }, [id, load]);

  // ============================================================
  // LOADING
  // ============================================================

  if (!adj && !error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white px-6 py-4 rounded-xl shadow text-gray-600 font-medium">
          Loading...
        </div>

      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

        <div className="bg-white rounded-xl shadow border p-8 text-center">

          <p className="text-red-600 font-semibold">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/stock-adjustment"
              )
            }
            className="
              mt-5
              bg-[#953002]
              text-white
              px-5
              py-2
              rounded-lg
              font-semibold
            "
          >
            Back
          </button>

        </div>

      </div>
    );
  }

  const totalQty =
    adj.items?.reduce(
      (
        sum: number,
        item: any
      ) =>
        sum +
        (Number(item.quantity) || 0),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">

      <div className="max-w-6xl mx-auto space-y-5">

        {/* ================================================== */}
        {/* BACK                                               */}
        {/* ================================================== */}

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
              py-2
              rounded-lg
              text-md
              font-bold
              text-gray-700
              hover:text-[#953002]
              hover:bg-gray-200/70
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

        {/* ================================================== */}
        {/* HEADER                                             */}
        {/* ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border px-5 py-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500 font-medium mb-1">
                Inventory Management
              </p>

              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{
                  color: primary,
                }}
              >
                Stock Adjustment Details
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Review the adjustment information
                and affected items.
              </p>

            </div>

            <span
              className={`
                px-5
                py-2
                rounded-full
                text-sm
                font-semibold
                w-fit
                ${adj.status ===
                  "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : adj.status ===
                    "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              `}
            >
              {adj.status}
            </span>

          </div>

        </div>

        {/* ================================================== */}
        {/* SUMMARY                                            */}
        {/* ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div
            className="
              px-5
              py-3
              text-white
              font-bold
            "
            style={{
              background:
                `linear-gradient(90deg, ${primary}, ${accent})`,
            }}
          >
            ADJUSTMENT SUMMARY
          </div>

          <div className="p-5 md:p-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Ref No
                </p>

                <p
                  className="font-bold text-lg mt-1"
                  style={{
                    color: primary,
                  }}
                >
                  {adj.adjustmentNo}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Date
                </p>

                <p className="font-semibold mt-1 text-gray-800">
                  {adj.adjustmentDate || "-"}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Location
                </p>

                <p className="font-semibold mt-1 text-gray-800">
                  {adj.location || "-"}
                </p>

              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Total Items
                </p>

                <p className="font-bold text-lg mt-1 text-gray-800">
                  {adj.items?.length || 0}
                </p>

              </div>

              <div className="sm:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">

                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Reason
                </p>

                <p className="font-semibold mt-1 text-gray-800">
                  {adj.reason || "-"}
                </p>

              </div>

              <div className="sm:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">

                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Comment
                </p>

                <p className="font-semibold mt-1 text-gray-800">
                  {adj.comment || "-"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================== */}
        {/* ITEMS                                               */}
        {/* ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div
            className="
              px-5
              py-3
              text-white
              font-bold
              flex
              justify-between
              items-center
            "
            style={{
              background:
                `linear-gradient(90deg, ${primary}, ${accent})`,
            }}
          >

            <span>
              ADJUSTMENT ITEMS
            </span>

            <span className="text-sm font-medium">
              {adj.items?.length || 0} Items
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm min-w-[650px]">

              <thead className="bg-gray-100 text-gray-700">

                <tr>

                  <th className="p-4 text-left font-semibold">
                    Item Name
                  </th>

                  <th className="p-4 text-center font-semibold">
                    Adjustment Qty
                  </th>

                </tr>

              </thead>

              <tbody>

                {adj.items?.length === 0 && (
                  <tr>

                    <td
                      colSpan={2}
                      className="text-center py-10 text-gray-400"
                    >
                      No items found
                    </td>

                  </tr>
                )}

                {adj.items?.map(
                  (
                    item: any,
                    index: number
                  ) => (

                    <tr
                      key={
                        item.adjustmentItemId ??
                        index
                      }
                      className={`
                        border-b
                        hover:bg-gray-50
                        transition
                        ${index % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50/40"
                        }
                      `}
                    >

                      <td className="p-4 font-medium text-gray-800">
                        {item.itemName || "-"}
                      </td>

                      <td
                        className={`
                          p-4
                          text-center
                          font-bold
                          ${item.quantity < 0
                            ? "text-red-600"
                            : "text-green-600"
                          }
                        `}
                      >
                        {item.quantity > 0
                          ? "+"
                          : ""}
                        {item.quantity}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          {/* TOTAL */}

          <div className="border-t bg-gray-50 px-5 py-4 flex justify-end">

            <div className="text-right">

              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Net Adjustment Quantity
              </p>

              <p
                className={`
                  text-xl
                  font-bold
                  ${totalQty < 0
                    ? "text-red-600"
                    : "text-green-600"
                  }
                `}
              >
                {totalQty > 0
                  ? "+"
                  : ""}
                {totalQty}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}