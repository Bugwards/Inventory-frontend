"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import RoleGuard from '@/components/RoleGuard';
import { FiEye, FiPrinter, FiMapPin, FiCheckSquare } from 'react-icons/fi';

export default function Home() {
  const [stockLocation, setStockLocation] = useState('');
  const [itemGroup, setItemGroup] = useState('');
  const [showGrnWise, setShowGrnWise] = useState(false);

  const handleGenerateReport = () => {
    // Axios call could go here
    console.log("Generating report for:", { stockLocation, itemGroup, showGrnWise });
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      {/* Sidebar fixed on left */}
      <Sidebar />

      {/* Main Content Area*/}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
      </div>
      </div>
  );
}
