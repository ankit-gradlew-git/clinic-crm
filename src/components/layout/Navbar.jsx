import React, { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Menu,
  ChevronDown,
  UserPlus,
  CalendarPlus,
  FilePlus,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function Navbar({ onMobileMenuClick, onQuickAction }) {
  const { clinicSettings, setIsSearchOpen, appointments } = useClinic();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Today's date display
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const waitingAppointmentsCount = appointments.filter(
    (a) => a.status === "Waiting"
  ).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Global Search trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="p-2 text-slate-500 hover:text-slate-800 lg:hidden rounded-lg hover:bg-slate-100"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100/70 transition-all sm:w-64 md:w-72"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Search patients, doctors, bills...</span>
          <kbd className="hidden sm:inline-block ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Date, Quick Add, Notifications, Doctor Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Display */}
        <div className="hidden md:flex flex-col text-right pr-2">
          <span className="text-xs font-semibold text-slate-800">
            {todayFormatted}
          </span>
          <span className="text-[11px] text-teal-600 font-medium">
            CarePoint Clinic OPD Active
          </span>
        </div>

        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowQuickMenu((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-teal-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {showQuickMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowQuickMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-1.5 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickMenu(false);
                    onQuickAction("add-patient");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <UserPlus className="w-4 h-4 text-teal-600" />
                  Add Patient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickMenu(false);
                    onQuickAction("add-appointment");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <CalendarPlus className="w-4 h-4 text-teal-600" />
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickMenu(false);
                    onQuickAction("add-record");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <FilePlus className="w-4 h-4 text-teal-600" />
                  New Medical Record
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickMenu(false);
                    onQuickAction("add-invoice");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <Receipt className="w-4 h-4 text-teal-600" />
                  Create Invoice
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {waitingAppointmentsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-slate-100 z-50 p-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-xs font-semibold text-slate-800">
                    Clinic Activity & Alerts
                  </span>
                  <span className="text-[11px] text-teal-600 font-medium">
                    {waitingAppointmentsCount} in queue
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-900 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold">Patient Waiting in Lounge</p>
                      <p className="text-[11px] text-amber-700">
                        Priya Nair waiting for Dr. Neha Verma (OPD 202).
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Lab Result Uploaded</p>
                      <p className="text-[11px] text-emerald-700">
                        Lipid profile for Amit Verma is ready.
                      </p>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-700 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold">Payment Received</p>
                      <p className="text-[11px] text-slate-500">
                        ₹3,300 paid via Card by Priya Nair.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Doctor / Admin User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
            alt="Dr. Rahul Sharma"
            className="w-8 h-8 rounded-full object-cover border border-teal-600/30"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {clinicSettings.adminUser.name}
            </p>
            <p className="text-[10px] text-teal-700 font-medium leading-tight">
              Medical Director
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
