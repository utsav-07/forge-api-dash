import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  userName: string;
  onLogout: () => void;
}

export default function DashboardLayout({ userName, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={userName} onLogout={onLogout} />
      <main className="transition-all duration-300 ml-64">
        <Outlet />
      </main>
    </div>
  );
}