import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { useClinic } from "../../context/ClinicContext";

export default function DoctorFormModal({
  isOpen,
  onClose,
  doctorToEdit = null,
}) {
  const { addDoctor, updateDoctor } = useClinic();
  const isEditing = Boolean(doctorToEdit);

  const initialForm = {
    name: "",
    specialty: "General Physician",
    degree: "MBBS, MD",
    experience: "8 years",
    phone: "",
    email: "",
    room: "OPD Suite 101",
    availability: "Mon - Sat (09:00 AM - 02:00 PM)",
    consultationFee: 700,
    about: "",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (doctorToEdit) {
      setFormData({
        name: doctorToEdit.name || "",
        specialty: doctorToEdit.specialty || "General Physician",
        degree: doctorToEdit.degree || "",
        experience: doctorToEdit.experience || "",
        phone: doctorToEdit.phone || "",
        email: doctorToEdit.email || "",
        room: doctorToEdit.room || "",
        availability: doctorToEdit.availability || "",
        consultationFee: doctorToEdit.consultationFee || 700,
        about: doctorToEdit.about || "",
        avatar: doctorToEdit.avatar || initialForm.avatar,
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [doctorToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: "Doctor name is required" });
      return;
    }

    if (isEditing) {
      updateDoctor(doctorToEdit.id, formData);
    } else {
      addDoctor(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Physician: ${doctorToEdit?.name}` : "Add Doctor / Specialist"}
      subtitle="Register clinic doctor, consultation hours, and OPD suite assignment."
      maxWidth="max-w-xl"
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
            {isEditing ? "Save Changes" : "Register Doctor"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Ramesh Gupta"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
          {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Specialty</label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white"
            >
              <option value="General Physician">General Physician</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="ENT Specialist">ENT Specialist</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Neurologist">Neurologist</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Qualifications / Degrees</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD, DNB"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 12 years"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
            <input
              type="number"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, consultationFee: Number(e.target.value) }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98450 12345"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@carepointclinic.in"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">OPD Room / Suite</label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="Suite 101"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Availability Hours</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Mon - Sat (09:00 AM - 02:00 PM)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Clinical Bio / Summary</label>
          <textarea
            rows={2}
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Key specialties, procedures performed, hospital affiliations..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </form>
    </Modal>
  );
}
