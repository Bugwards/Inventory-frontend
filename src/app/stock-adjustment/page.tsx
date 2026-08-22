"use client";

import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { getAdjustments } from "@/services/stockAdjustmentService";
import { canManageStockAdjustment } from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export default function StockAdjustmentPage() {
  const router = useRouter();

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

  const canManageAdjustment =
    canManageStockAdjustment(role);

  // ============================================================
  // DATA
  // ============================================================

  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [location, setLocation] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("ADJ_NO");
  const [sortDir, setSortDir] = useState("DESC");

  // ============================================================
  // LOAD DATA
  // ============================================================

  const load = useCallback(async () => {
    try {
      const res = await getAdjustments();

      const list = Array.isArray(res) ? res : [];

      setData(list);
      setFiltered(list);
    } catch (err) {
      console.error("Failed to load stock adjustments:", err);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ============================================================
  // FILTER
  // ============================================================

  const applyFilters = () => {
    let temp = [...data];

    // LOCATION
    if (location !== "ALL") {
      temp = temp.filter(
        (a) => a.location === location
      );
    }

    // SEARCH
    if (search.trim()) {
      const s = search.toLowerCase();

      temp = temp.filter(
        (a) =>
          a.adjustmentNo
            ?.toLowerCase()
            .includes(s) ||
          a.reason
            ?.toLowerCase()
            .includes(s)
      );
    }

    // DATE
    const now = new Date();

    if (dateFilter === "THIS_MONTH") {
      temp = temp.filter((a) => {
        const d = new Date(a.adjustmentDate);

        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    if (dateFilter === "LAST_MONTH") {
      const last = new Date();

      last.setMonth(
        now.getMonth() - 1
      );

      temp = temp.filter((a) => {
        const d = new Date(a.adjustmentDate);

        return (
          d.getMonth() === last.getMonth() &&
          d.getFullYear() === last.getFullYear()
        );
      });
    }

    // SORT
    temp.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortBy === "ADJ_NO") {
        valA = a.adjustmentNo;
        valB = b.adjustmentNo;
      } else if (sortBy === "DATE") {
        valA = new Date(a.adjustmentDate).getTime();
        valB = new Date(b.adjustmentDate).getTime();
      } else {
        valA = a.reason;
        valB = b.reason;
      }

      if (sortDir === "ASC") {
        return valA > valB ? 1 : -1;
      }

      return valA < valB ? 1 : -1;
    });

    setFiltered(temp);
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ==================================================== */}
        {/* PAGE HEADER                                           */}
        {/* ==================================================== */}

        <div className="bg-white rounded-xl shadow border overflow-hidden">

          <div className="px-6 py-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              {/* TITLE */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Inventory Management
                </p>

                <h1
                  className="text-2xl font-bold"
                  style={{ color: primary }}
                >
                  Stock Adjustment
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage and review stock adjustment records
                </p>
              </div>

              {/* ================================================= */}
              {/* CREATE BUTTON - PERMISSION PROTECTED             */}
              {/* ================================================= */}

              {roleLoaded && canManageAdjustment && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/stock-adjustment/create"
                    )
                  }
                  className="
                    cursor-pointer
                    px-5
                    py-2.5
                    rounded-lg
                    text-white
                    font-semibold
                    shadow
                    transition-all
                    duration-200
                    hover:opacity-90
                    hover:shadow-lg
                    active:scale-95
                  "
                  style={{
                    backgroundColor: primary,
                  }}
                >
                  + Create Adjustment
                </button>
              )}

              {/* ================================================= */}
              {/* VIEW ONLY                                         */}
              {/* ================================================= */}

              {roleLoaded && !canManageAdjustment && (
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
              )}

            </div>

          </div>

        </div>

        {/* ==================================================== */}
        {/* FILTER & SEARCH                                      */}
        {/* ==================================================== */}

        <div className="bg-white rounded-xl shadow border mt-4 overflow-hidden">

          <div className="px-6 py-4 border-b bg-gray-50">

            <h2 className="font-semibold text-gray-800">
              Filter & Search
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Filter adjustment records by location,
              date, or search criteria.
            </p>

          </div>

          <div className="p-6 space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* LOCATION */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Location
                </label>

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="border border-gray-300 p-2.5 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="ALL">
                    All Locations
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

              {/* DATE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Date
                </label>

                <select
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value)
                  }
                  className="border border-gray-300 p-2.5 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="ALL">
                    All Days
                  </option>

                  <option value="THIS_MONTH">
                    This Month
                  </option>

                  <option value="LAST_MONTH">
                    Last Month
                  </option>
                </select>
              </div>

              {/* SORT */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="border border-gray-300 p-2.5 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="ADJ_NO">
                    Adjustment No
                  </option>

                  <option value="DATE">
                    Date
                  </option>

                  <option value="REASON">
                    Reason
                  </option>
                </select>
              </div>

              {/* SORT ORDER */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Order
                </label>

                <select
                  value={sortDir}
                  onChange={(e) =>
                    setSortDir(e.target.value)
                  }
                  className="border border-gray-300 p-2.5 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="DESC">
                    Descending
                  </option>

                  <option value="ASC">
                    Ascending
                  </option>
                </select>
              </div>

            </div>

            {/* SEARCH */}
            <div className="flex flex-col sm:flex-row gap-3">

              <div className="flex-1">

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Search
                </label>

                <input
                  placeholder="Search Adjustment No / Reason"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="border border-gray-300 p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-200"
                />

              </div>

              <div className="sm:self-end">

                <button
                  type="button"
                  onClick={applyFilters}
                  className="px-6 py-2.5 rounded-lg text-white font-semibold shadow transition hover:opacity-90 w-full sm:w-auto"
                  style={{
                    backgroundColor: accent,
                  }}
                >
                  Retrieve
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================== */}
        {/* RECORD TABLE                                         */}
        {/* ==================================================== */}

        <div className="bg-white rounded-xl shadow border mt-4 overflow-hidden">

          <div className="px-6 py-4 border-b bg-gray-50">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <div>
                <h2 className="font-semibold text-gray-800">
                  Stock Adjustments
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review available adjustment records
                </p>
              </div>

              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filtered.length}
                </span>{" "}
                records
              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr
                  className="text-white uppercase text-xs"
                  style={{
                    backgroundColor: primary,
                  }}
                >
                  <th className="px-6 py-3 text-left">
                    Adjustment No
                  </th>

                  <th className="px-6 py-3 text-left">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left">
                    Reason
                  </th>

                  <th className="px-6 py-3 text-left">
                    Location
                  </th>

                  <th className="px-6 py-3 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-gray-400"
                    >
                      No Adjustment records found
                    </td>
                  </tr>
                )}

                {filtered.map((a, index) => (

                  <tr
                    key={a.adjustmentId}
                    onClick={() =>
                      router.push(
                        `/stock-adjustment/${a.adjustmentId}`
                      )
                    }
                    className={`
                      cursor-pointer
                      transition
                      border-b
                      ${index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                      }
                      hover:bg-orange-50
                    `}
                  >

                    <td
                      className="px-6 py-4 font-semibold"
                      style={{ color: primary }}
                    >
                      {a.adjustmentNo}
                    </td>

                    <td className="px-6 py-4">
                      {a.adjustmentDate || "-"}
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <span className="line-clamp-2">
                        {a.reason || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {a.location || "-"}
                    </td>

                    <td className="px-6 py-4 text-center">

                      <span
                        className="inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor:
                            a.status === "APPROVED"
                              ? "green"
                              : a.status === "CANCELLED"
                                ? "red"
                                : primary,
                        }}
                      >
                        {a.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}