import React from "react";
import Modal from "../common/Modal";
import StatusBadge from "../common/StatusBadge";
import { Printer, CheckCircle2, Activity } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  const { clinicSettings, patients, updateInvoiceStatus } = useClinic();

  if (!isOpen || !invoice) return null;

  const patient = patients.find((p) => p.id === invoice.patientId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Tax Invoice #${invoice.id}`}
      subtitle={`Billing receipt for ${invoice.patientName}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {invoice.status !== "Paid" && (
              <button
                type="button"
                onClick={() => {
                  updateInvoiceStatus(invoice.id, "Paid", "UPI");
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark as Paid (UPI)
              </button>
            )}
          </div>
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
              Print Invoice
            </button>
          </div>
        </div>
      }
    >
      {/* Printable Invoice Container */}
      <div className="printable-area bg-white p-2 sm:p-4 text-slate-800 text-xs space-y-4">
        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
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
              <p className="text-[10px] text-slate-500 mt-0.5">
                GSTIN / Reg: {clinicSettings.regNumber} • Phone: {clinicSettings.phone}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-black text-slate-900 block tracking-tight">
              INVOICE
            </span>
            <span className="font-mono text-xs font-bold text-teal-700 block">
              {invoice.id}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Date: {invoice.date}
            </span>
          </div>
        </div>

        {/* Bill To / Details */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
              Billed To (Patient):
            </span>
            <p className="font-bold text-slate-900 text-sm">{invoice.patientName}</p>
            <p className="text-slate-600">ID: {invoice.patientId}</p>
            {patient && (
              <>
                <p className="text-slate-600">Phone: {patient.phone}</p>
                <p className="text-slate-500 text-[11px] truncate">{patient.address}</p>
              </>
            )}
          </div>

          <div className="text-right sm:text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
              Payment Information:
            </span>
            <div className="inline-block mb-1">
              <StatusBadge status={invoice.status} size="md" />
            </div>
            <p className="text-slate-700 font-medium">Method: {invoice.paymentMethod}</p>
            {invoice.paidDate && (
              <p className="text-[11px] text-slate-500">Paid on: {invoice.paidDate}</p>
            )}
            <p className="text-[11px] text-slate-500">Physician: {invoice.doctorName}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Service / Procedure Description</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-right">Unit Price</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">
                    {item.description}
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600 font-medium">
                    {item.qty}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-600">
                    ₹{item.unitPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-900">
                    ₹{(item.qty * item.unitPrice).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount Applied:</span>
                <span>-₹{invoice.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Taxes / GST:</span>
              <span>₹{invoice.tax || 0}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Payable:</span>
              <span className="text-teal-800">₹{invoice.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer / Terms */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <p>This is a computer-generated medical bill issued by CarePoint Clinic EMR.</p>
          <p>Thank you for choosing CarePoint Healthcare.</p>
        </div>
      </div>
    </Modal>
  );
}
