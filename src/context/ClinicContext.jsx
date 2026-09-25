import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialClinicSettings,
  initialDoctors,
  initialPatients,
  initialAppointments,
  initialMedicalRecords,
  initialPrescriptions,
  initialInvoices,
  revenueTrends,
} from "../data/initialData";

const ClinicContext = createContext(null);

const STORAGE_KEY = "carepoint_clinic_crm_v1";

export function ClinicProvider({ children }) {
  // Initialize state with localStorage if available, or fall back to mock data
  const [dataLoaded, setDataLoaded] = useState(false);

  const [clinicSettings, setClinicSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialClinicSettings;
    } catch {
      return initialClinicSettings;
    }
  });

  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_doctors`);
      return saved ? JSON.parse(saved) : initialDoctors;
    } catch {
      return initialDoctors;
    }
  });

  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patients`);
      return saved ? JSON.parse(saved) : initialPatients;
    } catch {
      return initialPatients;
    }
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
      return saved ? JSON.parse(saved) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  const [medicalRecords, setMedicalRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_records`);
      return saved ? JSON.parse(saved) : initialMedicalRecords;
    } catch {
      return initialMedicalRecords;
    }
  });

  const [prescriptions, setPrescriptions] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_prescriptions`);
      return saved ? JSON.parse(saved) : initialPrescriptions;
    } catch {
      return initialPrescriptions;
    }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
      return saved ? JSON.parse(saved) : initialInvoices;
    } catch {
      return initialInvoices;
    }
  });

  // UI / Navigation state
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [activePatientId, setActivePatientId] = useState(null);
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [activeRecordId, setActiveRecordId] = useState(null);
  const [activePrescriptionId, setActivePrescriptionId] = useState(null);
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);

  // Global search modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toast feedback
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(clinicSettings));
      localStorage.setItem(`${STORAGE_KEY}_doctors`, JSON.stringify(doctors));
      localStorage.setItem(`${STORAGE_KEY}_patients`, JSON.stringify(patients));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_records`, JSON.stringify(medicalRecords));
      localStorage.setItem(`${STORAGE_KEY}_prescriptions`, JSON.stringify(prescriptions));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
    } catch (err) {
      console.warn("Could not save to localStorage", err);
    }
  }, [clinicSettings, doctors, patients, appointments, medicalRecords, prescriptions, invoices]);

  // Reset to initial demo data
  const resetDemoData = () => {
    setClinicSettings(initialClinicSettings);
    setDoctors(initialDoctors);
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setMedicalRecords(initialMedicalRecords);
    setPrescriptions(initialPrescriptions);
    setInvoices(initialInvoices);
    localStorage.clear();
    addToast("Clinic demo data reset to defaults", "info");
  };

  // --- CRUD: PATIENTS ---
  const addPatient = (newPatient) => {
    const nextId = `PT-${1000 + patients.length + 1}`;
    const patientObj = {
      ...newPatient,
      id: nextId,
      registeredDate: new Date().toISOString().split("T")[0],
      status: newPatient.status || "Active",
    };
    setPatients((prev) => [patientObj, ...prev]);
    addToast(`Patient ${patientObj.name} added successfully`);
    return patientObj;
  };

  const updatePatient = (id, updatedFields) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    addToast("Patient profile updated successfully");
  };

  const deletePatient = (id) => {
    const patient = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    addToast(`Patient ${patient ? patient.name : id} removed`, "warning");
    if (activePatientId === id) setActivePatientId(null);
  };

  // --- CRUD: APPOINTMENTS ---
  const addAppointment = (newApt) => {
    const nextId = `APT-${200 + appointments.length + 1}`;
    const aptObj = {
      ...newApt,
      id: nextId,
      status: newApt.status || "Confirmed",
    };
    setAppointments((prev) => [aptObj, ...prev]);
    addToast(`Appointment scheduled for ${aptObj.patientName}`);
    return aptObj;
  };

  const updateAppointment = (id, updatedFields) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
    addToast("Appointment updated successfully");
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    addToast(`Appointment marked as ${status}`);
  };

  const deleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    addToast("Appointment cancelled / removed", "warning");
  };

  // --- CRUD: DOCTORS ---
  const addDoctor = (newDoc) => {
    const nextId = `DOC-00${doctors.length + 1}`;
    const docObj = {
      ...newDoc,
      id: nextId,
      appointmentsToday: 0,
      rating: 5.0,
      status: "Available",
      avatar:
        newDoc.avatar ||
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250",
    };
    setDoctors((prev) => [...prev, docObj]);
    addToast(`Dr. ${docObj.name} added to clinic staff`);
    return docObj;
  };

  const updateDoctor = (id, updatedFields) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
    addToast("Doctor profile updated successfully");
  };

  // --- CRUD: MEDICAL RECORDS ---
  const addMedicalRecord = (newRec) => {
    const nextId = `REC-${400 + medicalRecords.length + 1}`;
    const recordObj = {
      ...newRec,
      id: nextId,
      date: newRec.date || new Date().toISOString().split("T")[0],
      status: "Finalized",
    };
    setMedicalRecords((prev) => [recordObj, ...prev]);
    addToast("Medical record created successfully");
    return recordObj;
  };

  const deleteMedicalRecord = (id) => {
    setMedicalRecords((prev) => prev.filter((r) => r.id !== id));
    addToast("Medical record deleted", "warning");
  };

  // --- CRUD: PRESCRIPTIONS ---
  const addPrescription = (newRx) => {
    const nextId = `RX-${500 + prescriptions.length + 1}`;
    const rxObj = {
      ...newRx,
      id: nextId,
      date: newRx.date || new Date().toISOString().split("T")[0],
      status: "Active",
    };
    setPrescriptions((prev) => [rxObj, ...prev]);
    addToast(`Prescription ${nextId} generated`);
    return rxObj;
  };

  const deletePrescription = (id) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    addToast("Prescription deleted", "warning");
  };

  // --- CRUD: INVOICES ---
  const addInvoice = (newInv) => {
    const nextId = `INV-${800 + invoices.length + 1}`;
    const invObj = {
      ...newInv,
      id: nextId,
      date: newInv.date || new Date().toISOString().split("T")[0],
      status: newInv.status || "Pending",
    };
    setInvoices((prev) => [invObj, ...prev]);
    addToast(`Invoice ${nextId} generated for ₹${invObj.total}`);
    return invObj;
  };

  const updateInvoiceStatus = (id, status, paymentMethod = "UPI") => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status,
              paymentMethod: status === "Paid" ? paymentMethod : inv.paymentMethod,
              paidDate: status === "Paid" ? new Date().toISOString().split("T")[0] : inv.paidDate,
            }
          : inv
      )
    );
    addToast(`Invoice marked as ${status}`);
  };

  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    addToast("Invoice deleted", "warning");
  };

  // --- SETTINGS ---
  const updateSettings = (newSettings) => {
    setClinicSettings((prev) => ({ ...prev, ...newSettings }));
    addToast("Clinic settings updated successfully");
  };

  // Computed helper values
  const todayDateStr = "2026-09-22";
  const todayAppointments = appointments.filter((a) => a.date === todayDateStr);
  const todayRevenue = invoices
    .filter((inv) => inv.date === todayDateStr && inv.status === "Paid")
    .reduce((acc, curr) => acc + (curr.total || 0), 0);

  const value = {
    clinicSettings,
    doctors,
    patients,
    appointments,
    medicalRecords,
    prescriptions,
    invoices,
    revenueTrends,
    todayDateStr,
    todayAppointments,
    todayRevenue,
    currentTab,
    setCurrentTab,
    activePatientId,
    setActivePatientId,
    activeDoctorId,
    setActiveDoctorId,
    activeRecordId,
    setActiveRecordId,
    activePrescriptionId,
    setActivePrescriptionId,
    activeInvoiceId,
    setActiveInvoiceId,
    isSearchOpen,
    setIsSearchOpen,
    toasts,
    addToast,
    removeToast,
    resetDemoData,
    addPatient,
    updatePatient,
    deletePatient,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    addDoctor,
    updateDoctor,
    addMedicalRecord,
    deleteMedicalRecord,
    addPrescription,
    deletePrescription,
    addInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    updateSettings,
  };

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
}
