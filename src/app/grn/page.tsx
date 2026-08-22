"use client";

import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getGRNs } from "@/services/grnService";
import { useRouter } from "next/navigation";
import { canManageGRN } from "@/lib/permissions";

type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export default function GRNPage() {
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

  const canManageGRNs = canManageGRN(role);

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

  const [sortBy, setSortBy] = useState("GRN_NO");
  const [sortDir, setSortDir] = useState("DESC");

  // ============================================================
  // LOAD
  // ============================================================

  const load = useCallback(async () => {
    try {
      const res = await getGRNs();
      const list = Array.isArray(res) ? res : [];

      console.log("========== GRN RESPONSE ==========");
      console.log(list);
      console.log("FIRST GRN:", list[0]);
      console.log("APPROVED AT:", list[0]?.approvedAt);
      console.log("APPROVED DATE:", list[0]?.approvedDate);
      console.log("===================================");

      setData(list);
      setFiltered(list);
    } catch (err) {
      console.error(err);
      setData([]);
      setFiltered([]);
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

    // STATUS
    if (status !== "All") {
      temp = temp.filter((g) => g.status === status);
    }

    const now = new Date();

    // THIS MONTH
    if (dateFilter === "THIS_MONTH") {
      temp = temp.filter((g) => {
        const d = new Date(g.grnDate);

        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    // LAST MONTH
    if (dateFilter === "LAST_MONTH") {
      const last = new Date();

      last.setMonth(now.getMonth() - 1);

      temp = temp.filter((g) => {
        const d = new Date(g.grnDate);

        return (
          d.getMonth() === last.getMonth() &&
          d.getFullYear() === last.getFullYear()
        );
      });
    }

    // DATE RANGE
    if (dateFilter === "RANGE" && fromDate && toDate) {
      temp = temp.filter((g) => {
        const d = new Date(g.grnDate);

        return (
          d >= new Date(fromDate) &&
          d <= new Date(toDate)
        );
      });
    }

    // SEARCH
    if (search) {
      const s = search.toLowerCase();

      temp = temp.filter(
        (g) =>
          g.grnNumber?.toLowerCase().includes(s) ||
          g.supplier?.toLowerCase().includes(s)
      );
    }

    // SORT
    temp.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortBy === "GRN_NO") {
        valA = a.grnNumber;
        valB = b.grnNumber;
      } else if (sortBy === "DATE") {
        valA = new Date(a.grnDate);
        valB = new Date(b.grnDate);
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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ================= PAGE HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">
              Goods Received Notes
            </p>

            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: primary }}
            >
              GRN List
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View, search and manage goods received records
            </p>
          </div>

          {/* ================================================== */}
          {/* CREATE GRN - AUTHORIZED USERS ONLY                 */}
          {/* ================================================== */}

          {roleLoaded && canManageGRNs && (
            <button
              onClick={() => router.push("/grn/create")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold shadow-sm hover:opacity-90 transition"
              style={{ backgroundColor: primary }}
            >
              <span className="text-lg leading-none">+</span>
              Create New GRN
            </button>
          )}

          {/* ================================================== */}
          {/* VIEW ONLY                                          */}
          {/* ================================================== */}

          {roleLoaded && !canManageGRNs && (
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


        {/* ================= FILTER CARD ================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* FILTER HEADER */}
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-gray-800">
                  Filter & Search
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Refine the GRN records you want to view
                </p>
              </div>

            </div>

          </div>


          {/* FILTER BODY */}
          <div className="p-5">

            {/* SEARCH */}
            <div className="mb-5">

              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Search
              </label>

              <div className="relative max-w-md">

                <input
                  type="text"
                  placeholder="Search GRN No or Supplier..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
                />

              </div>

            </div>


            {/* FILTER ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* DATE FILTER */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Date
                </label>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
                >
                  <option value="All">All</option>
                  <option value="UNAPPROVED">Unapproved</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>


              {/* SORT BY */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
                >
                  <option value="GRN_NO">GRN No</option>
                  <option value="DATE">GRN Date</option>
                  <option value="VALUE">GRN Value</option>
                </select>
              </div>


              {/* SORT DIRECTION */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Order
                </label>

                <select
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
                >
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>

            </div>


            {/* DATE RANGE */}
            {dateFilter === "RANGE" && (
              <div className="mt-5 pt-5 border-t border-gray-100">

                <p className="text-xs font-semibold text-gray-600 mb-3">
                  Select Date Range
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      From Date
                    </label>

                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      To Date
                    </label>

                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#953002]"
                    />
                  </div>

                </div>

              </div>
            )}


            {/* RETRIEVE BUTTON */}
            <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">

              <button
                onClick={applyFilters}
                className="px-6 py-2.5 rounded-lg text-white font-semibold shadow-sm hover:opacity-90 transition"
                style={{ backgroundColor: accent }}
              >
                Retrieve Records
              </button>

            </div>

          </div>
        </div>


        {/* ================= TABLE CARD ================= */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* TABLE HEADER */}
          <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <h2 className="font-semibold text-gray-800">
                GRN Records
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Click a record to view its details
              </p>
            </div>

            <div className="text-sm text-gray-600">

              Showing{" "}

              <span
                className="font-bold"
                style={{ color: primary }}
              >
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
                  style={{ backgroundColor: primary }}
                  className="text-white uppercase text-xs tracking-wide"
                >

                  <th className="px-5 py-3.5 text-left font-semibold">
                    GRN No
                  </th>

                  <th className="px-5 py-3.5 text-left font-semibold">
                    Date
                  </th>

                  <th className="px-5 py-3.5 text-left font-semibold">
                    Supplier
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

                  <th className="px-5 py-3.5 text-center font-semibold">
                    Approved Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {filtered.length === 0 && (
                  <tr>

                    <td
                      colSpan={7}
                      className="text-center py-14"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <span className="text-xl text-gray-400">
                            —
                          </span>
                        </div>

                        <p className="font-medium text-gray-600">
                          No GRN records found
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Try changing your filters or search term
                        </p>

                      </div>

                    </td>

                  </tr>
                )}


                {filtered.map((g, index) => (

                  <tr
                    key={g.grnId}
                    onClick={() =>
                      router.push(`/grn/${g.grnId}`)
                    }
                    className={`
                      cursor-pointer
                      border-b border-gray-100
                      transition
                      hover:bg-orange-50
                      ${index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50/70"
                      }
                    `}
                  >

                    {/* GRN NUMBER */}
                    <td
                      className="px-5 py-4 font-semibold"
                      style={{ color: primary }}
                    >
                      {g.grnNumber}
                    </td>


                    {/* DATE */}
                    <td className="px-5 py-4 text-gray-700">
                      {g.grnDate || "-"}
                    </td>


                    {/* SUPPLIER */}
                    <td className="px-5 py-4 text-gray-700">
                      {g.supplier || "-"}
                    </td>


                    {/* LOCATION */}
                    <td className="px-5 py-4 text-gray-700">
                      {g.location || "-"}
                    </td>


                    {/* VALUE */}
                    <td className="px-5 py-4 text-right font-semibold text-gray-800">
                      {g.totalValue?.toLocaleString() || "0"}
                    </td>


                    {/* STATUS */}
                    <td className="px-5 py-4 text-center">

                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor:
                            g.status === "APPROVED"
                              ? "green"
                              : g.status === "CANCELLED"
                                ? "red"
                                : primary,
                        }}
                      >
                        {g.status}
                      </span>

                    </td>


                    {/* APPROVED DATE */}
                    <td className="px-5 py-4 text-center text-gray-500">
                      {g.approvedAt
                        ? new Date(
                          g.approvedAt
                        ).toLocaleDateString()
                        : "-"}
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