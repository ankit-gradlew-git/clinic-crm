import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { useClinic } from "../../context/ClinicContext";

export default function PatientFormModal({
  isOpen,
  onClose,
  patientToEdit = null,
}) {
  const { addPatient, updatePatient, doctors } = useClinic();

  const isEditing = Boolean(patientToEdit);

  const initialFormState = {
    name: "",
    age: "",
    gender: "Male",
    dob: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    bloodGroup: "O+",
    allergies: "",
    conditions: "",
    medications: "",
    assignedDoctorId: doctors[0]?.id || "DOC-001",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name || "",
        age: patientToEdit.age || "",
        gender: patientToEdit.gender || "Male",
        dob: patientToEdit.dob || "",
        phone: patientToEdit.phone || "",
        email: patientToEdit.email || "",
        address: patientToEdit.address || "",
        emergencyContact: patientToEdit.emergencyContact || "",
        bloodGroup: patientToEdit.bloodGroup || "O+",
        allergies: patientToEdit.allergies || "",
        conditions: patientToEdit.conditions || "",
        medications: patientToEdit.medications || "",
        assignedDoctorId: patientToEdit.assignedDoctorId || (doctors[0]?.id || "DOC-001"),
        status: patientToEdit.status || "Active",
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [patientToEdit, isOpen, doctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.age || Number(formData.age) <= 0) newErrors.age = "Valid age is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing) {
      updatePatient(patientToEdit.id, formData);
    } else {
      addPatient(formData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Patient: ${patientToEdit?.name}` : "Register New Patient"}
      subtitle="Complete basic demographics and clinical baseline for electronic records."
      maxWidth="max-w-2xl"
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
            {isEditing ? "Save Changes" : "Create Patient Record"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 ${
                errors.name ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
              }`}
            />
            {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="42"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 ${
                  errors.age ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                }`}
              />
              {errors.age && <p className="text-rose-600 text-[11px] mt-0.5">{errors.age}</p>}
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 ${
                errors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
              }`}
            />
            {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Address & Emergency Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Flat/House, Street, Area, City"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Name (Relation) - Phone Number"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Medical Summary Section */}
        <div className="pt-2 border-t border-slate-100">
          <h4 className="font-bold text-slate-800 mb-2">Medical Baseline</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Doctor</label>
              <select
                name="assignedDoctorId"
                value={formData.assignedDoctorId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Known Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g. Penicillin, Peanuts, None"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pre-existing Conditions</label>
            <input
              type="text"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              placeholder="e.g. Hypertension, Diabetes"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Medications</label>
            <input
              type="text"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              placeholder="e.g. Metformin 500mg"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
