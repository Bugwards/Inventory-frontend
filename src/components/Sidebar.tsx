import React from 'react';
import { 
  FiGrid, 
  FiBox, 
  FiArchive, 
  FiFileText, 
  FiSend, 
  FiBarChart2, 
  FiFilePlus 
} from 'react-icons/fi';
import { HiOutlineCube } from 'react-icons/hi';

const menuItems = [
  { name: 'Dashboard', icon: FiGrid },
  { name: 'Item Master', icon: HiOutlineCube },
  { name: 'Stock & Bin Card', icon: FiArchive },
  { name: 'Goods Received', icon: FiFilePlus },
  { name: 'Requests', icon: FiFileText },
  { name: 'Distribution', icon: FiSend },
  { name: 'Reports & Audit', icon: FiBarChart2, active: true },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col pt-4 pb-6 px-4">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="bg-orange-500 text-white p-2 rounded-md">
          <HiOutlineCube size={24} />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-sm leading-tight">Inventory System</h1>
          <p className="text-xs text-gray-400">Enterprise Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                item.active
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md shadow-orange-200/50'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          );
        })}
      </nav>

      {/* Current Role */}
      <div className="mt-auto bg-teal-50/50 border border-teal-100 rounded-xl p-4">
        <p className="text-xs text-gray-500 font-medium">Current Role</p>
        <p className="text-sm font-bold text-orange-600 mt-0.5">Admin</p>
      </div>
    </div>
  );
}
