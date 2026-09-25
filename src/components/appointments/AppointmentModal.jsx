import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { useClinic } from "../../context/ClinicContext";

export default function AppointmentModal({
  isOpen,
  onClose,
  appointmentToEdit = null,
  preselectedPatient = null,
}) {
  const { addAppointment, updateAppointment, doctors, patients } = useClinic();

  const isEditing = Boolean(appointmentToEdit);

  const initialForm = {
    patientId: preselectedPatient?.id || patients[0]?.id || "",
    patientName: preselectedPatient?.name || patients[0]?.name || "",
    doctorId: doctors[0]?.id || "DOC-001",
    doctorName: doctors[0]?.name || "Dr. Rahul Sharma",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    type: "Consultation",
    status: "Confirmed",
    reason: "",
    notes: "",
    fee: 700,
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        patientId: appointmentToEdit.patientId || "",
        patientName: appointmentToEdit.patientName || "",
        doctorId: appointmentToEdit.doctorId || "",
        doctorName: appointmentToEdit.doctorName || "",
        date: appointmentToEdit.date || new Date().toISOString().split("T")[0],
        time: appointmentToEdit.time || "10:00 AM",
        type: appointmentToEdit.type || "Consultation",
        status: appointmentToEdit.status || "Confirmed",
        reason: appointmentToEdit.reason || "",
        notes: appointmentToEdit.notes || "",
        fee: appointmentToEdit.fee || 700,
      });
    } else if (preselectedPatient) {
      setFormData((prev) => ({
        ...prev,
        patientId: preselectedPatient.id,
        patientName: preselectedPatient.name,
      }));
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [appointmentToEdit, preselectedPatient, isOpen]);

  const handlePatientChange = (e) => {
    const pId = e.target.value;
    const selected = patients.find((p) => p.id === pId);
    setFormData((prev) => ({
      ...prev,
      patientId: pId,
      patientName: selected ? selected.name : "",
    }));
  };

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const selected = doctors.find((d) => d.id === docId);
    setFormData((prev) => ({
      ...prev,
      doctorId: docId,
      doctorName: selected ? selected.name : "",
      fee: selected?.consultationFee || 700,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName) {
      setErrors({ patientName: "Please select or enter patient" });
      return;
    }

    if (isEditing) {
      updateAppointment(appointmentToEdit.id, formData);
    } else {
      addAppointment(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Appointment #${appointmentToEdit?.id}` : "Schedule Appointment"}
      subtitle="Book consultation slot with specialist physician."
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            {isEditing ? "Save Changes" : "Confirm Booking"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Patient Selection */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
          <select
            value={formData.patientId}
            onChange={handlePatientChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id}) - {p.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor & Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Doctor *</label>
            <select
              value={formData.doctorId}
              onChange={handleDoctorChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
            <input
              type="number"
              value={formData.fee}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fee: Number(e.target.value) }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Date & Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
            <select
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              {[
                "09:00 AM",
                "09:30 AM",
                "10:00 AM",
                "10:30 AM",
                "11:00 AM",
                "11:30 AM",
                "12:00 PM",
                "02:00 PM",
                "02:30 PM",
                "03:00 PM",
                "03:30 PM",
                "04:00 PM",
                "04:30 PM",
                "05:00 PM",
              ].map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Appointment Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Diagnostic Review">Diagnostic Review</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Waiting">Waiting</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Reason for Visit</label>
          <input
            type="text"
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            placeholder="e.g. Skin rash, routine diabetic screening, knee pain"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {/* Clinical / Reception Notes */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="e.g. Patient arriving by cab, carry previous MRI films"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </form>
    </Modal>
  );
}
