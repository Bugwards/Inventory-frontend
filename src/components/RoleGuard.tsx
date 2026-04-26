import React, { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: string;
  currentRole?: string;
}

// A simple role guard to conditional render children based on role
export default function RoleGuard({ children, requiredRole = 'Admin', currentRole = 'Admin' }: RoleGuardProps) {
  if (currentRole !== requiredRole) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-500 rounded-lg border border-red-100 mt-4">
        <h2 className="font-bold text-lg mb-2">Access Denied</h2>
        <p className="text-sm">You do not have the required role ({requiredRole}) to view this content.</p>
      </div>
    );
  }

  return <>{children}</>;
}
