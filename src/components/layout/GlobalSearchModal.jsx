import React, { useState, useEffect, useRef } from "react";
import { Search, User, Calendar, FileText, Receipt, ArrowRight, X } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    patients,
    doctors,
    appointments,
    invoices,
    setCurrentTab,
    setActivePatientId,
    setActiveInvoiceId,
  } = useClinic();

  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  // Global keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  const filteredPatients = cleanQ
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.id.toLowerCase().includes(cleanQ) ||
          p.phone.includes(cleanQ)
      )
    : [];

  const filteredDoctors = cleanQ
    ? doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(cleanQ) ||
          d.specialty.toLowerCase().includes(cleanQ)
      )
    : [];

  const filteredAppointments = cleanQ
    ? appointments.filter(
        (a) =>
          a.patientName.toLowerCase().includes(cleanQ) ||
          a.doctorName.toLowerCase().includes(cleanQ) ||
          a.id.toLowerCase().includes(cleanQ) ||
          a.type.toLowerCase().includes(cleanQ)
      )
    : [];

  const filteredInvoices = cleanQ
    ? invoices.filter(
        (i) =>
          i.id.toLowerCase().includes(cleanQ) ||
          i.patientName.toLowerCase().includes(cleanQ) ||
          i.status.toLowerCase().includes(cleanQ)
      )
    : [];

  const totalResults =
    filteredPatients.length +
    filteredDoctors.length +
    filteredAppointments.length +
    filteredInvoices.length;

  const handleSelect = (action) => {
    action();
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-xl border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/70">
            <Search className="w-5 h-5 text-teal-600 shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients, doctors, appointments, invoices..."
              className="w-full bg-transparent border-0 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ESC
            </kbd>
          </div>

          {/* Results Container */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-4">
            {!cleanQ ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Type a patient name, phone number, doctor specialty, or invoice ID...
              </div>
            ) : totalResults === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching records found for "{query}".
              </div>
            ) : (
              <>
                {/* Patients */}
                {filteredPatients.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                      Patients ({filteredPatients.length})
                    </span>
                    <div className="space-y-1">
                      {filteredPatients.slice(0, 4).map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() =>
                            handleSelect(() => {
                              setCurrentTab("patients");
                              setActivePatientId(patient.id);
                            })
                          }
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-teal-50/70 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-teal-100 text-teal-700 rounded-md">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-900">
                                {patient.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {patient.id} • {patient.phone} • {patient.bloodGroup}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctors */}
                {filteredDoctors.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                      Doctors ({filteredDoctors.length})
                    </span>
                    <div className="space-y-1">
                      {filteredDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() =>
                            handleSelect(() => {
                              setCurrentTab("doctors");
                            })
                          }
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-teal-50/70 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={doc.avatar}
                              alt={doc.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-900">
                                {doc.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {doc.specialty} • {doc.room}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appointments */}
                {filteredAppointments.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                      Appointments ({filteredAppointments.length})
                    </span>
                    <div className="space-y-1">
                      {filteredAppointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() =>
                            handleSelect(() => {
                              setCurrentTab("appointments");
                            })
                          }
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-teal-50/70 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-900">
                                {apt.patientName} with {apt.doctorName}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {apt.date} at {apt.time} • Status: {apt.status}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invoices */}
                {filteredInvoices.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                      Invoices ({filteredInvoices.length})
                    </span>
                    <div className="space-y-1">
                      {filteredInvoices.slice(0, 3).map((inv) => (
                        <div
                          key={inv.id}
                          onClick={() =>
                            handleSelect(() => {
                              setCurrentTab("billing");
                              setActiveInvoiceId(inv.id);
                            })
                          }
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-teal-50/70 cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-md">
                              <Receipt className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-900">
                                {inv.id} - {inv.patientName}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Total: ₹{inv.total} • Status: {inv.status}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
