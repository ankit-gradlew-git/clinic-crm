import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Clock,
  MapPin,
  Calendar,
  Star,
  Award,
  ChevronRight,
  Eye,
  Edit2,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import DoctorDetailModal from "./DoctorDetailModal";
import DoctorFormModal from "./DoctorFormModal";

export default function DoctorList({ onBookAppointmentWithDoctor }) {
  const { doctors, appointments } = useClinic();

  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All");

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [doctorToEdit, setDoctorToEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Specialties
  const specialties = [
    "All",
    "General Physician",
    "Dermatologist",
    "Cardiologist",
    "Pediatrician",
    "Orthopedic",
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.room.toLowerCase().includes(q);
    const matchesSpecialty =
      specialtyFilter === "All" || doc.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const getAppointmentsToday = (docId) => {
    return appointments.filter(
      (a) => a.doctorId === docId && a.date === "2026-09-22"
    ).length;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Doctors & Clinical Staff
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Specialist consultants, OPD availability schedules, and room allocations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDoctorToEdit(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name, specialty, or room..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {/* Specialty Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {specialties.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => setSpecialtyFilter(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                specialtyFilter === spec
                  ? "bg-teal-700 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid Cards */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          title="No doctors match this filter"
          description="Try selecting 'All' or updating your search keywords."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setSpecialtyFilter("All");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => {
            const todayCount = getAppointmentsToday(doctor.id);

            return (
              <div
                key={doctor.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Doctor Info */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-12 h-12 rounded-full object-cover border border-teal-100 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                          {doctor.name}
                        </h3>
                        <p className="text-xs font-medium text-teal-700">
                          {doctor.specialty}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                          {doctor.degree}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={doctor.status} size="sm" />
                  </div>

                  {/* Badges / Metrics */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Experience</span>
                      <span className="font-semibold text-slate-800">
                        {doctor.experience}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Today's Visits</span>
                      <span className="font-bold text-teal-700">
                        {todayCount} Booked
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doctor.availability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doctor.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doctor.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    ₹{doctor.consultationFee}{" "}
                    <span className="font-normal text-slate-400 text-[11px]">/ visit</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDoctorToEdit(doctor);
                        setIsFormOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Doctor Info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorId(doctor.id)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Doctor Detail Modal */}
      {selectedDoctorId && (
        <DoctorDetailModal
          isOpen={Boolean(selectedDoctorId)}
          onClose={() => setSelectedDoctorId(null)}
          doctorId={selectedDoctorId}
          onEditDoctor={(doc) => {
            setSelectedDoctorId(null);
            setDoctorToEdit(doc);
            setIsFormOpen(true);
          }}
          onBookWithDoctor={(doc) => {
            setSelectedDoctorId(null);
            if (onBookAppointmentWithDoctor) onBookAppointmentWithDoctor(doc);
          }}
        />
      )}

      {/* Doctor Form Modal */}
      <DoctorFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setDoctorToEdit(null);
        }}
        doctorToEdit={doctorToEdit}
      />
    </div>
  );
}
