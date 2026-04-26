"use client";
import React, { useState } from 'react';
import { FiUser, FiLock, FiChevronDown, FiArrowRight, FiMail, FiMapPin } from 'react-icons/fi';
import { FaUserCog } from 'react-icons/fa';
import { BiBuildings } from 'react-icons/bi';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative px-4"
      style={{
        backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 2px)',
        backgroundSize: '30px 30px'
      }}
    >
      {/* Main Card */}
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl shadow-gray-200/50 relative mt-12 mb-12 border border-gray-100">
        
        {/* Floating Icon */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white p-4 rounded-[20px] shadow-lg shadow-gray-200/50 z-10 border border-gray-50">
          <BiBuildings size={42} className="text-[#4b5b70]" />
        </div>

        {/* Gradient Header */}
        <div className="bg-gradient-to-b from-[#e69800] to-[#802900] rounded-t-[24px] pt-14 pb-8 px-6 text-center text-white relative overflow-hidden">
          {/* Subtle overlay for gradient depth */}
          <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h1 className="text-[26px] font-bold mb-1 tracking-wide">Inventory Management</h1>
            <p className="text-[14px] text-white/80 font-light tracking-wide">Enterprise Resource Management System</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#374151] ml-1">Username</label>
              <div className="flex items-center border border-gray-200 rounded-[16px] px-4 py-3.5 bg-white focus-within:border-[#9a3412] focus-within:ring-1 focus-within:ring-[#9a3412] transition-all shadow-sm">
                <FiUser className="text-[#9a3412] mr-3" size={22} />
                <input 
                  type="text" 
                  placeholder="Enter username" 
                  className="flex-1 outline-none text-[15px] text-gray-700 bg-transparent placeholder-gray-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#374151] ml-1">Password</label>
              <div className="flex items-center border border-gray-200 rounded-[16px] px-4 py-3.5 bg-white focus-within:border-[#9a3412] focus-within:ring-1 focus-within:ring-[#9a3412] transition-all shadow-sm">
                <FiLock className="text-[#9a3412] mr-3" size={22} />
                <input 
                  type="password" 
                  placeholder="Enter password" 
                  className="flex-1 outline-none text-[15px] text-gray-700 bg-transparent placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#374151] ml-1">Confirm Password</label>
              <div className="flex items-center border border-gray-200 rounded-[16px] px-4 py-3.5 bg-white focus-within:border-[#9a3412] focus-within:ring-1 focus-within:ring-[#9a3412] transition-all shadow-sm">
                <FiLock className="text-[#9a3412] mr-3" size={22} />
                <input 
                  type="password" 
                  placeholder="Confirm password" 
                  className="flex-1 outline-none text-[15px] text-gray-700 bg-transparent placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#374151] ml-1">Email</label>
              <div className="flex items-center border border-gray-200 rounded-[16px] px-4 py-3.5 bg-white focus-within:border-[#9a3412] focus-within:ring-1 focus-within:ring-[#9a3412] transition-all shadow-sm">
                <FiMail className="text-[#9a3412] mr-3" size={22} />
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="flex-1 outline-none text-[15px] text-gray-700 bg-transparent placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Select Role */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#374151] ml-1">Select Role</label>
              <div className="flex items-center border border-gray-200 rounded-[16px] px-4 py-3.5 bg-white focus-within:border-[#9a3412] focus-within:ring-1 focus-within:ring-[#9a3412] transition-all shadow-sm relative">
                <FaUserCog className="text-[#9a3412] mr-3" size={22} />
                <select 
                  className="flex-1 outline-none text-[15px] text-gray-700 bg-transparent appearance-none cursor-pointer w-full z-10"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled className="text-gray-400">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
                <div className="absolute right-4 pointer-events-none z-0">
                  <FiChevronDown className="text-[#9a3412]" size={20} />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#374151] ml-1">Location</label>
              <div className="flex items-center border border-gray-200 rounded-[16px] px-4 py-3.5 bg-white focus-within:border-[#9a3412] focus-within:ring-1 focus-within:ring-[#9a3412] transition-all shadow-sm">
                <FiMapPin className="text-[#9a3412] mr-3" size={22} />
                <input 
                  type="text" 
                  placeholder="Enter location" 
                  className="flex-1 outline-none text-[15px] text-gray-700 bg-transparent placeholder-gray-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button 
                type="submit"
                className="w-full bg-[#963406] hover:bg-[#782803] text-white py-4 rounded-none rounded-sm bg-opacity-100 font-semibold text-[16px] flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-900/10"
              >
                Sign up <FiArrowRight size={20} className="ml-1" />
              </button>
            </div>
            
            <div className="text-center mt-4">
              <span className="text-[14px] text-gray-500">Already have an account? </span>
              <Link href="/login" className="text-[#9a3412] text-[14px] font-bold hover:underline">Sign In</Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
