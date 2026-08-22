"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import {
    LayoutDashboard,
    Box,
    NotepadText,
    ClipboardClock,
    StickyNotePlus,
    LayerArrowUp,
    LayersArrowUp,
    TicketCheck,
    ClipboardMinus,
} from "lucide-react";

import { FiMenu, FiX } from "react-icons/fi";

import {
    MdInventory2,
} from "react-icons/md";

const navItems = [
    "Dashboard",
    "Item Master",
    "GRN",
    "Bin Card",
    "Opening Stock",
    "Stock Adjustment",
    "Stock Issue",
    "Stock Transfer",
    "Stock Receipt",
    "Report & Audit",
] as const;

type JwtPayload = {
    sub: string;
    role: string;
    exp: number;
    iat: number;
};

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname() || "/dashboard";

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    // Mobile sidebar state
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // ============================================================
    // GET CURRENT USER FROM JWT
    // ============================================================

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);

            setUsername(decoded.sub || "");
            setRole(decoded.role || "");
        } catch (error) {
            console.error("Failed to decode JWT:", error);
        }
    }, []);

    // ============================================================
    // FETCH PROFILE PICTURE
    // ============================================================

    useEffect(() => {
        const fetchProfilePicture = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const decoded = jwtDecode<JwtPayload>(token);

                const username = decoded.sub;

                if (!username) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:8080/api/auth/profile-picture?username=${encodeURIComponent(username)}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    setProfilePicture(null);
                    return;
                }

                const blob = await response.blob();

                const imageUrl = URL.createObjectURL(blob);

                setProfilePicture(imageUrl);
            } catch (error) {
                console.error(
                    "Failed to load profile picture:",
                    error
                );

                setProfilePicture(null);
            }
        };

        fetchProfilePicture();
    }, []);

    // ============================================================
    // CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
    // ============================================================

    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [pathname]);

    // ============================================================
    // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR IS OPEN
    // ============================================================

    useEffect(() => {
        if (mobileSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileSidebarOpen]);

    // ============================================================
    // ROUTES
    // ============================================================

    const getPath = (item: (typeof navItems)[number]) => {
        const paths = {
            Dashboard: "/dashboard",
            "Item Master": "/item-master",
            GRN: "/grn",
            "Bin Card": "/bin-card",
            "Opening Stock": "/opening-stock",
            "Stock Adjustment": "/stock-adjustment",
            "Stock Issue": "/stock-issue",
            "Stock Transfer": "/Stock-Transfer",
            "Stock Receipt": "/Stock-Receipt",
            "Report & Audit": "/report-audit",
        };

        return paths[item];
    };

    // ============================================================
    // ICONS
    // ============================================================

    const getIcon = (item: (typeof navItems)[number]) => {
        const icons = {
            Dashboard: <LayoutDashboard />,
            "Item Master": <Box />,
            GRN: <NotepadText />,
            "Bin Card": <ClipboardClock />,
            "Opening Stock": <MdInventory2 />,
            "Stock Adjustment": <StickyNotePlus />,
            "Stock Issue": <LayerArrowUp />,
            "Stock Transfer": <LayersArrowUp />,
            "Stock Receipt": <TicketCheck />,
            "Report & Audit": <ClipboardMinus />,
        };

        return icons[item];
    };

    // ============================================================
    // ROLE
    // ============================================================

    const formattedRole = role
        ? role.replaceAll("_", " ")
        : "User";

    // ============================================================
    // NAVIGATION HANDLER
    // ============================================================

    const handleNavigation = (path: string) => {
        router.push(path);
        setMobileSidebarOpen(false);
    };

    return (
        <>
            {/* ========================================================= */}
            {/* MOBILE MENU BUTTON                                        */}
            {/* Only visible below md                                     */}
            {/* ========================================================= */}

            {!mobileSidebarOpen && (
                <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(true)}
                    aria-label="Open navigation menu"
                    className="
                        fixed
                        left-4
                        top-4
                        z-[60]
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary
                        text-white
                        shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                        transition-all
                        duration-300
                        hover:scale-105
                        hover:bg-primary/90
                        active:scale-95
                        md:hidden
                    "
                >
                    <FiMenu className="h-6 w-6" />
                </button>
            )}

            {/* ========================================================= */}
            {/* MOBILE BACKDROP                                            */}
            {/* ========================================================= */}

            {mobileSidebarOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        backdrop-blur-[2px]
                        md:hidden
                    "
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ========================================================= */}
            {/* MOBILE SIDEBAR                                              */}
            {/* ========================================================= */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-[108px]
                    shrink-0
                    flex-col
                    bg-primary
                    border-r
                    border-white/10
                    shadow-[4px_0_25px_rgba(0,0,0,0.25)]
                    transition-transform
                    duration-300
                    ease-out
                    md:hidden
                    ${mobileSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                {/* ================================================= */}
                {/* MOBILE CLOSE BUTTON                               */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-label="Close navigation menu"
                    className="
                        absolute
                        -right-12
                        top-4
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary
                        text-white
                        shadow-lg
                        transition-all
                        duration-200
                        hover:bg-primary/90
                        active:scale-95
                    "
                >
                    <FiX className="h-5 w-5" />
                </button>

                {/* ================================================= */}
                {/* MOBILE LOGO                                       */}
                {/* ================================================= */}

                <div className="relative">
                    <div
                        className="
                            flex
                            h-[72px]
                            w-full
                            items-center
                            justify-center
                            border-b
                            border-white/10
                        "
                    >
                        <div
                            className="
                                group
                                flex
                                h-11
                                w-11
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#FFB401]
                                text-primary
                                shadow-lg
                                shadow-black/20
                                transition-all
                                duration-300
                                hover:scale-110
                                hover:rotate-2
                                hover:shadow-[0_8px_25px_rgba(255,180,1,0.35)]
                            "
                            title="Inventory Management System"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="
                                    h-6
                                    w-6
                                    transition-transform
                                    duration-300
                                    group-hover:scale-110
                                "
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Z" />
                                <path d="M12 2v20M4 6.5l8 4.5 8-4.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* MOBILE NAVIGATION                                */}
                {/* ================================================= */}

                <nav
                    className="
                        mt-6
                        flex-1
                        overflow-y-auto
                        overflow-x-visible
                        px-2
                        py-2
                    "
                >
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const path = getPath(item);

                            const active =
                                pathname === path ||
                                pathname.startsWith(path + "/");

                            const hovered = hoveredItem === item;

                            return (
                                <div
                                    key={item}
                                    className="relative"
                                    onMouseEnter={() =>
                                        setHoveredItem(item)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredItem(null)
                                    }
                                >
                                    {/* TOOLTIP */}

                                    {hovered && (
                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-[100px]
                                                top-1/2
                                                z-[70]
                                                -translate-y-1/2
                                                whitespace-nowrap
                                                rounded-lg
                                                bg-[#1f2937]
                                                px-3
                                                py-2
                                                text-xs
                                                font-semibold
                                                text-white
                                                shadow-xl
                                                animate-in
                                                fade-in
                                                slide-in-from-left-1
                                                duration-150
                                            "
                                        >
                                            {item}

                                            <span
                                                className="
                                                    absolute
                                                    left-[-4px]
                                                    top-1/2
                                                    h-2
                                                    w-2
                                                    -translate-y-1/2
                                                    rotate-45
                                                    bg-[#1f2937]
                                                "
                                            />
                                        </div>
                                    )}

                                    {/* NAV BUTTON */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(path)
                                        }
                                        className={`
                                            group
                                            relative
                                            flex
                                            w-full
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-xl
                                            px-1
                                            py-3
                                            transition-all
                                            duration-200
                                            ease-out

                                            ${active
                                                ? `
                                                        bg-[#f0f0f0]
                                                        text-primary
                                                        shadow-[0_8px_22px_rgba(0,0,0,0.18)]
                                                    `
                                                : `
                                                        text-white/70
                                                        hover:-translate-y-1
                                                        hover:bg-white/10
                                                        hover:text-white
                                                        hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                                                    `
                                            }
                                        `}
                                    >
                                        {/* ACTIVE INDICATOR */}

                                        <span
                                            className={`
                                                absolute
                                                left-0
                                                top-1/2
                                                h-0
                                                w-[3px]
                                                -translate-y-1/2
                                                rounded-r-full
                                                bg-[#FFB401]
                                                transition-all
                                                duration-300
                                                ${active
                                                    ? "h-10 opacity-100"
                                                    : "opacity-0"
                                                }
                                            `}
                                        />

                                        {/* ICON */}

                                        <span
                                            className={`
                                                relative
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                text-[20px]
                                                transition-all
                                                duration-300
                                                ease-out

                                                ${active
                                                    ? `
                                                            bg-primary
                                                            text-white
                                                            shadow-[0_5px_15px_rgba(149,48,2,0.3)]
                                                        `
                                                    : `
                                                            bg-white/5
                                                            text-white/75
                                                            group-hover:scale-110
                                                            group-hover:bg-white/15
                                                            group-hover:text-[#FFB401]
                                                            group-hover:rotate-2
                                                        `
                                                }
                                            `}
                                        >
                                            {getIcon(item)}

                                            {/* Notification dots */}

                                            {(item === "GRN" ||
                                                item === "Stock Receipt" ||
                                                item === "Stock Issue") && (
                                                    <span
                                                        className="
                                                        absolute
                                                        -right-1
                                                        -top-1
                                                        h-2.5
                                                        w-2.5
                                                        rounded-full
                                                        bg-[#FFB401]
                                                        ring-2
                                                        ring-primary
                                                        transition-all
                                                        duration-200
                                                        group-hover:scale-125
                                                        group-hover:shadow-[0_0_8px_rgba(255,180,1,0.8)]
                                                    "
                                                    />
                                                )}
                                        </span>

                                        {/* LABEL */}

                                        <span
                                            className={`
                                                mt-2
                                                max-w-[88px]
                                                text-center
                                                text-[10px]
                                                font-semibold
                                                leading-tight
                                                transition-all
                                                duration-200

                                                ${active
                                                    ? "text-primary"
                                                    : "text-white/70 group-hover:text-white"
                                                }

                                                ${hovered
                                                    ? "tracking-wide"
                                                    : ""
                                                }
                                            `}
                                        >
                                            {item}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* ================================================= */}
                {/* MOBILE USER SECTION                              */}
                {/* ================================================= */}

                <div
                    className="
                        border-t
                        border-white/10
                        p-2
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation("/profile")
                        }
                        className="
                            group
                            relative
                            w-full
                            cursor-pointer
                            rounded-xl
                            border
                            border-white/10
                            bg-white/5
                            p-2
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:border-white/20
                            hover:bg-white/10
                            hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]
                        "
                    >
                        {/* Avatar */}

                        <div className="flex justify-center">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="
                                        h-15
                                        w-15
                                        rounded-full
                                        object-cover
                                        shadow-md
                                        transition-all
                                        duration-300
                                        group-hover:scale-110
                                        group-hover:rotate-3
                                    "
                                />
                            ) : (
                                <div
                                    className="
                                        flex
                                        h-15
                                        w-15
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#FFB401]
                                        text-sm
                                        font-bold
                                        uppercase
                                        text-primary
                                        shadow-md
                                        transition-all
                                        duration-300
                                        group-hover:scale-110
                                        group-hover:rotate-3
                                    "
                                >
                                    {username
                                        ? username.charAt(0)
                                        : "U"}
                                </div>
                            )}
                        </div>

                        {/* Name */}

                        <div className="mt-2 text-center">
                            <p
                                className="
                                    truncate
                                    text-[10px]
                                    font-semibold
                                    text-white
                                    transition-colors
                                    duration-200
                                    group-hover:text-[#FFB401]
                                "
                            >
                                {username || "User"}
                            </p>

                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-[9px]
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-[#FFB401]
                                "
                            >
                                {formattedRole}
                            </p>
                        </div>

                        {/* Online indicator */}

                        <span
                            className="
                                absolute
                                right-2
                                top-2
                                h-2
                                w-2
                                rounded-full
                                bg-[#FFB401]
                                ring-2
                                ring-primary
                                transition-transform
                                duration-200
                                group-hover:scale-125
                            "
                        />
                    </button>
                </div>
            </aside>

            {/* ========================================================= */}
            {/* DESKTOP SIDEBAR                                             */}
            {/* Existing sidebar — functionality preserved                 */}
            {/* ========================================================= */}

            <aside
                className="
                    hidden
                    md:flex
                    w-[108px]
                    shrink-0
                    flex-col
                    bg-primary
                    border-r
                    border-white/10
                    shadow-[4px_0_25px_rgba(0,0,0,0.12)]
                    relative
                    z-30
                "
            >
                {/* ================================================= */}
                {/* LOGO                                             */}
                {/* ================================================= */}

                <div className="relative">
                    <div
                        className="
                            flex
                            h-[72px]
                            w-full
                            items-center
                            justify-center
                            border-b
                            border-white/10
                        "
                    >
                        <div
                            className="
                                group
                                flex
                                h-11
                                w-11
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#FFB401]
                                text-primary
                                shadow-lg
                                shadow-black/20
                                transition-all
                                duration-300
                                hover:scale-110
                                hover:rotate-2
                                hover:shadow-[0_8px_25px_rgba(255,180,1,0.35)]
                            "
                            title="Inventory Management System"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="
                                    h-6
                                    w-6
                                    transition-transform
                                    duration-300
                                    group-hover:scale-110
                                "
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Z" />
                                <path d="M12 2v20M4 6.5l8 4.5 8-4.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* NAVIGATION                                       */}
                {/* ================================================= */}

                <nav
                    className="
                        mt-6
                        flex-1
                        overflow-y-auto
                        overflow-x-visible
                        px-2
                        py-2
                    "
                >
                    <div className="space-y-2">
                        {navItems.map((item) => {
                            const path = getPath(item);

                            const active =
                                pathname === path ||
                                pathname.startsWith(path + "/");

                            const hovered = hoveredItem === item;

                            return (
                                <div
                                    key={item}
                                    className="relative"
                                    onMouseEnter={() =>
                                        setHoveredItem(item)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredItem(null)
                                    }
                                >
                                    {/* TOOLTIP */}

                                    {hovered && (
                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-[100px]
                                                top-1/2
                                                z-50
                                                -translate-y-1/2
                                                whitespace-nowrap
                                                rounded-lg
                                                bg-[#1f2937]
                                                px-3
                                                py-2
                                                text-xs
                                                font-semibold
                                                text-white
                                                shadow-xl
                                                animate-in
                                                fade-in
                                                slide-in-from-left-1
                                                duration-150
                                            "
                                        >
                                            {item}

                                            <span
                                                className="
                                                    absolute
                                                    left-[-4px]
                                                    top-1/2
                                                    h-2
                                                    w-2
                                                    -translate-y-1/2
                                                    rotate-45
                                                    bg-[#1f2937]
                                                "
                                            />
                                        </div>
                                    )}

                                    {/* NAV BUTTON */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(path)
                                        }
                                        className={`
                                            group
                                            relative
                                            flex
                                            w-full
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-xl
                                            px-1
                                            py-3
                                            transition-all
                                            duration-200
                                            ease-out

                                            ${active
                                                ? `
                                                        bg-[#f0f0f0]
                                                        text-primary
                                                        shadow-[0_8px_22px_rgba(0,0,0,0.18)]
                                                    `
                                                : `
                                                        text-white/70
                                                        hover:-translate-y-1
                                                        hover:bg-white/10
                                                        hover:text-white
                                                        hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                                                    `
                                            }
                                        `}
                                    >
                                        {/* ACTIVE INDICATOR */}

                                        <span
                                            className={`
                                                absolute
                                                left-0
                                                top-1/2
                                                h-0
                                                w-[3px]
                                                -translate-y-1/2
                                                rounded-r-full
                                                bg-[#FFB401]
                                                transition-all
                                                duration-300
                                                ${active
                                                    ? "h-10 opacity-100"
                                                    : "opacity-0"
                                                }
                                            `}
                                        />

                                        {/* ICON */}

                                        <span
                                            className={`
                                                relative
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                text-[20px]
                                                transition-all
                                                duration-300
                                                ease-out

                                                ${active
                                                    ? `
                                                            bg-primary
                                                            text-white
                                                            shadow-[0_5px_15px_rgba(149,48,2,0.3)]
                                                        `
                                                    : `
                                                            bg-white/5
                                                            text-white/75
                                                            group-hover:scale-110
                                                            group-hover:bg-white/15
                                                            group-hover:text-[#FFB401]
                                                            group-hover:rotate-2
                                                        `
                                                }
                                            `}
                                        >
                                            {getIcon(item)}

                                            {/* Notification dots */}

                                            {(item === "GRN" ||
                                                item === "Stock Receipt" ||
                                                item === "Stock Issue") && (
                                                    <span
                                                        className="
                                                        absolute
                                                        -right-1
                                                        -top-1
                                                        h-2.5
                                                        w-2.5
                                                        rounded-full
                                                        bg-[#FFB401]
                                                        ring-2
                                                        ring-primary
                                                        transition-all
                                                        duration-200
                                                        group-hover:scale-125
                                                        group-hover:shadow-[0_0_8px_rgba(255,180,1,0.8)]
                                                    "
                                                    />
                                                )}
                                        </span>

                                        {/* LABEL */}

                                        <span
                                            className={`
                                                mt-2
                                                max-w-[88px]
                                                text-center
                                                text-[10px]
                                                font-semibold
                                                leading-tight
                                                transition-all
                                                duration-200

                                                ${active
                                                    ? "text-primary"
                                                    : "text-white/70 group-hover:text-white"
                                                }

                                                ${hovered
                                                    ? "tracking-wide"
                                                    : ""
                                                }
                                            `}
                                        >
                                            {item}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* ================================================= */}
                {/* USER SECTION                                     */}
                {/* ================================================= */}

                <div
                    className="
                        border-t
                        border-white/10
                        p-2
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/profile")
                        }
                        className="
                            group
                            relative
                            w-full
                            cursor-pointer
                            rounded-xl
                            border
                            border-white/10
                            bg-white/5
                            p-2
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:border-white/20
                            hover:bg-white/10
                            hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]
                        "
                    >
                        {/* Avatar */}

                        <div className="flex justify-center">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="
                                        h-15
                                        w-15
                                        rounded-full
                                        object-cover
                                        shadow-md
                                        transition-all
                                        duration-300
                                        group-hover:scale-110
                                        group-hover:rotate-3
                                    "
                                />
                            ) : (
                                <div
                                    className="
                                        flex
                                        h-15
                                        w-15
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#FFB401]
                                        text-sm
                                        font-bold
                                        uppercase
                                        text-primary
                                        shadow-md
                                        transition-all
                                        duration-300
                                        group-hover:scale-110
                                        group-hover:rotate-3
                                    "
                                >
                                    {username
                                        ? username.charAt(0)
                                        : "U"}
                                </div>
                            )}
                        </div>

                        {/* Name */}

                        <div className="mt-2 text-center">
                            <p
                                className="
                                    truncate
                                    text-[10px]
                                    font-semibold
                                    text-white
                                    transition-colors
                                    duration-200
                                    group-hover:text-[#FFB401]
                                "
                            >
                                {username || "User"}
                            </p>

                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-[9px]
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-[#FFB401]
                                "
                            >
                                {formattedRole}
                            </p>
                        </div>

                        {/* Online indicator */}

                        <span
                            className="
                                absolute
                                right-2
                                top-2
                                h-2
                                w-2
                                rounded-full
                                bg-[#FFB401]
                                ring-2
                                ring-primary
                                transition-transform
                                duration-200
                                group-hover:scale-125
                            "
                        />
                    </button>
                </div>
            </aside>
        </>
    );
}