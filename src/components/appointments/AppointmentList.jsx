import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import StatusBadge from "../common/StatusBadge";
import PatientAvatar from "../common/PatientAvatar";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";

export default function AppointmentList({
  onAddAppointment,
  onEditAppointment,
}) {
  const {
    appointments,
    doctors,
    updateAppointmentStatus,
    deleteAppointment,
    setCurrentTab,
    setActivePatientId,
  } = useClinic();

  const [selectedDate, setSelectedDate] = useState("2026-09-22");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Quick date jump
  const handleDateChange = (offsetDays) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + offsetDays);
    setSelectedDate(cur.toISOString().split("T")[0]);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = !selectedDate || apt.date === selectedDate;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      apt.patientName.toLowerCase().includes(q) ||
      apt.doctorName.toLowerCase().includes(q) ||
      apt.id.toLowerCase().includes(q) ||
      (apt.reason && apt.reason.toLowerCase().includes(q));

    const matchesDoc =
      doctorFilter === "All" || apt.doctorId === doctorFilter;
    const matchesStatus =
      statusFilter === "All" || apt.status === statusFilter;
    const matchesType = typeFilter === "All" || apt.type === typeFilter;

    return matchesDate && matchesSearch && matchesDoc && matchesStatus && matchesType;
  });

  const waitingCount = filteredAppointments.filter((a) => a.status === "Waiting").length;
  const completedCount = filteredAppointments.filter((a) => a.status === "Completed").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Appointments & Daily Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage outpatient department schedules, doctor slots, and queue status.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddAppointment}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Visit
        </button>
      </div>

      {/* Date Navigator Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDateChange(-1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <CalendarIcon className="w-4 h-4 text-teal-700" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent border-0 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => handleDateChange(1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSelectedDate("2026-09-22")}
            className="text-xs font-medium text-teal-700 hover:text-teal-900 px-2 py-1"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => setSelectedDate("")}
            className={`text-xs font-medium px-2 py-1 rounded ${
              selectedDate === ""
                ? "bg-teal-50 text-teal-800 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Show All Dates
          </button>
        </div>

        {/* Date summary counts */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            Total: <strong className="text-slate-900">{filteredAppointments.length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Waiting: <strong className="text-slate-900">{waitingCount}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Done: <strong className="text-slate-900">{completedCount}</strong>
          </span>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, doctor, or reason..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {/* Doctor filter */}
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="All">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Waiting">Waiting</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
        >
          <option value="All">All Types</option>
          <option value="Consultation">Consultation</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Routine Checkup">Routine Checkup</option>
          <option value="Diagnostic Review">Diagnostic Review</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <EmptyState
            title="No appointments match this schedule"
            description="No bookings found for the selected criteria. Schedule a new appointment or switch the date."
            actionLabel="Schedule Appointment"
            onAction={onAddAppointment}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Time / Slot</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Physician</th>
                  <th className="px-4 py-3">Visit Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reason / Notes</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-teal-700" />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {apt.time}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {apt.date}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-medium">
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
                            {apt.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {apt.doctorName}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {apt.type}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={apt.status} size="sm" />
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 max-w-xs">
                      <p className="truncate font-medium text-slate-800">
                        {apt.reason || "General Consultation"}
                      </p>
                      {apt.notes && (
                        <p className="truncate text-[11px] text-slate-400">
                          {apt.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Status toggle */}
                        {apt.status === "Confirmed" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointmentStatus(apt.id, "Waiting")
                            }
                            title="Mark Patient Waiting in Reception"
                            className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded"
                          >
                            Mark Waiting
                          </button>
                        )}
                        {apt.status === "Waiting" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointmentStatus(apt.id, "Completed")
                            }
                            title="Mark Consultation Complete"
                            className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                          >
                            Complete
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onEditAppointment(apt)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Appointment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppointmentToDelete(apt)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Cancel/Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {appointmentToDelete && (
        <ConfirmDialog
          isOpen={Boolean(appointmentToDelete)}
          onClose={() => setAppointmentToDelete(null)}
          onConfirm={() => deleteAppointment(appointmentToDelete.id)}
          title="Cancel Appointment"
          message={`Are you sure you want to cancel the appointment for ${appointmentToDelete.patientName} with ${appointmentToDelete.doctorName} on ${appointmentToDelete.date} at ${appointmentToDelete.time}?`}
        />
      )}
    </div>
  );
}
