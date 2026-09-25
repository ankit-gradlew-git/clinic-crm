import React, { useState } from "react";
import Modal from "../common/Modal";
import { Plus, Trash2 } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function PrescriptionFormModal({ isOpen, onClose }) {
  const { addPrescription, patients, doctors } = useClinic();

  const [patientId, setPatientId] = useState(patients[0]?.id || "");
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || "");
  const [diagnosis, setDiagnosis] = useState("");
  const [duration, setDuration] = useState("14 Days");
  const [generalAdvice, setGeneralAdvice] = useState("");

  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "500 mg",
      frequency: "1-0-1",
      timing: "After Meals",
      duration: "7 Days",
      instruction: "Take with plain water",
    },
  ]);

  const handleAddMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "1 Tab",
        frequency: "1-0-0",
        timing: "Morning",
        duration: "5 Days",
        instruction: "After breakfast",
      },
    ]);
  };

  const handleRemoveMedicineRow = (index) => {
    if (medicines.length === 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === patientId);
    const doc = doctors.find((d) => d.id === doctorId);

    const validMeds = medicines.filter((m) => m.name.trim().length > 0);
    if (validMeds.length === 0) {
      alert("Please specify at least one medication name.");
      return;
    }

    addPrescription({
      patientId,
      patientName: pat ? pat.name : "Patient",
      doctorId,
      doctorName: doc ? doc.name : "Doctor",
      doctorSpecialty: doc ? doc.specialty : "General Physician",
      date: new Date().toISOString().split("T")[0],
      diagnosis: diagnosis || "Clinical Care",
      duration,
      medicines: validMeds,
      generalAdvice,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Electronic Prescription (Rx)"
      subtitle="Issue medications, posology, frequency, and care instructions."
      maxWidth="max-w-3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
          >
            Generate Prescription
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Prescribing Doctor *
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Diagnosis
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Upper Respiratory Tract Infection"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Course Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 7 Days, 1 Month"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Medicines Dynamic Table */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800">Prescribed Medications</h4>
            <button
              type="button"
              onClick={handleAddMedicineRow}
              className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-2.5">
            {medicines.map((med, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg items-center"
              >
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) =>
                      handleMedicineChange(idx, "name", e.target.value)
                    }
                    placeholder="Medicine Name (e.g. Tab. Augmentin 625)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedicineChange(idx, "dosage", e.target.value)
                    }
                    placeholder="Dosage (500mg)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) =>
                      handleMedicineChange(idx, "frequency", e.target.value)
                    }
                    placeholder="Freq (1-0-1)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={med.instruction}
                    onChange={(e) =>
                      handleMedicineChange(idx, "instruction", e.target.value)
                    }
                    placeholder="Instruction (After Meals)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicineRow(idx)}
                    disabled={medicines.length === 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            General Lifestyle / Dietary Advice
          </label>
          <textarea
            rows={2}
            value={generalAdvice}
            onChange={(e) => setGeneralAdvice(e.target.value)}
            placeholder="Hydration advice, dietary restrictions, follow-up instructions..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </form>
    </Modal>
  );
}
