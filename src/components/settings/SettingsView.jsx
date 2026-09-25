import React, { useState } from "react";
import {
  Building2,
  User,
  Bell,
  Palette,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function SettingsView() {
  const { clinicSettings, updateSettings } = useClinic();
  const [activeTab, setActiveTab] = useState("clinic");

  const [formData, setFormData] = useState({
    clinicName: clinicSettings.clinicName || "",
    tagline: clinicSettings.tagline || "",
    regNumber: clinicSettings.regNumber || "",
    phone: clinicSettings.phone || "",
    emergencyPhone: clinicSettings.emergencyPhone || "",
    email: clinicSettings.email || "",
    website: clinicSettings.website || "",
    address: clinicSettings.address || "",
    adminName: clinicSettings.adminUser?.name || "Dr. Rahul Sharma",
    adminRole: clinicSettings.adminUser?.role || "Medical Director",
    adminEmail: clinicSettings.adminUser?.email || "dr.rahul@carepointclinic.in",
    adminPhone: clinicSettings.adminUser?.phone || "+91 98450 12345",
    appointmentReminders: clinicSettings.notifications?.appointmentReminders ?? true,
    paymentAlerts: clinicSettings.notifications?.paymentAlerts ?? true,
    labResultNotifications: clinicSettings.notifications?.labResultNotifications ?? true,
    whatsappUpdates: clinicSettings.notifications?.whatsappUpdates ?? true,
    dailySummaryEmail: clinicSettings.notifications?.dailySummaryEmail ?? false,
    currency: "INR (₹)",
    dateFormat: "DD/MM/YYYY",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      clinicName: formData.clinicName,
      tagline: formData.tagline,
      regNumber: formData.regNumber,
      phone: formData.phone,
      emergencyPhone: formData.emergencyPhone,
      email: formData.email,
      website: formData.website,
      address: formData.address,
      adminUser: {
        name: formData.adminName,
        role: formData.adminRole,
        email: formData.adminEmail,
        phone: formData.adminPhone,
      },
      notifications: {
        appointmentReminders: formData.appointmentReminders,
        paymentAlerts: formData.paymentAlerts,
        labResultNotifications: formData.labResultNotifications,
        whatsappUpdates: formData.whatsappUpdates,
        dailySummaryEmail: formData.dailySummaryEmail,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Clinic Settings & Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage clinic practice profile, administrator credentials, and notification rules.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => setActiveTab("clinic")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "clinic"
              ? "border-teal-700 text-teal-800"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Clinic Profile
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "account"
              ? "border-teal-700 text-teal-800"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          <User className="w-4 h-4" />
          User & Roles
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "notifications"
              ? "border-teal-700 text-teal-800"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications & Alerts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("appearance")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "appearance"
              ? "border-teal-700 text-teal-800"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          <Palette className="w-4 h-4" />
          Appearance & Localization
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Clinic Profile */}
        {activeTab === "clinic" && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Practice Information & Header Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinic Legal Name *
                </label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tagline / Practice Subtitle
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registration / Medical License Number
                </label>
                <input
                  type="text"
                  name="regNumber"
                  value={formData.regNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Front Desk Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Emergency Helpline
                </label>
                <input
                  type="text"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Physical Address (Used on invoices & prescriptions)
              </label>
              <textarea
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Account */}
        {activeTab === "account" && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Administrator Profile & Role Management
            </h3>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
                alt="Admin"
                className="w-14 h-14 rounded-full object-cover border-2 border-teal-600"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{formData.adminName}</p>
                <p className="text-teal-700 font-medium">{formData.adminRole}</p>
                <p className="text-slate-400 text-[11px]">Primary Practice Administrator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation / Role</label>
                <input
                  type="text"
                  name="adminRole"
                  value={formData.adminRole}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100 text-teal-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Two-Factor Authentication (2FA) is enforced for all clinical staff.</span>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Automated Alerts & Patient Communications
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-200/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="appointmentReminders"
                  checked={formData.appointmentReminders}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    SMS & WhatsApp Appointment Reminders
                  </span>
                  <span className="text-slate-500">
                    Automatically dispatch visit reminder 24 hours prior to scheduled OPD slot.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-200/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="paymentAlerts"
                  checked={formData.paymentAlerts}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Payment Receipts & Invoices
                  </span>
                  <span className="text-slate-500">
                    Email itemized tax invoice directly upon payment clearance.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-200/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="labResultNotifications"
                  checked={formData.labResultNotifications}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Lab & Diagnostic Result Alerts
                  </span>
                  <span className="text-slate-500">
                    Notify doctor and patient when blood panel or radiology reports are uploaded.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-200/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="whatsappUpdates"
                  checked={formData.whatsappUpdates}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    WhatsApp Business API Integration
                  </span>
                  <span className="text-slate-500">
                    Send e-Prescriptions directly to patient's registered mobile number.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-200/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="dailySummaryEmail"
                  checked={formData.dailySummaryEmail}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">
                    Daily Revenue Digest Email
                  </span>
                  <span className="text-slate-500">
                    Send end-of-day summary to practice directors at 9:00 PM.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Appearance */}
        {activeTab === "appearance" && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Theme & Localization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Color System / Theme
                </label>
                <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      CarePoint Healthcare Teal
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standardized clinical high-contrast palette
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-teal-700" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Display Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                  <option value="USD ($)">US Dollar (USD $)</option>
                  <option value="EUR (€)">Euro (EUR €)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
              <span className="font-bold text-slate-800 block mb-1">
                Accessibility Standard:
              </span>
              <span>
                CarePoint CRM follows WCAG AA healthcare compliance with clear typography, high contrast ratios, and screen-reader accessibility.
              </span>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Clinic Settings
          </button>
        </div>
      </form>
    </div>
  );
}
