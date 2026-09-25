import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import PatientAvatar from "../common/PatientAvatar";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";

export default function PatientList({
  onAddPatient,
  onEditPatient,
  onViewPatient,
}) {
  const { patients, doctors, deletePatient } = useClinic();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Deletion confirm state
  const [patientToDelete, setPatientToDelete] = useState(null);

  // Filter patients
  const filtered = patients.filter((patient) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(q) ||
      patient.id.toLowerCase().includes(q) ||
      patient.phone.includes(q) ||
      (patient.email && patient.email.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "All" || patient.status === statusFilter;

    const matchesGender =
      genderFilter === "All" || patient.gender === genderFilter;

    const matchesDoctor =
      doctorFilter === "All" || patient.assignedDoctorId === doctorFilter;

    return matchesSearch && matchesStatus && matchesGender && matchesDoctor;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedPatients = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDoctorName = (docId) => {
    const doc = doctors.find((d) => d.id === docId);
    return doc ? doc.name : "OPD General";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Patient Registry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage electronic health records, demographics, and clinical histories.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddPatient}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, ID, phone number, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 text-slate-700"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Assigned Doctor */}
          <select
            value={doctorFilter}
            onChange={(e) => {
              setDoctorFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 text-slate-700 max-w-[150px] truncate"
          >
            <option value="All">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No matching patients found"
            description="Try changing search terms or clearing your filters."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchQuery("");
              setStatusFilter("All");
              setGenderFilter("All");
              setDoctorFilter("All");
            }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Patient ID</th>
                    <th className="px-4 py-3">Patient Name</th>
                    <th className="px-4 py-3">Age / Gender</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Last Visit</th>
                    <th className="px-4 py-3">Assigned Doctor</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onViewPatient(patient)}
                    >
                      <td className="px-5 py-3.5 font-mono font-medium text-slate-500 text-[11px]">
                        {patient.id}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <PatientAvatar name={patient.name} size="sm" />
                          <div>
                            <span className="font-semibold text-slate-900 group-hover:text-teal-700 block">
                              {patient.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Blood: {patient.bloodGroup}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {patient.age} yrs • {patient.gender}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {patient.phone}
                      </td>

                      <td className="px-4 py-3.5 text-slate-500">
                        {patient.lastVisit || "New Registration"}
                      </td>

                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {getDoctorName(patient.assignedDoctorId)}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={patient.status} size="sm" />
                      </td>

                      <td
                        className="px-5 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="View Full Profile"
                            onClick={() => onViewPatient(patient)}
                            className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Edit Patient"
                            onClick={() => onEditPatient(patient)}
                            className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete Patient"
                            onClick={() => setPatientToDelete(patient)}
                            className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(
                    filtered.length,
                    (currentPage - 1) * itemsPerPage + 1
                  )}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(filtered.length, currentPage * itemsPerPage)}
                </span>{" "}
                of <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
                registered patients
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
                <span className="px-2 font-medium">
                  {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {patientToDelete && (
        <ConfirmDialog
          isOpen={Boolean(patientToDelete)}
          onClose={() => setPatientToDelete(null)}
          onConfirm={() => deletePatient(patientToDelete.id)}
          title="Remove Patient Record"
          message={`Are you sure you want to remove ${patientToDelete.name} (${patientToDelete.id}) from the clinic database? Associated records will be unlinked.`}
        />
      )}
    </div>
  );
}
