import React, { useState } from "react";
import Modal from "../common/Modal";
import { Plus, Trash2 } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function InvoiceFormModal({ isOpen, onClose }) {
  const { addInvoice, patients, doctors } = useClinic();

  const [patientId, setPatientId] = useState(patients[0]?.id || "");
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || "");
  const [paymentMethod, setPaymentMethod] = useState("UPI (Google Pay)");
  const [status, setStatus] = useState("Paid");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState([
    { description: "Specialist Consultation Fee", qty: 1, unitPrice: 700 },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { description: "", qty: 1, unitPrice: 500 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  const total = Math.max(0, subtotal - Number(discount || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === patientId);
    const doc = doctors.find((d) => d.id === doctorId);

    const validItems = items.filter((it) => it.description.trim().length > 0);
    if (validItems.length === 0) {
      alert("Please enter at least one line item description.");
      return;
    }

    addInvoice({
      patientId,
      patientName: pat ? pat.name : "Patient",
      doctorId,
      doctorName: doc ? doc.name : "Doctor",
      date: new Date().toISOString().split("T")[0],
      items: validItems.map((it) => ({
        description: it.description,
        qty: Number(it.qty) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        amount: (Number(it.qty) || 1) * (Number(it.unitPrice) || 0),
      })),
      subtotal,
      discount: Number(discount) || 0,
      tax: 0,
      total,
      paymentMethod,
      status,
      notes,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Patient Invoice"
      subtitle="Generate itemized billing for consultations, lab tests, and procedures."
      maxWidth="max-w-2xl"
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
            Generate & Issue Invoice (₹{total.toLocaleString("en-IN")})
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
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
              Attending Physician *
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
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

        {/* Dynamic Line Items */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800">Services & Charges</h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg items-center"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(idx, "description", e.target.value)
                    }
                    placeholder="Description (e.g. ECG, Consultation, X-Ray)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(idx, "qty", Number(e.target.value))
                    }
                    placeholder="Qty"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-center"
                  />
                </div>

                <div className="col-span-3">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, "unitPrice", Number(e.target.value))
                    }
                    placeholder="Price (₹)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-right"
                  />
                </div>

                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment options & discount */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="UPI (Google Pay)">UPI (Google Pay)</option>
              <option value="UPI (Paytm)">UPI (Paytm)</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Insurance / TPA">Insurance / TPA</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Discount Amount (₹)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center justify-between font-medium">
          <span className="text-teal-900">
            Subtotal: <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
          </span>
          <span className="text-teal-900 text-sm font-bold">
            Total Payable: ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </form>
    </Modal>
  );
}
