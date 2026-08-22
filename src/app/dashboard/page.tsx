"use client";

import { useEffect, useMemo, useState } from "react";

import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    getDashboardData,
    type DashboardData,
} from "@/features/dashboard/useDash";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCircle } from "lucide-react";

type JwtPayload = {
    sub: string;
    role: string;
    exp: number;
    iat: number;
};

const emptyData: DashboardData = {
    totalItems: 0,
    totalStock: 0,
    lowStockItems: 0,
    fastMovingItems: 0,
    slowMovingItems: 0,
    totalInward: 0,
    totalOutward: 0,
    stockHealthPercentage: 0,
    stockLevels: [],
    movementTrend: [],
    recentTransactions: [],
    movementSummary: [],
};

function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value);
}

function StatIcon({ type }: { type: string }) {
    if (type === "stock") {
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Z" />
                <path d="M12 2v20M4 6.5l8 4.5 8-4.5" />
            </svg>
        );
    }

    if (type === "alert") {
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
        );
    }

    if (type === "fast") {
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M13 2 3 14h8l-1 8 11-14h-8l0-6Z" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 18h16" />
            <path d="M7 15V8" />
            <path d="M12 15V5" />
            <path d="M17 15v-9" />
        </svg>
    );
}

export default function Home() {
    const router = useRouter();

    // =========================================================
    // STATE
    // =========================================================

    const [data, setData] =
        useState<DashboardData>(emptyData);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [username, setUsername] =
        useState("");

    const [role, setRole] =
        useState("");

    const [profilePicture, setProfilePicture] =
        useState<string | null>(null);

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    // =========================================================
    // LOAD USER PROFILE
    // =========================================================

    useEffect(() => {
        let imageUrl: string | null = null;

        const loadUserProfile = async () => {
            const token =
                localStorage.getItem("token");

            if (!token) {
                console.log("No JWT token found");
                return;
            }

            try {
                const decoded =
                    jwtDecode<JwtPayload>(token);

                console.log(
                    "Decoded JWT:",
                    decoded
                );

                const currentUsername =
                    decoded.sub || "";

                setUsername(currentUsername);
                setRole(decoded.role || "");

                // =====================================================
                // LOAD PROFILE PICTURE
                // =====================================================

                if (currentUsername) {
                    try {
                        const pictureResponse =
                            await fetch(
                                `http://localhost:8080/api/auth/profile-picture?username=${encodeURIComponent(
                                    currentUsername
                                )}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                                }
                            );

                        if (pictureResponse.ok) {
                            const blob =
                                await pictureResponse.blob();

                            imageUrl =
                                URL.createObjectURL(blob);

                            setProfilePicture(
                                imageUrl
                            );
                        } else {
                            setProfilePicture(null);
                        }

                    } catch (error) {
                        console.log(
                            "No profile picture found."
                        );

                        setProfilePicture(null);
                    }
                }

            } catch (error) {
                console.error(
                    "Failed to load user profile:",
                    error
                );
            }
        };

        loadUserProfile();

        // Cleanup generated object URL
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, []);

    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const result =
                    await getDashboardData();

                setData(result);

            } catch (error) {
                console.error(
                    "Dashboard error:",
                    error
                );

                setError(
                    "Unable to load dashboard analytics."
                );

            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // =========================================================
    // FORMATTED ROLE
    // =========================================================

    const formattedRole =
        role
            ? role.replaceAll("_", " ")
            : "USER";

    // =========================================================
    // UNIQUE STOCK LEVELS
    // =========================================================
    //
    // Prevents the same item from appearing more than once
    // in Inventory Risk Analysis.
    //
    // itemCode is used as the unique identifier.
    // If itemCode is unavailable, itemName is used.
    //
    // =========================================================

    const uniqueStockLevels = useMemo(() => {
        const itemMap = new Map<
            string,
            typeof data.stockLevels[number]
        >();

        data.stockLevels.forEach((item) => {
            const key =
                item.itemCode ||
                item.itemName;

            if (!key) {
                return;
            }

            const existing =
                itemMap.get(key);

            if (!existing) {
                itemMap.set(key, item);
                return;
            }

            // If duplicate records exist for the same item,
            // keep the more serious status.
            const statusPriority = {
                LOW: 3,
                REORDER: 2,
                NORMAL: 1,
            };

            const existingPriority =
                statusPriority[
                existing.status as keyof typeof statusPriority
                ] || 0;

            const currentPriority =
                statusPriority[
                item.status as keyof typeof statusPriority
                ] || 0;

            if (
                currentPriority >
                existingPriority
            ) {
                itemMap.set(key, item);
            }
        });

        return Array.from(
            itemMap.values()
        );
    }, [data.stockLevels]);

    // =========================================================
    // LOW STOCK COUNT
    // =========================================================
    //
    // IMPORTANT:
    // The Low Stock card now uses exactly the same unique
    // item list used by Inventory Risk Analysis.
    //
    // Therefore the card and table cannot disagree because
    // of duplicate stock-level records.
    //
    // =========================================================

    const lowStockCount = useMemo(() => {
        return uniqueStockLevels.filter(
            (item) =>
                item.status === "LOW"
        ).length;
    }, [uniqueStockLevels]);

    // =========================================================
    // CHART DATA
    // =========================================================

    const movementChartData =
        useMemo(() => {
            return data.movementTrend.map(
                (item) => ({
                    month: item.month,
                    Inward: item.inward,
                    Outward: item.outward,
                })
            );
        }, [data.movementTrend]);

    const movementPieData =
        data.movementSummary.map((item) => ({
            name: item.type,
            value: item.quantity,
        }));

    // =========================================================
    // PERCENTAGES
    // =========================================================

    const totalMovement =
        data.totalInward +
        data.totalOutward;

    const inwardPercentage =
        totalMovement === 0
            ? 0
            : (data.totalInward /
                totalMovement) *
            100;

    const outwardPercentage =
        totalMovement === 0
            ? 0
            : (data.totalOutward /
                totalMovement) *
            100;

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        localStorage.removeItem("token");

        setShowLogoutModal(false);

        router.push("/login");
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-[#eef1f4] text-[#1d1d1d]">

            <main className="w-full px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

                <div className="mx-auto w-full max-w-[1600px]">

                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <header className="flex min-h-[60px] items-center justify-between border-b border-[#dfe3e7] pb-5">

                        <div className="text-2xl font-bold text-gray-1 sm:text-3xl lg:text-[2.1rem]">
                            Dashboard
                        </div>

                        <div className="flex items-center gap-3">

                            {/* Notification */}

                            <button
                                type="button"
                                className="rounded-full border border-[#dfe3e7] bg-white p-2.5 text-gray-2 transition hover:bg-[#f7f7f7]"
                                aria-label="Notifications"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                                    <path d="M10 21a2 2 0 0 0 4 0" />
                                </svg>
                            </button>

                            {/* ================================================= */}
                            {/* PROFILE */}
                            {/* ================================================= */}

                            <Link
                                href="/profile"
                                className="group flex items-center gap-3 rounded-xl border border-[#E0E0E0] bg-white px-4 py-2 transition-all duration-200 hover:border-[#953002] hover:shadow-sm"
                            >

                                {/* Profile Picture */}

                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#953002]/10 text-[#953002] transition group-hover:bg-[#953002] group-hover:text-white">

                                    {profilePicture ? (
                                        <img
                                            src={profilePicture}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle
                                            size={24}
                                        />
                                    )}

                                </div>

                                {/* User Details */}

                                <div className="hidden text-left sm:block">

                                    <p className="max-w-[120px] truncate text-xs font-semibold text-[#282828]">
                                        {username || "User"}
                                    </p>

                                    <p className="max-w-[120px] truncate text-[10px] font-medium uppercase tracking-wide text-[#953002]">
                                        {formattedRole}
                                    </p>

                                </div>

                            </Link>

                            {/* ================================================= */}
                            {/* LOGOUT */}
                            {/* ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLogoutModal(true)
                                }
                                className="rounded-xl border border-[#953002] bg-[#953002] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7d2801]"
                            >
                                Logout
                            </button>

                        </div>

                    </header>

                    {/* ================================================= */}
                    {/* WELCOME */}
                    {/* ================================================= */}

                    <section className="mt-6">

                        <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">

                            Welcome back{" "}

                            <span className="text-[#953002]">
                                {username || "User"}
                            </span>

                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Here's what's happening with your inventory today.
                        </p>

                    </section>

                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* ================================================= */}
                    {/* LOADING */}
                    {/* ================================================= */}

                    {loading && (
                        <div className="mt-6 rounded-2xl border border-[#dfe3e7] bg-white px-5 py-4 text-sm text-gray-500 shadow-sm">
                            Loading dashboard analytics...
                        </div>
                    )}

                    {/* ================================================= */}
                    {/* KPI CARDS */}
                    {/* ================================================= */}

                    <section className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                        {/* TOTAL ITEMS */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Total Items
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-gray-900">
                                        {formatNumber(
                                            data.totalItems
                                        )}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-500">
                                        Items registered in inventory
                                    </p>

                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3f4b5c] text-white">
                                    <StatIcon type="stock" />
                                </div>

                            </div>

                        </div>

                        {/* TOTAL STOCK */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Current Stock
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-gray-900">
                                        {formatNumber(
                                            data.totalStock
                                        )}
                                    </p>

                                    <p className="mt-2 text-xs text-emerald-600">
                                        Current available quantity
                                    </p>

                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#19a982] text-white">
                                    <StatIcon type="stock" />
                                </div>

                            </div>

                        </div>

                        {/* LOW STOCK */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Low Stock
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-[#dc5b32]">
                                        {formatNumber(
                                            lowStockCount
                                        )}
                                    </p>

                                    <p className="mt-2 text-xs text-red-500">
                                        Items requiring attention
                                    </p>

                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dc5b32] text-white">
                                    <StatIcon type="alert" />
                                </div>

                            </div>

                        </div>

                        {/* FAST MOVING */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Fast Moving
                                    </p>

                                    <p className="mt-3 text-3xl font-bold text-[#2868b2]">
                                        {formatNumber(
                                            data.fastMovingItems
                                        )}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-500">
                                        High demand inventory
                                    </p>

                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2868b2] text-white">
                                    <StatIcon type="fast" />
                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* ANALYTICAL SUMMARY */}
                    {/* ================================================= */}

                    <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

                        {/* INWARD */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Total Inward
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                                        {formatNumber(
                                            data.totalInward
                                        )}
                                    </p>

                                </div>

                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                                    IN
                                </span>

                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

                                <div
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                    style={{
                                        width: `${inwardPercentage}%`,
                                    }}
                                />

                            </div>

                        </div>

                        {/* OUTWARD */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Total Outward
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-[#dc5b6a]">
                                        {formatNumber(
                                            data.totalOutward
                                        )}
                                    </p>

                                </div>

                                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                                    OUT
                                </span>

                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

                                <div
                                    className="h-full rounded-full bg-[#dc5b6a] transition-all duration-500"
                                    style={{
                                        width: `${outwardPercentage}%`,
                                    }}
                                />

                            </div>

                        </div>

                        {/* STOCK HEALTH */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Inventory Health
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-[#2868b2]">
                                        {
                                            data.stockHealthPercentage
                                        }%
                                    </p>

                                </div>

                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                    HEALTH
                                </span>

                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

                                <div
                                    className="h-full rounded-full bg-[#2868b2] transition-all duration-500"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                data.stockHealthPercentage
                                            )
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* CHARTS */}
                    {/* ================================================= */}

                    <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

                        {/* MOVEMENT TREND */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm xl:col-span-2">

                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        Stock Movement Trend
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Inventory movement over the last six months
                                    </p>

                                </div>

                                <div className="flex gap-4 text-xs">

                                    <span className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                        Inward
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#dc5b6a]" />
                                        Outward
                                    </span>

                                </div>

                            </div>

                            <div className="h-[280px] sm:h-[300px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <LineChart
                                        data={
                                            movementChartData
                                        }
                                        margin={{
                                            top: 5,
                                            right: 10,
                                            left: -15,
                                            bottom: 5,
                                        }}
                                    >

                                        <CartesianGrid
                                            vertical={false}
                                            stroke="#edf0f2"
                                            strokeDasharray="4 4"
                                        />

                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 11,
                                                fill: "#7b8188",
                                            }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 11,
                                                fill: "#7b8188",
                                            }}
                                        />

                                        <Tooltip />

                                        <Line
                                            type="monotone"
                                            dataKey="Inward"
                                            stroke="#19a982"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            activeDot={{
                                                r: 6,
                                            }}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="Outward"
                                            stroke="#dc5b6a"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                            activeDot={{
                                                r: 6,
                                            }}
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>

                        </div>

                        {/* MOVEMENT DISTRIBUTION */}

                        <div className="rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm">

                            <div>

                                <h3 className="text-lg font-bold text-gray-900">
                                    Movement Distribution
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Overall inward vs outward quantity
                                </p>

                            </div>

                            <div className="h-[240px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={
                                                movementPieData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={4}
                                        >

                                            {movementPieData.map(
                                                (_, index) => (
                                                    <Cell
                                                        key={
                                                            index
                                                        }
                                                        fill={
                                                            index ===
                                                                0
                                                                ? "#19a982"
                                                                : "#dc5b6a"
                                                        }
                                                    />
                                                )
                                            )}

                                        </Pie>

                                        <Tooltip />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                            <div className="space-y-3">

                                {data.movementSummary.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            key={`${item.type ?? "UNKNOWN"}-${index}`}
                                            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                                        >

                                            <div className="flex items-center gap-3">

                                                <span
                                                    className={`h-3 w-3 shrink-0 rounded-full ${item.type ===
                                                            "INWARD"
                                                            ? "bg-emerald-500"
                                                            : "bg-[#dc5b6a]"
                                                        }`}
                                                />

                                                <span className="text-sm font-medium text-gray-700">
                                                    {
                                                        item.type
                                                    }
                                                </span>

                                            </div>

                                            <span className="text-sm font-bold text-gray-900">
                                                {formatNumber(
                                                    item.quantity
                                                )}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* STOCK LEVELS / INVENTORY RISK ANALYSIS */}
                    {/* ================================================= */}

                    <section className="mt-6 rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm">

                        <div className="mb-5">

                            <h3 className="text-lg font-bold text-gray-900">
                                Inventory Risk Analysis
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Items requiring attention based on current stock levels
                            </p>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full text-left">

                                <thead className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">

                                    <tr>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Item
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Current Stock
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Minimum
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Reorder
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {uniqueStockLevels.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <tr
                                                key={`${item.itemCode ?? item.itemName ?? "unknown"}-${index}`}
                                                className="border-b border-gray-50 transition hover:bg-gray-50"
                                            >

                                                <td className="px-4 py-4">

                                                    <div className="min-w-[180px]">

                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {
                                                                item.itemName
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {
                                                                item.itemCode ??
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </div>

                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold">
                                                    {formatNumber(
                                                        item.currentStock
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                                    {formatNumber(
                                                        item.minimumLevel
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                                    {formatNumber(
                                                        item.reorderLevel
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-bold ${item.status ===
                                                                "LOW"
                                                                ? "bg-red-50 text-red-600"
                                                                : item.status ===
                                                                    "REORDER"
                                                                    ? "bg-orange-50 text-orange-600"
                                                                    : "bg-emerald-50 text-emerald-600"
                                                            }`}
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                    {uniqueStockLevels.length ===
                                        0 && (
                                            <tr>

                                                <td
                                                    colSpan={5}
                                                    className="py-10 text-center text-sm text-gray-400"
                                                >
                                                    No inventory risk items available.
                                                </td>

                                            </tr>
                                        )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                    {/* ================================================= */}
                    {/* RECENT TRANSACTIONS */}
                    {/* ================================================= */}

                    <section className="mt-6 rounded-2xl border border-[#dfe3e7] bg-white p-5 shadow-sm">

                        <div className="mb-5">

                            <h3 className="text-lg font-bold text-gray-900">
                                Recent Stock Activity
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Latest inventory transactions recorded in the bin card
                            </p>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="min-w-full text-left">

                                <thead className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400">

                                    <tr>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Date
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Item
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Type
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Reference
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Quantity
                                        </th>

                                        <th className="whitespace-nowrap px-4 py-3">
                                            Balance
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {data.recentTransactions.map(
                                        (
                                            txn,
                                            index
                                        ) => (

                                            <tr
                                                key={`${txn.reference}-${txn.itemCode}-${index}`}
                                                className="border-b border-gray-50 hover:bg-gray-50"
                                            >

                                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                                    {txn.date}
                                                </td>

                                                <td className="px-4 py-4">

                                                    <div className="min-w-[180px]">

                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {
                                                                txn.itemName
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {
                                                                txn.itemCode
                                                            }
                                                        </p>

                                                    </div>

                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-bold ${txn.type ===
                                                                "INWARD"
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-red-50 text-red-600"
                                                            }`}
                                                    >
                                                        {
                                                            txn.type
                                                        }
                                                    </span>

                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
                                                    {
                                                        txn.reference
                                                    }
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold">
                                                    {formatNumber(
                                                        txn.quantity
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-700">
                                                    {formatNumber(
                                                        txn.balance
                                                    )}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                    {data.recentTransactions
                                        .length ===
                                        0 && (
                                            <tr>

                                                <td
                                                    colSpan={
                                                        6
                                                    }
                                                    className="py-10 text-center text-sm text-gray-400"
                                                >
                                                    No transactions
                                                    available.
                                                </td>

                                            </tr>
                                        )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </div>

            </main>

            {/* ========================================================= */}
            {/* LOGOUT MODAL */}
            {/* ========================================================= */}

            {showLogoutModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">

                            <svg
                                viewBox="0 0 24 24"
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M10 17l5-5-5-5" />
                                <path d="M15 12H3" />
                                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                            </svg>

                        </div>

                        <h2 className="mt-4 text-center text-xl font-bold text-gray-800">
                            Confirm Logout
                        </h2>

                        <p className="mt-2 text-center text-sm text-gray-500">
                            Are you sure you want to logout from your account?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={() =>
                                    setShowLogoutModal(
                                        false
                                    )
                                }
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                No, Stay
                            </button>

                            <button
                                onClick={handleLogout}
                                className="rounded-xl bg-[#953002] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7d2801] hover:shadow-md"
                            >
                                Yes, Logout
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}