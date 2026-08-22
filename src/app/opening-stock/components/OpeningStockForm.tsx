"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  createOpeningStock,
  updateOpeningStock,
} from "@/services/openingStockService";

import ItemModal from "./ItemModal";
import OpeningStockSummary from "./OpeningStockSummary";

export default function OpeningStockForm({
  initialData = null,
  isEdit = false,
  canEdit = true,
}: any) {
  const router = useRouter();

  const primary = "#953002";
  const accent = "#FFB401";

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ============================================================
  // MESSAGE
  // ============================================================

  const [msg, setMsg] = useState("");

  const [msgType, setMsgType] = useState<
    "success" | "error"
  >("success");

  const showMsg = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMsg(text);
    setMsgType(type);

    setTimeout(() => setMsg(""), 3000);
  };

  // ============================================================
  // MAP ITEMS
  // ============================================================

  const mapItems = (items: any[] = []) => {
    return items.map((item: any) => ({
      id:
        item.id ||
        item.openingStockItemId ||
        Date.now(),

      itemCode: item.itemCode,

      name:
        item.itemName ||
        item.name ||
        "",

      qty:
        item.quantity ??
        item.qty ??
        0,

      price:
        item.unitPrice ??
        item.price ??
        0,
    }));
  };

  // ============================================================
  // ERRORS
  // ============================================================

  const [errors, setErrors] = useState<any>({});

  // ============================================================
  // FORM
  // ============================================================

  const [form, setForm] = useState({
    entryNo:
      initialData?.entryNo ||
      "NEW",

    date:
      initialData?.openingDate ||
      "",

    comment:
      initialData?.comment ||
      "",

    location:
      initialData?.location ||
      "",
  });

  // ============================================================
  // ITEMS
  // ============================================================

  const [items, setItems] = useState<any[]>(
    mapItems(initialData?.items || [])
  );

  const [itemModal, setItemModal] =
    useState(false);

  // ============================================================
  // STATUS
  // ============================================================

  const isApproved =
    initialData?.status === "APPROVED";

  const isCancelled =
    initialData?.status === "CANCELLED";

  // ============================================================
  // EDITABILITY
  // ============================================================

  const statusAllowsEditing =
    !isEdit ||
    initialData?.status === "UNAPPROVED" ||
    initialData?.status === "PENDING";

  const isEditable =
    canEdit &&
    statusAllowsEditing;

  // ============================================================
  // LOCATIONS
  // ============================================================

  const locations = [
    "HEAD_OFFICE",
    "KALUTARA",
    "KANDY",
    "GALLE",
    "GAMPAHA",
    "ANURADHAPURA",
  ];

  // ============================================================
  // ADD ITEM
  // ============================================================

  const addItem = (item: any) => {
    if (!isEditable) return;

    setItems((prev) => [
      ...prev,

      {
        id: Date.now(),

        itemCode:
          item.itemCode,

        name:
          item.itemName ||
          item.name,

        qty:
          item.qty ||
          1,

        price:
          item.price ||
          0,
      },
    ]);
  };

  // ============================================================
  // DELETE ITEM
  // ============================================================

  const deleteItem = (id: number) => {
    if (!isEditable) return;

    setItems((prev) =>
      prev.filter(
        (i) => i.id !== id
      )
    );
  };

  // ============================================================
  // TOTAL
  // ============================================================

  const total = items.reduce(
    (sum, i) =>
      sum +
      (i.qty || 0) *
      (i.price || 0),
    0
  );

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async () => {

    if (!isEditable) {
      showMsg(
        "You are not authorized to edit Opening Stock.",
        "error"
      );

      return;
    }

    let newErrors: any = {};

    if (!form.date) {
      newErrors.date =
        "Date required";
    }

    if (!form.location) {
      newErrors.location =
        "Location required";
    }

    if (!items.length) {
      newErrors.items =
        "Add at least 1 item";
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0
    ) {
      return;
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    const payload = {
      entryNo:
        initialData?.entryNo ||
        null,

      openingDate:
        form.date,

      location:
        form.location,

      comment:
        form.comment,

      items: items.map((i) => ({
        itemCode:
          i.itemCode,

        quantity:
          Number(i.qty),

        unitPrice:
          Number(i.price),
      })),
    };

    try {

      if (isEdit) {

        const id =
          initialData.openingStockId ||
          initialData.id;

        await updateOpeningStock(
          id,
          payload
        );

        showMsg(
          "Opening Stock Updated Successfully",
          "success"
        );

      } else {

        await createOpeningStock(
          payload
        );

        showMsg(
          "Opening Stock Created Successfully",
          "success"
        );
      }

      router.push(
        "/opening-stock"
      );

    } catch (err: any) {

      console.log(err);

      showMsg(
        err?.response?.data?.message ||
        "Update failed",
        "error"
      );
    }
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">

      <div className="max-w-6xl mx-auto space-y-4">

        {/* ==================================================== */}
        {/* BACK BUTTON                                          */}
        {/* ==================================================== */}

        <div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/opening-stock"
              )
            }
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#953002] hover:bg-gray-200/60 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />

            <span>
              Back
            </span>
          </button>

        </div>

        {/* ==================================================== */}
        {/* MESSAGE                                              */}
        {/* ==================================================== */}

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

        {/* ==================================================== */}
        {/* HEADER                                               */}
        {/* ==================================================== */}

        <div className="flex justify-between items-center">

          <h1
            className="text-2xl font-bold"
            style={{
              color: primary,
            }}
          >
            {isEdit
              ? "Opening Stock"
              : "Create Opening Stock"}
          </h1>

        </div>

        {/* ==================================================== */}
        {/* READ ONLY INDICATOR                                  */}
        {/* ==================================================== */}

        {!isEditable &&
          !isApproved &&
          !isCancelled && (
            <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded">
              This Opening Stock record is
              view-only for your role.
            </div>
          )}

        {/* ==================================================== */}
        {/* STATUS                                               */}
        {/* ==================================================== */}

        {isApproved && (
          <p className="bg-green-100 text-green-700 p-3 rounded">
            APPROVED - Locked
          </p>
        )}

        {isCancelled && (
          <p className="bg-red-100 text-red-700 p-3 rounded">
            CANCELLED - Locked
          </p>
        )}

        {/* ==================================================== */}
        {/* FORM                                                 */}
        {/* ==================================================== */}

        <div className="bg-white p-5 rounded-xl shadow space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* ENTRY NO */}

            <div>

              <label className="font-semibold">
                Entry No
              </label>

              <input
                value={form.entryNo}
                disabled
                className="border p-2 w-full rounded bg-gray-100 font-semibold"
              />

            </div>

            {/* DATE */}

            <div>

              <label className="font-semibold">
                Date
              </label>

              <input
                type="date"
                value={form.date}
                max={today}
                disabled={!isEditable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              />

              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date}
                </p>
              )}

            </div>

            {/* LOCATION */}

            <div>

              <label className="font-semibold">
                Location
              </label>

              <select
                value={form.location}
                disabled={!isEditable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location:
                      e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              >

                <option value="">
                  Select
                </option>

                {locations.map(
                  (l) => (
                    <option
                      key={l}
                      value={l}
                    >
                      {l}
                    </option>
                  )
                )}

              </select>

              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location}
                </p>
              )}

            </div>

            {/* COMMENT */}

            <div className="md:col-span-3">

              <label className="font-semibold">
                Comment
              </label>

              <textarea
                value={form.comment}
                disabled={!isEditable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    comment:
                      e.target.value,
                  })
                }
                className="border p-2 w-full rounded"
              />

            </div>

          </div>

          {/* ================================================== */}
          {/* ADD ITEM                                            */}
          {/* ================================================== */}

          {isEditable && (
            <button
              onClick={() =>
                setItemModal(true)
              }
              className="bg-[#953002] text-white px-4 py-2 rounded"
            >
              + Add Item
            </button>
          )}

          {/* ================================================== */}
          {/* TABLE                                               */}
          {/* ================================================== */}

          <div className="rounded-xl overflow-x-auto shadow border">

            <div
              className="p-3 text-white font-bold"
              style={{
                background:
                  `linear-gradient(90deg, ${primary}, ${accent})`,
              }}
            >
              ITEM DETAILS
            </div>

            <table className="w-full text-sm min-w-[700px]">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 text-left">
                    Code
                  </th>

                  <th className="p-3 text-left">
                    Name
                  </th>

                  <th className="p-3 text-left">
                    Qty
                  </th>

                  <th className="p-3 text-left">
                    Price
                  </th>

                  <th className="p-3 text-left">
                    Total
                  </th>

                  {isEditable && (
                    <th className="p-3 text-left">
                      Action
                    </th>
                  )}

                </tr>

              </thead>

              <tbody>

                {items.map(
                  (i, index) => (

                    <tr
                      key={i.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {i.itemCode}
                      </td>

                      <td className="p-3">
                        {i.name}
                      </td>

                      {/* QTY */}

                      <td className="p-3">

                        {isEditable ? (

                          <input
                            type="number"
                            value={i.qty}
                            min={1}
                            onChange={(e) => {

                              const copy = [
                                ...items,
                              ];

                              copy[index].qty =
                                Number(
                                  e.target.value
                                );

                              setItems(
                                copy
                              );
                            }}
                            className="border p-1 w-20 rounded"
                          />

                        ) : (
                          i.qty
                        )}

                      </td>

                      {/* PRICE */}

                      <td className="p-3">

                        {isEditable ? (

                          <input
                            type="number"
                            value={i.price}
                            min={0}
                            onChange={(e) => {

                              const copy = [
                                ...items,
                              ];

                              copy[index].price =
                                Number(
                                  e.target.value
                                );

                              setItems(
                                copy
                              );
                            }}
                            className="border p-1 w-24 rounded"
                          />

                        ) : (
                          i.price
                        )}

                      </td>

                      {/* TOTAL */}

                      <td className="p-3 font-semibold">

                        {(i.qty || 0) *
                          (i.price || 0)}

                      </td>

                      {/* DELETE */}

                      {isEditable && (
                        <td className="p-3">

                          <button
                            onClick={() =>
                              deleteItem(
                                i.id
                              )
                            }
                            className="text-red-600 font-bold"
                          >
                            Delete
                          </button>

                        </td>
                      )}

                    </tr>

                  )
                )}

                {!items.length && (
                  <tr>

                    <td
                      colSpan={
                        isEditable
                          ? 6
                          : 5
                      }
                      className="text-center p-5 text-gray-500"
                    >
                      No Items Added
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* ================================================== */}
          {/* TOTAL                                               */}
          {/* ================================================== */}

          <div
            className="p-4 text-white font-bold rounded text-lg"
            style={{
              background: primary,
            }}
          >
            TOTAL: Rs.{" "}
            {total.toLocaleString()}
          </div>

          {/* ================================================== */}
          {/* SAVE                                                */}
          {/* ================================================== */}

          {isEditable && (
            <button
              onClick={handleSave}
              className="bg-[#953002] text-white px-6 py-3 rounded w-full md:w-auto font-semibold"
            >
              {isEdit
                ? "UPDATE"
                : "SAVE"}
            </button>
          )}

          {/* ================================================== */}
          {/* ITEM MODAL                                          */}
          {/* ================================================== */}

          {isEditable && (
            <ItemModal
              isOpen={itemModal}
              onClose={() =>
                setItemModal(false)
              }
              onAdd={addItem}
            />
          )}

        </div>

      </div>

    </div>
  );
}