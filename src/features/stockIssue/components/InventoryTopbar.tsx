"use client";

import { Bell, LogOut } from "lucide-react";

export default function InventoryTopbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-end border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="relative">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
            1
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">Jiku</p>
          <p className="text-xs text-slate-500">Store Division</p>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}