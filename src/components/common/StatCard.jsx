import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  description,
  icon: Icon,
  accentColor = "teal",
  onClick,
}) {
  const colorMap = {
    teal: {
      bg: "bg-teal-50 text-teal-700",
      border: "border-teal-100",
    },
    blue: {
      bg: "bg-blue-50 text-blue-700",
      border: "border-blue-100",
    },
    amber: {
      bg: "bg-amber-50 text-amber-700",
      border: "border-amber-100",
    },
    emerald: {
      bg: "bg-emerald-50 text-emerald-700",
      border: "border-emerald-100",
    },
    purple: {
      bg: "bg-purple-50 text-purple-700",
      border: "border-purple-100",
    },
  };

  const scheme = colorMap[accentColor] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-teal-300" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${scheme.bg} ${scheme.border} border`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-xs text-slate-500 leading-normal">{description}</p>
      )}
    </div>
  );
}
