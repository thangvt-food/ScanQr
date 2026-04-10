"use client";

import React from "react";
import { 
  Users, 
  QrCode, 
  CheckCircle, 
  Clock,
  LayoutDashboard
} from "lucide-react";
import { ProjectManager } from "@/components/dashboard/ProjectManager";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user, login } = useAuth();

  const stats = [
    { label: "Active Projects", value: "3", icon: LayoutDashboard, color: "text-blue-600" },
    { label: "Total Scanned", value: "1,284", icon: QrCode, color: "text-green-600" },
    { label: "Pending Sync", value: "12", icon: Clock, color: "text-orange-600" },
    { label: "Daily Users", value: "156", icon: Users, color: "text-purple-600" },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-office-bg p-8 rounded-office border-2 border-dashed border-office-border max-w-md">
          <LayoutDashboard size={48} className="mx-auto text-office-primary mb-4" />
          <h1 className="text-2xl font-bold text-office-text mb-2 uppercase tracking-tight">Scanner Workspace</h1>
          <p className="text-office-text-secondary office-sm mb-8">
            Please log in with your account to manage your QR scanning projects and sync with Google Sheets.
          </p>
          <button 
            onClick={() => login()}
            className="office-btn-primary w-full py-3 text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-office-text tracking-tight uppercase">Control Center</h1>
          <p className="text-office-text-secondary office-sm">Managing projects for {user.displayName || user.email}</p>
        </div>
      </div>

      {/* Stats Grid - Simplified for now, can be dynamic later */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="office-card p-4 flex items-start justify-between bg-white">
            <div>
              <p className="office-xs font-bold text-office-text-secondary uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-office-text">{stat.value}</h3>
            </div>
            <div className={`p-2 rounded-office bg-office-bg ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Project List */}
      <div className="pt-4">
        <ProjectManager />
      </div>

      {/* Workspace Footer Info */}
      <div className="bg-office-header border border-office-border p-4 rounded-office flex items-center gap-4">
        <div className="bg-office-success-bg p-2 rounded-full">
          <CheckCircle size={16} className="text-office-success-text" />
        </div>
        <p className="office-xs text-office-text-secondary">
          <span className="font-bold text-office-text">Cloud Sync Active.</span> Your projects are securely stored in Firebase RTDB and session tokens are managed server-side.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
