import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useClinic();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isWarning = toast.type === "warning";
        const isInfo = toast.type === "info";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? "bg-emerald-900 text-white border-emerald-800"
                : isWarning
                ? "bg-rose-900 text-white border-rose-800"
                : "bg-slate-900 text-white border-slate-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
              {isInfo && <Info className="w-4 h-4 text-sky-300 shrink-0" />}
              <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
