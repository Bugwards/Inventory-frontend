"use client";

import {
  LayoutDashboard,
  Package,
  Boxes,
  BookOpen,
  Send,
  RefreshCcw,
  ClipboardList,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Item Master",
    href: "/item-master",
    icon: Package,
  },
  {
    label: "Stock & Bin Card",
    href: "/stock-bin-card",
    icon: Boxes,
  },
  {
    label: "Goods Received",
    href: "/goods-received",
    icon: BookOpen,
  },
  {
    label: "Distribution",
    href: "/distribution",
    icon: Send,
  },
  {
    label: "Stock Transfer",
    href: "/stock-transfer",
    icon: RefreshCcw,
  },
  {
    label: "Stock Issue",
    href: "/stock-issue",
    icon: ClipboardList,
  },
  {
    label: "Stock Receipt",
    href: "/stock-receipt",
    icon: Receipt,
  },
];

export default function InventorySidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white shadow-xl">
      {/* LOGO */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
          <Boxes size={20} />
        </div>

        <div>
          <h1 className="text-sm font-bold text-slate-900">
            Inventory System
          </h1>
          <p className="text-xs text-slate-500">Enterprise Management</p>
        </div>
      </div>

      {/* MENU */}
      <nav className="mt-4 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* CURRENT ROLE */}
      <div className="absolute bottom-5 left-3 right-3 rounded-xl border border-teal-100 bg-teal-50 p-4">
        <p className="text-xs font-semibold text-slate-600">Current Role</p>
        <p className="mt-1 text-sm font-bold text-teal-700">Store</p>
      </div>
    </aside>
  );
}