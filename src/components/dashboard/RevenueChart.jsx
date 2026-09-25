import React, { useState } from "react";
import { useClinic } from "../../context/ClinicContext";

export default function RevenueChart() {
  const { revenueTrends } = useClinic();
  const [activeDay, setActiveDay] = useState(revenueTrends[revenueTrends.length - 1]);

  const maxRevenue = Math.max(...revenueTrends.map((d) => d.revenue));

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Revenue Overview</h3>
          <p className="text-xs text-slate-500">Last 7 days clinic collections</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Selected: {activeDay.day}</span>
          <span className="text-sm font-bold text-teal-700">
            ₹{activeDay.revenue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1">
        {revenueTrends.map((item) => {
          const heightPercent = Math.max(15, Math.round((item.revenue / maxRevenue) * 100));
          const isSelected = activeDay.day === item.day;

          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
              onMouseEnter={() => setActiveDay(item)}
            >
              {/* Tooltip on hover */}
              <div
                className={`text-[10px] font-semibold py-0.5 px-1.5 rounded transition-all duration-150 ${
                  isSelected
                    ? "bg-slate-900 text-white opacity-100 scale-105"
                    : "text-slate-400 opacity-0 group-hover:opacity-100"
                }`}
              >
                ₹{(item.revenue / 1000).toFixed(1)}k
              </div>

              {/* Bar */}
              <div className="w-full max-w-[28px] bg-slate-100 rounded-t-md h-full flex items-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isSelected
                      ? "bg-teal-700 shadow-sm"
                      : "bg-teal-500/70 group-hover:bg-teal-600"
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[10px] truncate max-w-[42px] ${
                  isSelected ? "font-bold text-teal-800" : "text-slate-400 font-medium"
                }`}
              >
                {item.day.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-teal-700 inline-block" />
          OPD Consultations & Diagnostics
        </span>
        <span className="font-semibold text-slate-700">Avg. ₹20,185 / day</span>
      </div>
    </div>
  );
}
