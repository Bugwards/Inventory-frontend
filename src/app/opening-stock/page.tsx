"use client";

import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getOpeningStocks } from "@/services/openingStockService";
import { useRouter } from "next/navigation";

import { canManageOpeningStock } from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export default function OpeningStockPage() {
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

  const canManage = canManageOpeningStock(role);

  // ============================================================
  // DATA
  // ============================================================

  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [status, setStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("ENTRY_NO");
  const [sortDir, setSortDir] = useState("DESC");

  // ============================================================
  // LOAD
  // ============================================================

  const load = useCallback(async () => {
    try {
      const res = await getOpeningStocks();
      const list = Array.isArray(res) ? res : [];

      setData(list);
      setFiltered(list);
    } catch (err) {
      console.error(err);
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

    if (status !== "All") {
      temp = temp.filter((os) => os.status === status);
    }

    const now = new Date();

    if (dateFilter === "THIS_MONTH") {
      temp = temp.filter((os) => {
        const d = new Date(os.openingDate);

        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    if (dateFilter === "LAST_MONTH") {
      const last = new Date();

      last.setMonth(now.getMonth() - 1);

      temp = temp.filter((os) => {
        const d = new Date(os.openingDate);

        return (
          d.getMonth() === last.getMonth() &&
          d.getFullYear() === last.getFullYear()
        );
      });
    }

    if (dateFilter === "RANGE" && fromDate && toDate) {
      temp = temp.filter((os) => {
        const d = new Date(os.openingDate);

        return d >= new Date(fromDate) && d <= new Date(toDate);
      });
    }

    if (search) {
      const s = search.toLowerCase();

      temp = temp.filter(
        (os) =>
          os.entryNo?.toLowerCase().includes(s) ||
          os.location?.toLowerCase().includes(s)
      );
    }

    temp.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortBy === "ENTRY_NO") {
        valA = a.entryNo;
        valB = b.entryNo;
      } else if (sortBy === "DATE") {
        valA = new Date(a.openingDate);
        valB = new Date(b.openingDate);
      } else {
        valA = a.totalValue;
        valB = b.totalValue;
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

      {/* ================= PAGE CONTAINER ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ================= PAGE HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: primary }}
            >
              Opening Stock List
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View, filter and manage opening stock records
            </p>
          </div>

          {/* ================================================== */}
          {/* CREATE BUTTON / VIEW ONLY                          */}
          {/* ================================================== */}

          {roleLoaded && canManage ? (
            <button
              onClick={() =>
                router.push("/opening-stock/create")
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold shadow-sm hover:opacity-90 transition"
              style={{ backgroundColor: primary }}
            >
              <span className="text-lg leading-none">+</span>
              Create New Opening Stock
            </button>
          ) : (
            roleLoaded && (
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
            )
          )}

        </div>

        {/* ================= FILTER CARD ================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">

          {/* FILTER HEADER */}

          <div className="px-5 py-4 border-b border-gray-200">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-gray-800">
                  Filter & Search
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Refine opening stock records using the options below
                </p>
              </div>

            </div>

          </div>

          {/* FILTER CONTENT */}

          <div className="p-5">

            {/* FIRST ROW */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* DATE FILTER */}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Date Filter
                </label>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="ALL">All Days</option>
                  <option value="THIS_MONTH">This Month</option>
                  <option value="LAST_MONTH">Last Month</option>
                  <option value="RANGE">Date Range</option>
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <option value="All">All</option>
                  <option value="UNAPPROVED">Unapproved</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* SEARCH */}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Search
                </label>

                <input
                  placeholder="Search Entry No / Location"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>

            {/* DATE RANGE */}

            {dateFilter === "RANGE" && (
              <div className="mt-4 pt-4 border-t border-gray-100">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      From Date
                    </label>

                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) =>
                        setFromDate(e.target.value)
                      }
                      className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      To Date
                    </label>

                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) =>
                        setToDate(e.target.value)
                      }
                      className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* SORT + RETRIEVE */}

            <div className="mt-5 pt-5 border-t border-gray-100">

              <div className="flex flex-col sm:flex-row sm:items-end gap-4">

                <div className="w-full sm:w-48">

                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Sort By
                  </label>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value)
                    }
                    className="border border-gray-300 p-2.5 rounded-lg w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="ENTRY_NO">
                      Entry No
                    </option>

                    <option value="DATE">
                      Date
                    </option>

                    <option value="VALUE">
                      Value
                    </option>
                  </select>

                </div>

                <div className="w-full sm:w-32">

                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Direction
                  </label>

                  <select
                    value={sortDir}
                    onChange={(e) =>
                      setSortDir(e.target.value)
                    }
                    className="border border-gray-300 p-2.5 rounded-lg w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="DESC">Desc</option>
                    <option value="ASC">Asc</option>
                  </select>

                </div>

                <button
                  onClick={applyFilters}
                  className="px-5 py-2.5 rounded-lg text-white font-semibold shadow-sm hover:opacity-90 transition sm:w-auto"
                  style={{ backgroundColor: accent }}
                >
                  Retrieve
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ================= TABLE CARD ================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* TABLE HEADER */}

          <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Opening Stock Records
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Available opening stock entries
              </p>
            </div>

            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {filtered.length}
              </span>{" "}
              records
            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr
                  className="text-white uppercase text-xs"
                  style={{ backgroundColor: primary }}
                >
                  <th className="px-5 py-3.5 text-left font-semibold">
                    Entry No
                  </th>

                  <th className="px-5 py-3.5 text-left font-semibold">
                    Date
                  </th>

                  <th className="px-5 py-3.5 text-left font-semibold">
                    Location
                  </th>

                  <th className="px-5 py-3.5 text-right font-semibold">
                    Value
                  </th>

                  <th className="px-5 py-3.5 text-center font-semibold">
                    Status
                  </th>
                </tr>

              </thead>

              <tbody>

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-14 text-gray-400"
                    >
                      <div className="flex flex-col items-center">

                        <p className="font-medium">
                          No Opening Stock Found
                        </p>

                        <p className="text-xs mt-1">
                          Try changing your filters or search criteria.
                        </p>

                      </div>
                    </td>
                  </tr>
                )}

                {filtered.map((os, index) => (

                  <tr
                    key={os.openingStockId}
                    onClick={() =>
                      router.push(
                        `/opening-stock/${os.openingStockId}`
                      )
                    }
                    className={`
                      cursor-pointer
                      transition
                      border-b
                      border-gray-100
                      ${index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                      }
                      hover:bg-orange-50
                    `}
                  >

                    <td
                      className="px-5 py-3.5 font-semibold"
                      style={{ color: primary }}
                    >
                      {os.entryNo}
                    </td>

                    <td className="px-5 py-3.5 text-gray-700">
                      {os.openingDate || "-"}
                    </td>

                    <td className="px-5 py-3.5 text-gray-700">
                      {os.location || "-"}
                    </td>

                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800">
                      {os.totalValue?.toLocaleString() || "0"}
                    </td>

                    <td className="px-5 py-3.5 text-center">

                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor:
                            os.status === "APPROVED"
                              ? "green"
                              : os.status === "CANCELLED"
                                ? "red"
                                : primary,
                        }}
                      >
                        {os.status}
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