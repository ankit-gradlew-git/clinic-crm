import React, { useState } from "react";
import Modal from "../common/Modal";
import PatientAvatar from "../common/PatientAvatar";
import StatusBadge from "../common/StatusBadge";
import {
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  HeartPulse,
  Pill,
  Calendar,
  FileText,
  Receipt,
  Edit2,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function PatientDetailModal({
  isOpen,
  onClose,
  patientId,
  onEditPatient,
  onBookAppointment,
}) {
  const { patients, doctors, appointments, medicalRecords, invoices } = useClinic();
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !patientId) return null;

  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return null;

  const assignedDoc = doctors.find((d) => d.id === patient.assignedDoctorId);

  // Patient's history
  const patientAppointments = appointments.filter(
    (a) => a.patientId === patient.id || a.patientName === patient.name
  );
  const patientRecords = medicalRecords.filter(
    (r) => r.patientId === patient.id || r.patientName === patient.name
  );
  const patientInvoices = invoices.filter(
    (i) => i.patientId === patient.id || i.patientName === patient.name
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <PatientAvatar name={patient.name} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{patient.name}</span>
              <StatusBadge status={patient.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-normal">
              {patient.id} • {patient.age} yrs • {patient.gender} • Blood Group: {patient.bloodGroup}
            </p>
          </div>
        </div>
      }
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-slate-400">
            Registered: {patient.registeredDate || "2025"}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditPatient(patient);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookAppointment(patient);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Appointment
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Tabs inside Profile */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-teal-700 text-teal-800"
                : "border-transparent hover:text-slate-800"
            }`}
          >
            Clinical Summary & Demographics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appointments")}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === "appointments"
                ? "border-teal-700 text-teal-800"
                : "border-transparent hover:text-slate-800"
            }`}
          >
            Appointments
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full text-[10px]">
              {patientAppointments.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("records")}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === "records"
                ? "border-teal-700 text-teal-800"
                : "border-transparent hover:text-slate-800"
            }`}
          >
            Medical Records
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full text-[10px]">
              {patientRecords.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("billing")}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === "billing"
                ? "border-teal-700 text-teal-800"
                : "border-transparent hover:text-slate-800"
            }`}
          >
            Invoices & Payments
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full text-[10px]">
              {patientInvoices.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Clinical Overview & Demographics */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Quick Warning / Allergy Banner */}
            {patient.allergies && patient.allergies.toLowerCase() !== "none" && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Drug & Food Allergies: </span>
                  <span className="font-semibold text-rose-700">{patient.allergies}</span>
                </div>
              </div>
            )}

            {/* Medical Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
                  <HeartPulse className="w-4 h-4 text-teal-700" />
                  <span>Existing Conditions</span>
                </div>
                <p className="font-medium text-slate-800 mt-1">
                  {patient.conditions || "No known chronic conditions reported."}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <span>Current Medications</span>
                </div>
                <p className="font-medium text-slate-800 mt-1">
                  {patient.medications || "No active ongoing medications."}
                </p>
              </div>
            </div>

            {/* Demographics & Contact */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                Patient Contact & Demographics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Phone</span>
                    <span className="font-semibold text-slate-800">{patient.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Email</span>
                    <span className="font-semibold text-slate-800">{patient.email || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Address</span>
                    <span className="font-medium text-slate-800">{patient.address || "Bengaluru, Karnataka"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Emergency Contact</span>
                    <span className="font-semibold text-slate-800">
                      {patient.emergencyContact || "Contact Front Desk"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Care Doctor */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Assigned Physician</span>
                  <span className="font-bold text-slate-800">
                    {assignedDoc ? assignedDoc.name : "Clinic General OPD"}
                  </span>
                  <span className="text-[11px] text-teal-700 ml-1">
                    ({assignedDoc?.specialty})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Last Visit</span>
                  <span className="font-semibold text-slate-700">
                    {patient.lastVisit || "First Visit"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Appointment History */}
        {activeTab === "appointments" && (
          <div className="space-y-2.5">
            {patientAppointments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No appointment history recorded for this patient.
              </div>
            ) : (
              patientAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{apt.doctorName}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-slate-200/70 rounded text-slate-700">
                        {apt.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>Date: {apt.date} at {apt.time}</span>
                      <span>•</span>
                      <span>Reason: {apt.reason || "General Consultation"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={apt.status} size="sm" />
                    <p className="text-[11px] font-semibold text-slate-700 mt-1">₹{apt.fee}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Medical Records */}
        {activeTab === "records" && (
          <div className="space-y-3">
            {patientRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No medical diagnoses or clinical notes yet.
              </div>
            ) : (
              patientRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-bold text-slate-900">{rec.diagnosis}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({rec.recordType})</span>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {rec.date} • {rec.doctorName}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{rec.clinicalSummary}</p>
                  {rec.treatmentPlan && (
                    <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-100 text-teal-950 font-medium">
                      <span className="font-bold">Plan: </span>
                      {rec.treatmentPlan}
                    </div>
                  )}
                  {rec.vitals && (
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>BP: {rec.vitals.bp}</span>
                      <span>Pulse: {rec.vitals.pulse} bpm</span>
                      <span>Temp: {rec.vitals.temp}</span>
                      <span>SpO2: {rec.vitals.spo2}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Billing History */}
        {activeTab === "billing" && (
          <div className="space-y-2.5">
            {patientInvoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No billing statements or invoices found.
              </div>
            ) : (
              patientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{inv.id}</span>
                      <span className="text-[11px] text-slate-500">{inv.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Method: {inv.paymentMethod} • Doctor: {inv.doctorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">
                      ₹{inv.total.toLocaleString("en-IN")}
                    </span>
                    <StatusBadge status={inv.status} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
