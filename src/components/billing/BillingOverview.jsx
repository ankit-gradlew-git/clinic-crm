import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  CreditCard,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  Trash2,
  Printer,
  ChevronRight,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import StatCard from "../common/StatCard";
import StatusBadge from "../common/StatusBadge";
import PatientAvatar from "../common/PatientAvatar";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import InvoiceDetailModal from "./InvoiceDetailModal";
import InvoiceFormModal from "./InvoiceFormModal";

export default function BillingOverview() {
  const {
    invoices,
    deleteInvoice,
    updateInvoiceStatus,
    todayDateStr,
    setCurrentTab,
    setActivePatientId,
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Computed metrics
  const todayRevenue = invoices
    .filter((inv) => inv.date === todayDateStr && inv.status === "Paid")
    .reduce((sum, i) => sum + i.total, 0);

  const pendingPayments = invoices
    .filter((inv) => inv.status === "Pending" || inv.status === "Partially Paid")
    .reduce((sum, i) => sum + i.total, 0);

  const paidCount = invoices.filter((inv) => inv.status === "Paid").length;
  const totalInvoicesCount = invoices.length;

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.id.toLowerCase().includes(q) ||
      inv.patientName.toLowerCase().includes(q) ||
      inv.paymentMethod.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "All" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Billing & Accounts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor revenue flow, manage patient invoices, and track outstanding balances.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toLocaleString("en-IN")}`}
          change="+14%"
          isPositive={true}
          description="Collected across OPD counters"
          icon={CreditCard}
          accentColor="teal"
        />
        <StatCard
          title="Pending Receivables"
          value={`₹${pendingPayments.toLocaleString("en-IN")}`}
          change="Insurance / Cash due"
          isPositive={false}
          description="Awaiting patient or TPA clearance"
          icon={Clock}
          accentColor="amber"
        />
        <StatCard
          title="Paid Invoices"
          value={`${paidCount} Invoices`}
          change="92% settlement rate"
          isPositive={true}
          description="Successfully reconciled"
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Total Invoices"
          value={totalInvoicesCount}
          description="Fiscal year records to date"
          icon={FileText}
          accentColor="blue"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice ID, patient name, payment method..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {["All", "Paid", "Pending", "Partially Paid"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-teal-700 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <EmptyState
            title="No invoices found"
            description="Generate a new invoice or adjust your status search filter."
            actionLabel="Create Invoice"
            onAction={() => setIsFormOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Invoice ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Attending Doctor</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <td className="px-5 py-3.5 font-mono text-slate-600 font-bold">
                      {inv.id}
                    </td>

                    <td className="px-4 py-3.5 font-medium">
                      <div
                        className="flex items-center gap-2.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTab("patients");
                          setActivePatientId(inv.patientId);
                        }}
                      >
                        <PatientAvatar name={inv.patientName} size="sm" />
                        <div>
                          <span className="font-semibold text-slate-900 group-hover:text-teal-700 block">
                            {inv.patientName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {inv.patientId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500">
                      {inv.date}
                    </td>

                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {inv.doctorName}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{inv.total.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      {inv.paymentMethod}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>

                    <td
                      className="px-5 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status !== "Paid" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateInvoiceStatus(inv.id, "Paid", "UPI")
                            }
                            className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="View / Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setInvoiceToDelete(inv)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}

      {/* Create Invoice Modal */}
      <InvoiceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Delete Confirmation */}
      {invoiceToDelete && (
        <ConfirmDialog
          isOpen={Boolean(invoiceToDelete)}
          onClose={() => setInvoiceToDelete(null)}
          onConfirm={() => deleteInvoice(invoiceToDelete.id)}
          title="Delete Invoice"
          message={`Are you sure you want to permanently delete invoice ${invoiceToDelete.id} for ${invoiceToDelete.patientName}?`}
        />
      )}
    </div>
  );
}
