import React from "react";

export default function PatientAvatar({ name = "", size = "md", gender = "Male" }) {
  const getInitials = (str) => {
    if (!str) return "PT";
    const parts = str.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Soft palette based on initials
  const bgPalette = [
    "bg-teal-100 text-teal-800 border-teal-200",
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-amber-100 text-amber-800 border-amber-200",
  ];

  const charCode = (name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0);
  const colorClass = bgPalette[charCode % bgPalette.length];

  const sizeClasses = {
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-14 h-14 text-lg font-bold",
    xl: "w-18 h-18 text-xl font-bold",
  }[size] || "w-10 h-10 text-sm font-semibold";

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center border select-none ${colorClass} ${sizeClasses}`}
    >
      {initials}
    </div>
  );
}
