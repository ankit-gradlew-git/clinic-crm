import React, { useState } from "react";
import Modal from "../common/Modal";
import StatusBadge from "../common/StatusBadge";
import { useClinic } from "../../context/ClinicContext";
import { FileText, User, Calendar, Activity, CheckCircle2 } from "lucide-react";

export default function MedicalRecordModal({
  isOpen,
  onClose,
  recordToView = null,
}) {
  const { addMedicalRecord, doctors, patients } = useClinic();

  const isViewing = Boolean(recordToView);

  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || "",
    patientName: patients[0]?.name || "",
    doctorId: doctors[0]?.id || "",
    doctorName: doctors[0]?.name || "",
    date: new Date().toISOString().split("T")[0],
    recordType: "Consultation",
    diagnosis: "",
    clinicalSummary: "",
    treatmentPlan: "",
    status: "Finalized",
    bp: "120/80",
    pulse: "72",
    temp: "98.4°F",
    spo2: "99%",
    weight: "70 kg",
  });

  const [errors, setErrors] = useState({});

  const handlePatientSelect = (e) => {
    const pId = e.target.value;
    const p = patients.find((pat) => pat.id === pId);
    setFormData((prev) => ({
      ...prev,
      patientId: pId,
      patientName: p ? p.name : "",
    }));
  };

  const handleDoctorSelect = (e) => {
    const dId = e.target.value;
    const d = doctors.find((doc) => doc.id === dId);
    setFormData((prev) => ({
      ...prev,
      doctorId: dId,
      doctorName: d ? d.name : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.diagnosis.trim()) {
      setErrors({ diagnosis: "Diagnosis title is required" });
      return;
    }
    if (!formData.clinicalSummary.trim()) {
      setErrors({ clinicalSummary: "Clinical notes cannot be empty" });
      return;
    }

    addMedicalRecord({
      patientId: formData.patientId,
      patientName: formData.patientName,
      doctorId: formData.doctorId,
      doctorName: formData.doctorName,
      date: formData.date,
      recordType: formData.recordType,
      diagnosis: formData.diagnosis,
      clinicalSummary: formData.clinicalSummary,
      treatmentPlan: formData.treatmentPlan,
      vitals: {
        bp: formData.bp,
        pulse: formData.pulse,
        temp: formData.temp,
        spo2: formData.spo2,
        weight: formData.weight,
      },
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isViewing
          ? `Clinical Record #${recordToView.id}`
          : "Add Electronic Medical Record (EMR)"
      }
      subtitle={
        isViewing
          ? `${recordToView.recordType} Record for ${recordToView.patientName}`
          : "Document consultation notes, diagnoses, and lab findings."
      }
      maxWidth="max-w-2xl"
      footer={
        isViewing ? (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs"
          >
            Close Record
          </button>
        ) : (
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
              Save Record
            </button>
          </>
        )
      }
    >
      {isViewing ? (
        <div className="space-y-4 text-xs">
          {/* Header Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {recordToView.diagnosis}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Patient: {recordToView.patientName} ({recordToView.patientId})
                </p>
              </div>
            </div>
            <div className="text-right">
              <StatusBadge status={recordToView.status || "Finalized"} size="sm" />
              <p className="text-[11px] text-slate-400 mt-1">
                {recordToView.date} • {recordToView.doctorName}
              </p>
            </div>
          </div>

          {/* Vitals Snapshot */}
          {recordToView.vitals && (
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
              <span className="font-bold text-teal-900 block mb-1.5">
                Clinical Vitals at Examination:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-teal-950 font-medium">
                <div>BP: <strong>{recordToView.vitals.bp || "120/80"}</strong></div>
                <div>Pulse: <strong>{recordToView.vitals.pulse} bpm</strong></div>
                <div>Temp: <strong>{recordToView.vitals.temp}</strong></div>
                <div>SpO2: <strong>{recordToView.vitals.spo2}</strong></div>
                <div>Weight: <strong>{recordToView.vitals.weight}</strong></div>
              </div>
            </div>
          )}

          {/* Clinical Summary */}
          <div>
            <span className="font-bold text-slate-800 block mb-1">
              Physician Findings & Observations:
            </span>
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
              {recordToView.clinicalSummary}
            </div>
          </div>

          {/* Treatment Plan */}
          {recordToView.treatmentPlan && (
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                Treatment Recommendation & Follow-up:
              </span>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 text-emerald-950 rounded-lg font-medium leading-relaxed">
                {recordToView.treatmentPlan}
              </div>
            </div>
          )}

          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800">
            <strong>CarePoint Compliance Note:</strong> This is simulated clinical demonstration data for frontend validation.
          </div>
        </div>
      ) : (
        /* Create Form */
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Select Patient *
              </label>
              <select
                value={formData.patientId}
                onChange={handlePatientSelect}
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
                Examining Physician *
              </label>
              <select
                value={formData.doctorId}
                onChange={handleDoctorSelect}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Record Type
              </label>
              <select
                value={formData.recordType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, recordType: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="Consultation">Consultation</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Prescription">Prescription</option>
                <option value="Diagnosis">Diagnosis</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Primary Diagnosis / Clinical Heading *
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))
              }
              placeholder="e.g. Acute Bronchitis, Essential Hypertension"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
            {errors.diagnosis && (
              <p className="text-rose-600 text-[11px] mt-0.5">{errors.diagnosis}</p>
            )}
          </div>

          {/* Vitals inputs */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Patient Vitals
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <input
                type="text"
                value={formData.bp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bp: e.target.value }))
                }
                placeholder="BP (120/80)"
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                value={formData.pulse}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, pulse: e.target.value }))
                }
                placeholder="Pulse (bpm)"
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                value={formData.temp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, temp: e.target.value }))
                }
                placeholder="Temp (98.6°F)"
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                value={formData.spo2}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, spo2: e.target.value }))
                }
                placeholder="SpO2 (99%)"
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                value={formData.weight}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, weight: e.target.value }))
                }
                placeholder="Weight (kg)"
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Findings & Notes *
            </label>
            <textarea
              rows={3}
              value={formData.clinicalSummary}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  clinicalSummary: e.target.value,
                }))
              }
              placeholder="Detailed symptomatic history, physical exam, and lab evaluations..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
            {errors.clinicalSummary && (
              <p className="text-rose-600 text-[11px] mt-0.5">
                {errors.clinicalSummary}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Treatment Plan & Medication Recommendations
            </label>
            <textarea
              rows={2}
              value={formData.treatmentPlan}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  treatmentPlan: e.target.value,
                }))
              }
              placeholder="Therapeutic regimen, dietary changes, follow-up timeline..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
