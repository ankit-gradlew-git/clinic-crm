import React, { useState } from "react";
import { ClinicProvider, useClinic } from "./context/ClinicContext";
import Layout from "./components/layout/Layout";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import PatientList from "./components/patients/PatientList";
import PatientDetailModal from "./components/patients/PatientDetailModal";
import PatientFormModal from "./components/patients/PatientFormModal";
import AppointmentList from "./components/appointments/AppointmentList";
import AppointmentModal from "./components/appointments/AppointmentModal";
import DoctorList from "./components/doctors/DoctorList";
import MedicalRecordList from "./components/records/MedicalRecordList";
import MedicalRecordModal from "./components/records/MedicalRecordModal";
import PrescriptionList from "./components/prescriptions/PrescriptionList";
import BillingOverview from "./components/billing/BillingOverview";
import InvoiceFormModal from "./components/billing/InvoiceFormModal";
import ReportsView from "./components/reports/ReportsView";
import SettingsView from "./components/settings/SettingsView";

function ClinicApp() {
  const {
    currentTab,
    setCurrentTab,
    activePatientId,
    setActivePatientId,
  } = useClinic();

  // Modals state
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [preselectedPatientForApt, setPreselectedPatientForApt] = useState(null);

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Quick Action from Navbar
  const handleQuickAction = (actionType) => {
    switch (actionType) {
      case "add-patient":
        setPatientToEdit(null);
        setIsPatientFormOpen(true);
        break;
      case "add-appointment":
        setAppointmentToEdit(null);
        setPreselectedPatientForApt(null);
        setIsAppointmentModalOpen(true);
        break;
      case "add-record":
        setIsRecordModalOpen(true);
        break;
      case "add-invoice":
        setIsInvoiceModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleBookWithDoctor = (doc) => {
    setAppointmentToEdit(null);
    setPreselectedPatientForApt(null);
    setIsAppointmentModalOpen(true);
  };

  const handleBookWithPatient = (pat) => {
    setAppointmentToEdit(null);
    setPreselectedPatientForApt(pat);
    setIsAppointmentModalOpen(true);
  };

  return (
    <Layout onQuickAction={handleQuickAction}>
      {/* 9 Main Clinic CRM Tabs */}
      {currentTab === "dashboard" && (
        <DashboardOverview
          onOpenPatientModal={() => {
            setPatientToEdit(null);
            setIsPatientFormOpen(true);
          }}
          onOpenAppointmentModal={() => {
            setAppointmentToEdit(null);
            setPreselectedPatientForApt(null);
            setIsAppointmentModalOpen(true);
          }}
        />
      )}

      {currentTab === "patients" && (
        <PatientList
          onAddPatient={() => {
            setPatientToEdit(null);
            setIsPatientFormOpen(true);
          }}
          onEditPatient={(pat) => {
            setPatientToEdit(pat);
            setIsPatientFormOpen(true);
          }}
          onViewPatient={(pat) => {
            setActivePatientId(pat.id);
          }}
        />
      )}

      {currentTab === "appointments" && (
        <AppointmentList
          onAddAppointment={() => {
            setAppointmentToEdit(null);
            setPreselectedPatientForApt(null);
            setIsAppointmentModalOpen(true);
          }}
          onEditAppointment={(apt) => {
            setAppointmentToEdit(apt);
            setIsAppointmentModalOpen(true);
          }}
        />
      )}

      {currentTab === "doctors" && (
        <DoctorList
          onBookAppointmentWithDoctor={handleBookWithDoctor}
        />
      )}

      {currentTab === "records" && (
        <MedicalRecordList
          onAddRecord={() => setIsRecordModalOpen(true)}
        />
      )}

      {currentTab === "prescriptions" && <PrescriptionList />}

      {currentTab === "billing" && <BillingOverview />}

      {currentTab === "reports" && <ReportsView />}

      {currentTab === "settings" && <SettingsView />}

      {/* Global Modals */}
      {/* Patient Profile View Modal */}
      {activePatientId && (
        <PatientDetailModal
          isOpen={Boolean(activePatientId)}
          onClose={() => setActivePatientId(null)}
          patientId={activePatientId}
          onEditPatient={(pat) => {
            setPatientToEdit(pat);
            setIsPatientFormOpen(true);
          }}
          onBookAppointment={handleBookWithPatient}
        />
      )}

      {/* Add / Edit Patient Modal */}
      <PatientFormModal
        isOpen={isPatientFormOpen}
        onClose={() => {
          setIsPatientFormOpen(false);
          setPatientToEdit(null);
        }}
        patientToEdit={patientToEdit}
      />

      {/* Add / Edit Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setAppointmentToEdit(null);
          setPreselectedPatientForApt(null);
        }}
        appointmentToEdit={appointmentToEdit}
        preselectedPatient={preselectedPatientForApt}
      />

      {/* Add Medical Record Modal */}
      <MedicalRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />

      {/* Create Invoice Modal */}
      <InvoiceFormModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <ClinicApp />
    </ClinicProvider>
  );
}
