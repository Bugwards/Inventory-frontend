"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";

type Props = {
  children: React.ReactNode;
};

const tabs = [
  {
    label: "Re Order Item Balance",
    href: "/reorder-items",
  },
  {
    label: "View Item Balance",
    href: "/report",
  },
];

export default function ReportsLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <RoleGuard requiredRole="Admin" currentRole="Admin">

            {/* PAGE TITLE */}
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-800">
                Reports &amp; Audit Logs
              </h1>
              <p className="text-sm text-gray-500">
                Generate reports and view system activity
              </p>
            </div>

            {/* SUB NAVBAR */}
            <div className="flex border-b border-gray-200 mb-6">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <button
                    key={tab.href}
                    onClick={() => router.push(tab.href)}
                    className={`
                      px-5 py-2.5 text-sm font-medium transition-colors
                      border-b-2 -mb-px
                      ${
                        isActive
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* PAGE CONTENT */}
            {children}

          </RoleGuard>
        </main>
      </div>
    </div>
  );
}