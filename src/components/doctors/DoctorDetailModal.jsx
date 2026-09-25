import React from "react";
import Modal from "../common/Modal";
import StatusBadge from "../common/StatusBadge";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Award,
  Calendar,
  DollarSign,
  Star,
  Edit2,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function DoctorDetailModal({
  isOpen,
  onClose,
  doctorId,
  onEditDoctor,
  onBookWithDoctor,
}) {
  const { doctors, appointments } = useClinic();

  if (!isOpen || !doctorId) return null;

  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor) return null;

  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === doctor.id || a.doctorName === doctor.name
  );

  const todayAppointments = doctorAppointments.filter(
    (a) => a.date === "2026-09-22"
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-10 h-10 rounded-full object-cover border border-teal-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{doctor.name}</span>
              <StatusBadge status={doctor.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 font-normal">
              {doctor.specialty} • {doctor.degree}
            </p>
          </div>
        </div>
      }
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-slate-700">
            Consultation Fee: ₹{doctor.consultationFee}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditDoctor(doctor);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookWithDoctor(doctor);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule Appointment
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Bio & Details Grid */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <p className="text-slate-700 leading-relaxed italic">
            "{doctor.about || "Senior clinical specialist dedicated to evidence-based healthcare."}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/70 text-slate-600">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Experience: <strong>{doctor.experience}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 shrink-0 fill-amber-400" />
              <span>Patient Rating: <strong>{doctor.rating} / 5.0</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Location: <strong>{doctor.room}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Hours: <strong>{doctor.availability}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-700 shrink-0" />
              <span className="truncate">{doctor.email}</span>
            </div>
          </div>
        </div>

        {/* Today's Bookings */}
        <div>
          <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span>Today's Consultation Schedule</span>
            <span className="text-teal-700 font-medium">
              {todayAppointments.length} patients booked
            </span>
          </h4>

          {todayAppointments.length === 0 ? (
            <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-lg">
              No appointments scheduled for this doctor today.
            </div>
          ) : (
            <div className="space-y-2">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{apt.patientName}</span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      ({apt.time} • {apt.type})
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{apt.reason}</p>
                  </div>
                  <StatusBadge status={apt.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
