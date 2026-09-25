import React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  Pill,
  Receipt,
  BarChart3,
  Settings,
  Activity,
  RotateCcw,
  X,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { currentTab, setCurrentTab, appointments, resetDemoData, clinicSettings } =
    useClinic();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "patients", label: "Patients", icon: Users },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      badge: appointments.filter((a) => a.date === "2026-09-22" && a.status === "Waiting").length,
    },
    { id: "doctors", label: "Doctors & Staff", icon: Stethoscope },
    { id: "records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "billing", label: "Billing & Invoices", icon: Receipt },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    setCurrentTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <aside className="flex h-full flex-col justify-between border-r border-slate-200 bg-white">
      <div>
        {/* Clinic Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">
                {clinicSettings.clinicName || "CarePoint Clinic"}
              </h1>
              <span className="text-[10px] font-medium text-teal-700 uppercase tracking-wider block">
                Healthcare CRM
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-teal-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? "bg-teal-900 text-teal-200"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Reset Demo Data */}
      <div className="p-3 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-2">
          <p className="text-[11px] font-medium text-slate-700">CarePoint Demo Mode</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Full frontend CRUD with local browser storage.
          </p>
          <button
            type="button"
            onClick={resetDemoData}
            className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 hover:text-teal-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-white shadow-2xl transition-transform">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
