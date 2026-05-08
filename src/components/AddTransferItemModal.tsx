import React from 'react';

interface AddTransferItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

export default function AddTransferItemModal({ isOpen, onClose, onAdd }: AddTransferItemModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-center">
          <h2 className="text-xl font-bold text-gray-800">Add Transfer Item</h2>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Item Group */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Item Group <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter item group" 
              className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all text-sm"
            />
          </div>

          {/* Item Code */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Item Code <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter item code" 
              className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all text-sm"
            />
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter item name" 
              className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter description" 
              className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all text-sm"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g., pcs, kg, m" 
              className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all text-sm"
            />
          </div>

          {/* Transfer Qty */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Transfer Qty <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter quantity" 
              className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-4">
          <button 
            onClick={() => onAdd({})}
            className="flex-1 bg-[#8c2b17] hover:bg-[#732212] text-white font-semibold py-2.5 rounded transition-colors shadow-sm"
          >
            Add Item
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-[#d1d5db] hover:bg-[#9ca3af] text-gray-700 font-semibold py-2.5 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
