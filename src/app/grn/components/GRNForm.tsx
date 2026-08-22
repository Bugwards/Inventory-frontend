"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import {
  createGRN,
  updateGRN,
} from "@/services/grnService";

import ItemModal from "./ItemModal";
import { canManageGRN } from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

type GRNFormProps = {
  initialData?: any;
  isEdit?: boolean;
  isLocked?: boolean;
};

export default function GRNForm({
  initialData = null,
  isEdit = false,
  isLocked = false,
}: GRNFormProps) {
  const router = useRouter();

  // ================= UI COLORS =================
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
  // PERMISSION
  // ============================================================

  const canManageGRNs = canManageGRN(role);

  // ================= DATE =================
  const today = new Date().toISOString().split("T")[0];

  // ================= MESSAGE =================
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">(
    "success"
  );

  // ================= ERRORS =================
  const [errors, setErrors] = useState<any>({});

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

  // ================= SAFE ITEM MAPPING =================
  const mapItems = (items: any[] = []) =>
    items.map((it: any) => ({
      id: it.id || it.grnItemId || Date.now() + Math.random(),

      itemId: it.itemId || it.item?.itemId,
      itemCode: it.itemCode || it.item?.itemCode || "",

      name:
        it.name ||
        it.itemName ||
        it.item?.itemName ||
        "N/A",

      qty: it.qty ?? it.quantity ?? 0,
      price: it.price ?? it.unitPrice ?? 0,
    }));

  // ================= FORM =================
  const [form, setForm] = useState({
    grnNumber: initialData?.grnNumber ?? "NEW",
    date: initialData?.grnDate ?? "",
    supplier: initialData?.supplier ?? "",
    poNumber: initialData?.poNumber ?? "",
    location: initialData?.location ?? "",
    comment: initialData?.comment ?? "",
  });

  // ================= ITEMS =================
  const [items, setItems] = useState<any[]>(
    mapItems(initialData?.items || [])
  );

  // ================= MODAL =================
  const [itemModal, setItemModal] = useState(false);

  // ================= STATUS =================
  const isApproved =
    initialData?.status === "APPROVED";

  const isCancelled =
    initialData?.status === "CANCELLED";

  // ============================================================
  // EDITABLE
  // ============================================================

  const isEditable =
    roleLoaded &&
    canManageGRNs &&
    !isLocked &&
    (!isEdit ||
      initialData?.status === "UNAPPROVED");

  // ================= OPTIONS =================
  const suppliers = [
    "SURASAVI_SUPPLIERS",
    "GUNASEKARA_SUPPLIERS",
    "ATLAS_SUPPLIERS",
    "ALPHA_STATIONERIES",
    "INNOVATION_TECH",
  ];

  const locations = [
    "HEAD_OFFICE",
    "KALUTARA",
    "KANDY",
    "GALLE",
    "GAMPAHA",
    "ANURADHAPURA",
  ];

  // ================= ADD ITEM =================
  const addItem = (item: any) => {
    if (!isEditable) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        itemCode: item.itemCode,
        name: item.itemName,
        itemGroup: item.itemGroup || "-",
        unit: item.unitOfMeasurement || "PCS",
        qty: item.qty || 1,
        price: item.price || 0,
      },
    ]);
  };

  // ================= DELETE ITEM =================
  const deleteItem = (id: number) => {
    if (!isEditable) return;

    setItems((prev) =>
      prev.filter((i) => i.id !== id)
    );
  };

  // ================= TOTAL =================
  const total = items.reduce(
    (sum, i) =>
      sum + (i.qty || 0) * (i.price || 0),
    0
  );

  // ================= SAVE =================
  const handleSave = async () => {

    // ==========================================================
    // AUTHORIZATION CHECK
    // ==========================================================

    if (!canManageGRNs) {
      showMsg(
        "You are not authorized to manage GRNs.",
        "error"
      );

      return;
    }

    if (!isEditable) return;

    let newErrors: any = {};

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    if (!form.supplier) {
      newErrors.supplier =
        "Supplier is required";
    }

    if (!form.location) {
      newErrors.location =
        "Location is required";
    }

    if (!/^PO-\d{4}$/.test(form.poNumber)) {
      newErrors.poNumber =
        "PO Number must be in format PO-0000";
    }

    if (!items.length) {
      newErrors.items =
        "At least one item required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const payload = {
      grnNumber:
        initialData?.grnNumber || null,

      grnDate: form.date,

      supplier: form.supplier,

      poNumber: form.poNumber,

      location: form.location,

      comment: form.comment,

      items: items.map((i) => ({
        itemCode: i.itemCode,
        quantity: i.qty,
        unitPrice: i.price,
      })),
    };

    try {

      if (isEdit) {

        await updateGRN(
          initialData.grnId,
          payload
        );

        showMsg(
          "GRN Updated Successfully",
          "success"
        );

      } else {

        await createGRN(payload);

        showMsg(
          "GRN Created Successfully",
          "success"
        );

      }

      router.push("/grn");

    } catch (err: any) {

      showMsg(
        err?.response?.data?.message ||
        "Save failed",
        "error"
      );

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">

      <div className="max-w-6xl mx-auto space-y-4">

        {/* BACK BUTTON */}
        <div>
          <button
            type="button"
            onClick={() => router.push("/grn")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-md font-bold text-gray-700 hover:text-[#953002] hover:bg-gray-200/60 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
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
            style={{ color: primary }}
          >
            {isEdit
              ? ` GRN `
              : "Create GRN"}
          </h1>

        </div>

        {/* ====================================================== */}
        {/* UNAUTHORIZED INDICATOR                                */}
        {/* ====================================================== */}

        {roleLoaded && !canManageGRNs && (
          <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded">
            You have view-only access to GRNs. You are not authorized
            to create or modify GRNs.
          </div>
        )}

        {/* STATUS */}
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

        {/* ================= FORM ================= */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* GRN NO */}
            <div>
              <label className="font-semibold">
                GRN No
              </label>

              <input
                value={form.grnNumber}
                disabled
                className="border p-2 w-full rounded bg-gray-100 font-semibold"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="font-semibold">
                Date
              </label>

              <div>
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
                  className="border p-2 rounded w-full"
                />

                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date}
                  </p>
                )}
              </div>
            </div>

            {/* SUPPLIER */}
            <div>
              <label className="font-semibold">
                Supplier
              </label>

              <div>
                <select
                  value={form.supplier}
                  disabled={!isEditable}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      supplier: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">
                    Select Supplier
                  </option>

                  {suppliers.map((s) => (
                    <option
                      key={s}
                      value={s}
                    >
                      {s}
                    </option>
                  ))}
                </select>

                {errors.supplier && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.supplier}
                  </p>
                )}
              </div>
            </div>

            {/* PO NUMBER */}
            <div>
              <label className="font-semibold">
                PO Number
              </label>

              <div>
                <input
                  value={form.poNumber}
                  disabled={!isEditable}
                  maxLength={7}
                  onChange={(e) => {

                    let value =
                      e.target.value.toUpperCase();

                    value = value.replace(
                      "PO-",
                      ""
                    );

                    value =
                      value.replace(/\D/g, "");

                    value = value.slice(0, 4);

                    value = value
                      ? `PO-${value}`
                      : "";

                    setForm({
                      ...form,
                      poNumber: value,
                    });
                  }}
                  className="border p-2 rounded w-full"
                  placeholder="PO-0000"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Format: PO-0000
                </p>

                {errors.poNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.poNumber}
                  </p>
                )}
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className="font-semibold">
                Location
              </label>

              <div>
                <select
                  value={form.location}
                  disabled={!isEditable}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">
                    Select Location
                  </option>

                  {locations.map((l) => (
                    <option
                      key={l}
                      value={l}
                    >
                      {l}
                    </option>
                  ))}
                </select>

                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* COMMENT */}
          <div>
            <label className="font-semibold">
              Comment
            </label>

            <textarea
              value={form.comment}
              disabled={!isEditable}
              onChange={(e) =>
                setForm({
                  ...form,
                  comment: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
              placeholder="Comment"
            />
          </div>

          {/* ================= ADD ITEM ================= */}
          {isEditable && (
            <button
              onClick={() =>
                setItemModal(true)
              }
              className="bg-[#953002] text-white px-4 py-2 rounded w-full md:w-auto"
            >
              + Add Item
            </button>
          )}

          {/* ITEMS ERROR */}
          {errors.items && (
            <p className="text-red-500 text-sm">
              {errors.items}
            </p>
          )}

          {/* ================= TABLE ================= */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">

            <div
              className="p-3 text-white font-bold"
              style={{
                background: `linear-gradient(90deg, ${primary}, ${accent})`,
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

                {items.map((i, index) => (

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
                          min={1}
                          value={i.qty}
                          onChange={(e) => {

                            const copy = [
                              ...items,
                            ];

                            copy[index].qty =
                              Number(
                                e.target.value
                              );

                            setItems(copy);
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
                          min={0}
                          value={i.price}
                          onChange={(e) => {

                            const copy = [
                              ...items,
                            ];

                            copy[index].price =
                              Math.max(
                                0,
                                Number(
                                  e.target.value
                                )
                              );

                            setItems(copy);
                          }}
                          className="border p-1 w-24 text-right rounded"
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

                    {/* ACTION */}
                    {isEditable && (
                      <td className="p-3">

                        <button
                          onClick={() =>
                            deleteItem(i.id)
                          }
                          className="text-red-600 font-bold"
                        >
                          Delete
                        </button>

                      </td>
                    )}

                  </tr>

                ))}

                {!items.length && (
                  <tr>

                    <td
                      colSpan={6}
                      className="text-center p-5 text-gray-500"
                    >
                      No Items Added
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* ================= TOTAL ================= */}
          <div
            className="p-4 text-white font-bold rounded text-lg"
            style={{
              background: primary,
            }}
          >
            TOTAL: Rs.{" "}
            {total.toLocaleString()}
          </div>

          {/* ================= SAVE ================= */}
          {isEditable && (
            <button
              onClick={handleSave}
              className="bg-[#953002] text-white px-6 py-3 rounded w-full md:w-auto font-semibold"
            >
              {isEdit
                ? "UPDATE GRN"
                : "SAVE GRN"}
            </button>
          )}

          {/* ================= MODAL ================= */}
          <ItemModal
            isOpen={itemModal}
            onClose={() =>
              setItemModal(false)
            }
            onAdd={addItem}
          />

        </div>

      </div>

    </div>
  );
}