import React from "react";

export default function StatusBadge({ status, size = "md" }) {
  const normalized = (status || "").toLowerCase();

  const styles = {
    // Appointment / Record / Invoice statuses
    confirmed: "bg-teal-50 text-teal-700 border-teal-200/80",
    waiting: "bg-amber-50 text-amber-700 border-amber-200/80",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200/80",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    inactive: "bg-slate-100 text-slate-600 border-slate-200",
    available: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    "in consultation": "bg-blue-50 text-blue-700 border-blue-200/80",
    "on break": "bg-amber-50 text-amber-700 border-amber-200/80",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    pending: "bg-amber-50 text-amber-700 border-amber-200/80",
    "partially paid": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    finalized: "bg-blue-50 text-blue-700 border-blue-200/80",
  };

  const currentStyle =
    styles[normalized] || "bg-slate-100 text-slate-700 border-slate-200";

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  }[size] || "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${currentStyle} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
}
