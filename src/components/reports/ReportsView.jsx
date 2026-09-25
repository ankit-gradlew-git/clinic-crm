import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Download,
  Filter,
  ArrowUpRight,
  PieChart,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import StatCard from "../common/StatCard";

export default function ReportsView() {
  const { patients, appointments, invoices, revenueTrends } = useClinic();
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  // Calculations
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === "Active").length;
  const newPatientsCount = 4;
  const returningPatientsCount = totalPatients - newPatientsCount;

  // Appointment counts
  const completedApts = appointments.filter((a) => a.status === "Completed").length;
  const waitingApts = appointments.filter((a) => a.status === "Waiting").length;
  const confirmedApts = appointments.filter((a) => a.status === "Confirmed").length;
  const cancelledApts = appointments.filter((a) => a.status === "Cancelled").length;
  const totalAppointmentsCount = appointments.length;

  // Revenue metrics
  const totalRevenueCollected = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, item) => sum + item.total, 0);

  const pendingRevenue = invoices
    .filter((i) => i.status === "Pending" || i.status === "Partially Paid")
    .reduce((sum, item) => sum + item.total, 0);

  // Payment methods breakdown
  const paymentMethods = [
    { name: "UPI (GPay / Paytm)", percentage: 48, amount: 16800, color: "bg-teal-600" },
    { name: "Credit / Debit Cards", percentage: 32, amount: 11200, color: "bg-blue-600" },
    { name: "Cash Counter", percentage: 12, amount: 4200, color: "bg-amber-500" },
    { name: "Insurance / TPA", percentage: 8, amount: 2800, color: "bg-indigo-500" },
  ];

  // Specialty patient volume
  const specialtyDistribution = [
    { specialty: "General Medicine", count: 32, color: "bg-teal-500" },
    { specialty: "Dermatology", count: 24, color: "bg-blue-500" },
    { specialty: "Pediatrics", count: 18, color: "bg-amber-500" },
    { specialty: "Cardiology", count: 15, color: "bg-emerald-500" },
    { specialty: "Orthopedics", count: 11, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Clinic Analytics & Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Performance indicators across patient acquisition, clinical consultations, and revenue.
          </p>
        </div>

        {/* Filter and Export */}
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="Today">Today (22 Sep 2026)</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month (Sep 2026)</option>
            <option value="Last Quarter">Last Quarter</option>
          </select>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Summary
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Patient Growth"
          value={`+${newPatientsCount} New`}
          change="+18% MoM"
          isPositive={true}
          description="Total active patient base: 10"
          icon={Users}
          accentColor="teal"
        />
        <StatCard
          title="Consultations Done"
          value={completedApts}
          change="88% fulfillment"
          isPositive={true}
          description="Out of scheduled visits"
          icon={Calendar}
          accentColor="blue"
        />
        <StatCard
          title="Net Revenue Collected"
          value={`₹${totalRevenueCollected.toLocaleString("en-IN")}`}
          change="+14.5% vs last week"
          isPositive={true}
          description="Cleared invoices"
          icon={CreditCard}
          accentColor="emerald"
        />
        <StatCard
          title="Pending Receivables"
          value={`₹${pendingRevenue.toLocaleString("en-IN")}`}
          change="Action required"
          isPositive={false}
          description="Pending patient copays & insurance"
          icon={TrendingUp}
          accentColor="amber"
        />
      </div>

      {/* Section 1: Revenue & Financial Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daily Revenue Collections (₹)
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated OPD consultations, diagnostic services, and procedures.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Avg. ₹20.1k / day
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-8 pb-3 px-2 border-b border-slate-100">
            {revenueTrends.map((d) => {
              const maxVal = 28000;
              const heightPercent = Math.round((d.revenue / maxVal) * 100);

              return (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                >
                  <div className="text-[10px] font-bold text-slate-800 opacity-90 group-hover:text-teal-700">
                    ₹{(d.revenue / 1000).toFixed(1)}k
                  </div>
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-md h-full flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-teal-700 group-hover:bg-teal-800 rounded-t-md transition-all duration-300 shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    {d.day.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Total Collections (7 Days): ₹1,34,400</span>
            <span className="font-semibold text-emerald-700">Growth: +14.2%</span>
          </div>
        </div>

        {/* Payment Channels Breakdown (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Payment Method Breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of incoming OPD revenues
            </p>

            {/* Bars */}
            <div className="space-y-3.5">
              {paymentMethods.map((pm) => (
                <div key={pm.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{pm.name}</span>
                    <span className="font-bold text-slate-900">
                      {pm.percentage}% (₹{pm.amount.toLocaleString("en-IN")})
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pm.percentage}%` }}
                      className={`${pm.color} h-full rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>UPI settlement: Instant</span>
            <span className="font-semibold text-teal-700">Digital Share: 80%</span>
          </div>
        </div>
      </div>

      {/* Section 2: Clinical & Appointment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Analysis */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Appointment Fulfillment & Cancellation Rate
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Analysis of scheduled visits and doctor clinic utilization.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <p className="text-xs text-emerald-800 font-medium">Completed</p>
              <p className="text-lg font-bold text-emerald-900 mt-0.5">
                {completedApts}
              </p>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-center">
              <p className="text-xs text-teal-800 font-medium">Confirmed</p>
              <p className="text-lg font-bold text-teal-900 mt-0.5">
                {confirmedApts}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <p className="text-xs text-amber-800 font-medium">Waiting</p>
              <p className="text-lg font-bold text-amber-900 mt-0.5">
                {waitingApts}
              </p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
              <p className="text-xs text-rose-800 font-medium">Cancelled</p>
              <p className="text-lg font-bold text-rose-900 mt-0.5">
                {cancelledApts}
              </p>
            </div>
          </div>

          {/* Progress bar stack */}
          <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
            <div
              style={{
                width: `${(completedApts / totalAppointmentsCount) * 100}%`,
              }}
              className="bg-emerald-600 h-full"
              title="Completed"
            />
            <div
              style={{
                width: `${(confirmedApts / totalAppointmentsCount) * 100}%`,
              }}
              className="bg-teal-600 h-full"
              title="Confirmed"
            />
            <div
              style={{
                width: `${(waitingApts / totalAppointmentsCount) * 100}%`,
              }}
              className="bg-amber-500 h-full"
              title="Waiting"
            />
            <div
              style={{
                width: `${(cancelledApts / totalAppointmentsCount) * 100}%`,
              }}
              className="bg-rose-500 h-full"
              title="Cancelled"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>Completed ({Math.round((completedApts / totalAppointmentsCount) * 100)}%)</span>
            <span>No-Show / Cancelled: {cancelledApts}</span>
          </div>
        </div>

        {/* Patient Specialization Demand */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Departmental Patient Volume
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Patient footfall distribution across clinical specialties
          </p>

          <div className="space-y-3">
            {specialtyDistribution.map((spec) => (
              <div key={spec.specialty}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{spec.specialty}</span>
                  <span className="font-bold text-slate-900">{spec.count} visits</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(spec.count / 32) * 100}%` }}
                    className={`${spec.color} h-full rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest demand: General Medicine</span>
            <span className="font-semibold text-teal-700">98% satisfaction rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
