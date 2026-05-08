import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: IconType;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  icon: Icon, 
  variant = 'primary',
  className = ''
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-200 shadow-md";
  
  const variants = {
    primary: "bg-[#9e5e3b] hover:bg-[#854d2f] text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    outline: "border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-transparent shadow-none"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
