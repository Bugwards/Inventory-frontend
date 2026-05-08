import React from 'react';
import { FiBell, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <FiBell size={20} className="text-gray-500 hover:text-gray-700 transition-colors" />
          <span className="absolute -top-1.5 -right-1.5 bg-orange-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-gray-800 leading-tight">Test</span>
          <span className="text-xs text-gray-400">IT Division</span>
        </div>

        {/* Logout */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <FiLogOut size={20} />
        </button>
      </div>
    </div>
  );
}
