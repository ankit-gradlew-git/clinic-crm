import React, { useState } from "react";
import {
  Search,
  Plus,
  Pill,
  Printer,
  Eye,
  Trash2,
  Calendar,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import PatientAvatar from "../common/PatientAvatar";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import PrescriptionDetailModal from "./PrescriptionDetailModal";
import PrescriptionFormModal from "./PrescriptionFormModal";

export default function PrescriptionList({ onAddPrescription }) {
  const { prescriptions, deletePrescription, setCurrentTab, setActivePatientId } =
    useClinic();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [rxToDelete, setRxToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filtered = prescriptions.filter((rx) => {
    const q = searchQuery.toLowerCase();
    return (
      rx.patientName.toLowerCase().includes(q) ||
      rx.doctorName.toLowerCase().includes(q) ||
      rx.id.toLowerCase().includes(q) ||
      (rx.diagnosis && rx.diagnosis.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Prescriptions (Rx)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Electronic drug posology, active medication schedules, and printable slips.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Prescription
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prescriptions by patient name, doctor, or medication..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No prescriptions found"
            description="Create a new prescription or clear your search terms."
            actionLabel="New Prescription"
            onAction={() => setIsFormOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Prescription ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Physician</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Prescribed Medicines</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rx) => (
                  <tr
                    key={rx.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPrescription(rx)}
                  >
                    <td className="px-5 py-3.5 font-mono text-slate-500 font-medium">
                      {rx.id}
                    </td>

                    <td className="px-4 py-3.5 font-medium">
                      <div
                        className="flex items-center gap-2.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTab("patients");
                          setActivePatientId(rx.patientId);
                        }}
                      >
                        <PatientAvatar name={rx.patientName} size="sm" />
                        <div>
                          <span className="font-semibold text-slate-900 group-hover:text-teal-700 block">
                            {rx.patientName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {rx.patientId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {rx.doctorName}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500">
                      {rx.date}
                    </td>

                    <td className="px-4 py-3.5 text-slate-800 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {rx.medicines.map((m, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      {rx.duration || "14 Days"}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={rx.status || "Active"} size="sm" />
                    </td>

                    <td
                      className="px-5 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPrescription(rx)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
                          title="Print / View Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRxToDelete(rx)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Prescription"
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

      {/* Prescription Detail & Print Modal */}
      {selectedPrescription && (
        <PrescriptionDetailModal
          isOpen={Boolean(selectedPrescription)}
          onClose={() => setSelectedPrescription(null)}
          prescription={selectedPrescription}
        />
      )}

      {/* Create Prescription Modal */}
      <PrescriptionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Delete Confirmation */}
      {rxToDelete && (
        <ConfirmDialog
          isOpen={Boolean(rxToDelete)}
          onClose={() => setRxToDelete(null)}
          onConfirm={() => deletePrescription(rxToDelete.id)}
          title="Delete Prescription"
          message={`Are you sure you want to delete prescription ${rxToDelete.id} for ${rxToDelete.patientName}?`}
        />
      )}
    </div>
  );
}
