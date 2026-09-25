import React from "react";
import Modal from "../common/Modal";
import { Printer, Pill, User, Stethoscope, Activity } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function PrescriptionDetailModal({
  isOpen,
  onClose,
  prescription,
}) {
  const { clinicSettings, patients } = useClinic();

  if (!isOpen || !prescription) return null;

  const patient = patients.find((p) => p.id === prescription.patientId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Medical Prescription #${prescription.id}`}
      subtitle="Authorized electronic prescription with dosage instructions."
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500">
            CarePoint E-Rx Signature Verified
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Prescription (Rx)
            </button>
          </div>
        </div>
      }
    >
      {/* Printable Area */}
      <div className="printable-area bg-white p-2 sm:p-4 text-slate-800 text-xs space-y-4">
        {/* Clinic Prescription Header */}
        <div className="flex items-start justify-between border-b-2 border-teal-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 text-white rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {clinicSettings.clinicName}
              </h2>
              <p className="text-[11px] text-slate-500">
                {clinicSettings.address}
              </p>
              <p className="text-[10px] text-teal-800 font-semibold mt-0.5">
                Reg: {clinicSettings.regNumber} • Tel: {clinicSettings.phone}
              </p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-900">
              {prescription.doctorName}
            </h3>
            <p className="text-[11px] text-teal-700 font-medium">
              {prescription.doctorSpecialty || "Consultant Physician"}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Date: {prescription.date}
            </p>
          </div>
        </div>

        {/* Patient Demographics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px]">
          <div>
            <span className="text-slate-400 block">Patient Name</span>
            <strong className="text-slate-800">{prescription.patientName}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Patient ID / Age</span>
            <span className="text-slate-800 font-medium">
              {prescription.patientId} • {patient ? `${patient.age} yrs (${patient.gender})` : ""}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Blood Group</span>
            <span className="text-slate-800 font-semibold">
              {patient?.bloodGroup || "O+"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Diagnosis</span>
            <span className="text-slate-800 font-semibold">
              {prescription.diagnosis || "General Consultation"}
            </span>
          </div>
        </div>

        {/* Prescription Rx Symbol & Medicines Table */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-teal-800 font-serif font-black text-xl italic">
            <span>℞</span>
            <span className="text-xs font-sans not-italic font-bold tracking-normal text-slate-600">
              Medications & Dosage Schedule:
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Medicine Name</th>
                  <th className="px-3 py-2">Dosage</th>
                  <th className="px-3 py-2">Frequency</th>
                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescription.medicines.map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-900">{med.name}</td>
                    <td className="px-3 py-2.5 text-slate-700 font-medium">{med.dosage}</td>
                    <td className="px-3 py-2.5 text-teal-800 font-semibold">{med.frequency}</td>
                    <td className="px-3 py-2.5 text-slate-700">{med.duration}</td>
                    <td className="px-3 py-2.5 text-slate-600 italic">{med.instruction || med.timing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* General Advice */}
        {prescription.generalAdvice && (
          <div className="p-3 bg-teal-50/40 rounded-lg border border-teal-100 text-xs text-slate-700">
            <strong className="text-teal-900 block mb-0.5">Special Physician Advice:</strong>
            {prescription.generalAdvice}
          </div>
        )}

        {/* Footer & Signature Line */}
        <div className="pt-6 mt-4 border-t border-slate-200 flex items-end justify-between text-[11px] text-slate-500">
          <div>
            <p>1. Keep out of reach of children.</p>
            <p>2. Please complete the full prescribed course.</p>
            <p>3. Review at OPD if symptoms persist after course.</p>
          </div>
          <div className="text-right">
            <div className="h-10 border-b border-dashed border-slate-400 w-36 mb-1 ml-auto" />
            <p className="font-bold text-slate-800">{prescription.doctorName}</p>
            <p className="text-[10px] text-slate-400">Authorized Signature & Seal</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
