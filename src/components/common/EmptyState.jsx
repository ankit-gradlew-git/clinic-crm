import React from "react";
import { Search } from "lucide-react";

export default function EmptyState({
  icon: Icon = Search,
  title = "No results found",
  description = "Try adjusting your search query or filters to find what you're looking for.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 my-4">
      <div className="p-3.5 bg-slate-100 text-slate-500 rounded-full mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
