import React from "react";
import {
  Users,
  Calendar,
  Clock,
  CreditCard,
  ArrowRight,
  UserCheck,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import StatCard from "../common/StatCard";
import StatusBadge from "../common/StatusBadge";
import PatientAvatar from "../common/PatientAvatar";
import RevenueChart from "./RevenueChart";

export default function DashboardOverview({ onOpenPatientModal, onOpenAppointmentModal }) {
  const {
    patients,
    appointments,
    invoices,
    todayDateStr,
    setCurrentTab,
    setActivePatientId,
    updateAppointmentStatus,
  } = useClinic();

  const todayAppointments = appointments.filter((a) => a.date === todayDateStr);
  const pendingAppointments = todayAppointments.filter(
    (a) => a.status === "Waiting" || a.status === "Confirmed"
  );

  const todayRevenue = invoices
    .filter((inv) => inv.date === todayDateStr && inv.status === "Paid")
    .reduce((sum, item) => sum + (item.total || 0), 0);

  const upcomingAppointments = appointments
    .filter((a) => a.date > todayDateStr)
    .slice(0, 4);

  // Quick stats calculation
  const activePatients = patients.filter((p) => p.status === "Active").length;
  const newPatientsThisMonth = 4;
  const returningPatients = activePatients - newPatientsThisMonth;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Clinic Overview & Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status for OPD suites, patient queues, and daily collections.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenPatientModal}
            className="px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
          >
            + Add Patient
          </button>
          <button
            type="button"
            onClick={onOpenAppointmentModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            + Schedule Visit
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={patients.length}
          change="+8.4%"
          isPositive={true}
          description="Active electronic medical records"
          icon={Users}
          accentColor="teal"
          onClick={() => setCurrentTab("patients")}
        />
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          change="+15%"
          isPositive={true}
          description="Booked across 5 specialist OPDs"
          icon={Calendar}
          accentColor="blue"
          onClick={() => setCurrentTab("appointments")}
        />
        <StatCard
          title="In Queue / Waiting"
          value={pendingAppointments.length}
          change={`${todayAppointments.filter((a) => a.status === "Waiting").length} in lounge`}
          isPositive={false}
          description="Awaiting doctor consultation"
          icon={Clock}
          accentColor="amber"
          onClick={() => setCurrentTab("appointments")}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toLocaleString("en-IN")}`}
          change="+12.2%"
          isPositive={true}
          description="Cleared payments (UPI, Card, Cash)"
          icon={CreditCard}
          accentColor="emerald"
          onClick={() => setCurrentTab("billing")}
        />
      </div>

      {/* Grid: Today's Appointments & Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Today's Patient Schedule
              </h3>
              <p className="text-xs text-slate-500">
                {todayAppointments.length} appointments for today
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentTab("appointments")}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
            >
              View Full Calendar
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                      No appointments scheduled for today.
                    </td>
                  </tr>
                ) : (
                  todayAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        <div
                          className="flex items-center gap-2.5 cursor-pointer"
                          onClick={() => {
                            setCurrentTab("patients");
                            setActivePatientId(apt.patientId);
                          }}
                        >
                          <PatientAvatar name={apt.patientName} size="sm" />
                          <div>
                            <span className="font-semibold text-slate-900 group-hover:text-teal-700 block">
                              {apt.patientName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {apt.patientId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {apt.doctorName}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {apt.time}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {apt.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={apt.status} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {apt.status === "Waiting" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointmentStatus(apt.id, "Completed")
                            }
                            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
                          >
                            Mark Done
                          </button>
                        )}
                        {apt.status === "Confirmed" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointmentStatus(apt.id, "Waiting")
                            }
                            className="text-[11px] font-medium text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200"
                          >
                            Check In
                          </button>
                        )}
                        {apt.status === "Completed" && (
                          <span className="text-[11px] text-slate-400">
                            Completed
                          </span>
                        )}
                        {apt.status === "Cancelled" && (
                          <span className="text-[11px] text-slate-400">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-right">
            <span className="text-[11px] text-slate-500">
              Reception Desk Hotline: +91 80 4123 7890 (Ext. 1)
            </span>
          </div>
        </div>

        {/* Revenue Overview Chart (1 col) */}
        <div className="lg:col-span-1">
          <RevenueChart />
        </div>
      </div>

      {/* Grid: Patient Overview Summary & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Overview Summary */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Patient Overview
              </h3>
              <span className="text-xs text-teal-700 font-semibold">
                {activePatients} Active
              </span>
            </div>

            {/* Simple Visual Breakdown */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Returning Patients</span>
                  <span className="font-semibold">{returningPatients} (70%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-700 h-full rounded-full w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>New Registrations (This Month)</span>
                  <span className="font-semibold">{newPatientsThisMonth} (30%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[30%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500">Avg. Consultation</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">18 mins</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 text-center">
                  <p className="text-xs text-slate-500">Patient Satisfaction</p>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">4.9 / 5.0</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentTab("patients")}
            className="mt-4 w-full py-2 text-xs font-semibold text-slate-700 hover:text-teal-800 bg-slate-50 hover:bg-teal-50 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            Manage All Patients
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upcoming Appointments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Upcoming Appointments
                </h3>
                <p className="text-xs text-slate-500">Scheduled for tomorrow and onwards</p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab("appointments")}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                All Bookings
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  <PatientAvatar name={apt.patientName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {apt.patientName}
                      </p>
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                        {apt.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {apt.doctorName}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automated SMS reminders sent 24h prior to visit</span>
            <span className="font-semibold text-teal-700">SMS Gateway: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
