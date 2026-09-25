import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Eye,
  Trash2,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import StatusBadge from "../common/StatusBadge";
import PatientAvatar from "../common/PatientAvatar";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import MedicalRecordModal from "./MedicalRecordModal";

export default function MedicalRecordList({ onAddRecord }) {
  const { medicalRecords, deleteMedicalRecord, setCurrentTab, setActivePatientId } =
    useClinic();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedRecordToView, setSelectedRecordToView] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const recordTypes = [
    "All",
    "Consultation",
    "Lab Report",
    "Prescription",
    "Diagnosis",
    "Follow-up",
  ];

  const filteredRecords = medicalRecords.filter((rec) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      rec.patientName.toLowerCase().includes(q) ||
      rec.doctorName.toLowerCase().includes(q) ||
      rec.diagnosis.toLowerCase().includes(q) ||
      rec.id.toLowerCase().includes(q);

    const matchesType = typeFilter === "All" || rec.recordType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Medical Records & EMR
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Clinical consultations, diagnostic findings, and outpatient histories.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddRecord}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Medical Record
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
            placeholder="Search by diagnosis, patient, or physician..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {/* Record Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {recordTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                typeFilter === t
                  ? "bg-teal-700 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No medical records found"
            description="No documents match your query or filter criteria."
            actionLabel="Add Record"
            onAction={onAddRecord}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Record ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Physician</th>
                  <th className="px-4 py-3">Diagnosis / Chief Complaint</th>
                  <th className="px-4 py-3">Record Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRecordToView(rec)}
                  >
                    <td className="px-5 py-3.5 font-mono text-slate-400 font-medium">
                      {rec.id}
                    </td>

                    <td className="px-4 py-3.5 font-medium">
                      <div
                        className="flex items-center gap-2.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTab("patients");
                          setActivePatientId(rec.patientId);
                        }}
                      >
                        <PatientAvatar name={rec.patientName} size="sm" />
                        <div>
                          <span className="font-semibold text-slate-900 group-hover:text-teal-700 block">
                            {rec.patientName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {rec.patientId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500">
                      {rec.date}
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {rec.doctorName}
                    </td>

                    <td className="px-4 py-3.5 text-slate-800 font-medium max-w-xs truncate">
                      {rec.diagnosis}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200">
                        {rec.recordType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={rec.status || "Finalized"} size="sm" />
                    </td>

                    <td
                      className="px-5 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedRecordToView(rec)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRecordToDelete(rec)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Record"
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
        )}
      </div>

      {/* Record View Modal */}
      {selectedRecordToView && (
        <MedicalRecordModal
          isOpen={Boolean(selectedRecordToView)}
          onClose={() => setSelectedRecordToView(null)}
          recordToView={selectedRecordToView}
        />
      )}

      {/* Delete Dialog */}
      {recordToDelete && (
        <ConfirmDialog
          isOpen={Boolean(recordToDelete)}
          onClose={() => setRecordToDelete(null)}
          onConfirm={() => deleteMedicalRecord(recordToDelete.id)}
          title="Delete Medical Record"
          message={`Are you sure you want to permanently delete clinical record ${recordToDelete.id} for ${recordToDelete.patientName}?`}
        />
      )}
    </div>
  );
}
