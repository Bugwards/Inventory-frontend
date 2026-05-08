import React, { ChangeEvent } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface Option {
  value?: string | number;
  label?: string | number;
}

interface FormInputProps {
  type?: string;
  label?: string;
  icon?: IconType;
  options?: any[];
  value?: any;
  onChange?: (e: any) => void;
  placeholder?: string;
}

export default function FormInput({ 
  type = 'text', 
  label, 
  icon: Icon, 
  options = [], 
  value, 
  onChange,
  placeholder = ''
}: FormInputProps) {
  if (type === 'checkbox') {
    return (
      <div className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-full bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer w-fit">
        <label className="text-sm font-bold text-gray-500 cursor-pointer">{label}</label>
        <div className="relative flex items-center">
          <input 
            type="checkbox" 
            checked={value}
            onChange={onChange}
            className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer accent-orange-500" 
          />
        </div>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden shadow-sm h-12 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400 transition-all">
        {/* Label Part */}
        <div className="flex items-center gap-2 px-4 border-r border-gray-300 bg-white h-full min-w-[160px]">
          {Icon && <Icon className="text-gray-400" size={18} />}
          <span className="text-sm font-bold text-gray-500">{label}</span>
        </div>
        {/* Select Part */}
        <div className="relative flex-1 h-full">
          <select 
            value={value}
            onChange={onChange}
            className="w-full h-full pl-4 pr-10 appearance-none bg-transparent outline-none text-gray-700 text-sm font-medium cursor-pointer"
          >
            <option value="" disabled className="text-gray-400">{placeholder}</option>
            {options.map((opt, i) => (
              <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
          </select>
          <div className="absolute right-0 top-0 h-full px-3 flex items-center bg-gray-200 pointer-events-none border-l border-gray-300">
            <FiChevronDown className="text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden shadow-sm h-12 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400 transition-all">
      {label && (
        <div className="flex items-center gap-2 px-4 border-r border-gray-300 bg-white h-full min-w-[160px]">
          {Icon && <Icon className="text-gray-400" size={18} />}
          <span className="text-sm font-bold text-gray-500">{label}</span>
        </div>
      )}
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 h-full px-4 outline-none text-gray-700 text-sm font-medium bg-transparent"
      />
    </div>
  );
}
