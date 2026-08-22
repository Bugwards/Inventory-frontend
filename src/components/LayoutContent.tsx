"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const hideSidebar =
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/signup";

    return (
        <div className="flex min-h-screen w-full">
            {!hideSidebar && <Sidebar />}

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}