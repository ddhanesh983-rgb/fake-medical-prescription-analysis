import React, { useState } from 'react';
import { DashboardStats, AnalysisRecord } from '../types/prescription';
import { ShieldCheck, ShieldAlert, FileQuestion, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats;
  history: AnalysisRecord[];
  onNavigate: (tab: string) => void;
  onSelectRecord: (record: AnalysisRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, history, onNavigate, onSelectRecord }) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const total = stats.total || history.length || 1;
  const suspiciousCount = stats.suspicious;
  const nominalCount = stats.nominal;
  const failedCount = stats.failed;

  // Pie angles
  const suspiciousPct = Math.round((suspiciousCount / total) * 100);
  const nominalPct = Math.round((nominalCount / total) * 100);
  const failedPct = 100 - suspiciousPct - nominalPct;

  // Indicator counts computed from real database records
  const flagCounts: Record<string, number> = {
    'Missing Doctor Reg No': 0,
    'Schedule II Controlled Drug': 0,
    'Unverified Signature / Stamp': 0,
    'Missing Prescription Date': 0,
    'Future / Inconsistent Date': 0,
    'Format Discrepancies': 0
  };

  history.forEach(r => {
    r.suspiciousFlags.forEach(f => {
      if (f.code === 'MISSING_REG_NO') flagCounts['Missing Doctor Reg No']++;
      else if (f.code === 'SCHEDULE_DRUG_ALERT') flagCounts['Schedule II Controlled Drug']++;
      else if (f.code === 'NO_SIGNATURE_STAMP') flagCounts['Unverified Signature / Stamp']++;
      else if (f.code === 'MISSING_DATE') flagCounts['Missing Prescription Date']++;
      else if (f.code === 'FUTURE_DATE' || f.code === 'EXPIRED_DATE') flagCounts['Future / Inconsistent Date']++;
      else flagCounts['Format Discrepancies']++;
    });
  });

  const maxFlagCount = Math.max(...Object.values(flagCounts), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Prescription Screening Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time aggregate triage data computed from SQLite analysis logs.
          </p>
        </div>
        <button
          onClick={() => onNavigate('detect')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded transition-colors shadow-xs cursor-pointer"
        >
          <span>Scan New Document</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Prescriptions Screened
          </span>
          <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums my-2">
            {stats.total}
          </div>
          <p className="text-xs text-slate-500">Aggregated from local SQLite logs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
              Potentially Suspicious
            </span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-red-700 tabular-nums my-2">
            {stats.suspicious}
          </div>
          <p className="text-xs text-slate-500">Requires manual clinic verification</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Nominal Screening Profile
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-700 tabular-nums my-2">
            {stats.nominal}
          </div>
          <p className="text-xs text-slate-500">No anomalous red flags triggered</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Average Risk Index
            </span>
            <FileQuestion className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums my-2">
            {stats.avgRisk} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <p className="text-xs text-slate-500">Composite rule & ML probability</p>
        </div>
      </div>

      {/* Visual Analytics Grid (Doughnut & Horizontal Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Doughnut Chart: Verdict Distribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-1">
            Triage Verdict Distribution
          </h2>
          <p className="text-xs text-slate-500 mb-6">Proportion of screening classifications</p>

          <div className="flex flex-col items-center justify-center py-2">
            {/* SVG Doughnut */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="3.8"
                />
                {/* Suspicious Segment (Red) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth="3.8"
                  strokeDasharray={`${suspiciousPct} ${100 - suspiciousPct}`}
                  strokeDashoffset="0"
                />
                {/* Nominal Segment (Emerald) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="transparent"
                  stroke="#16a34a"
                  strokeWidth="3.8"
                  strokeDasharray={`${nominalPct} ${100 - nominalPct}`}
                  strokeDashoffset={`${-suspiciousPct}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {stats.total}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Screened</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2 mt-6 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <span className="text-slate-700">Potentially Suspicious</span>
                </div>
                <span className="font-mono text-slate-900 font-semibold tabular-nums">
                  {stats.suspicious} ({suspiciousPct}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-slate-700">Nominal Indicators</span>
                </div>
                <span className="font-mono text-slate-900 font-semibold tabular-nums">
                  {stats.nominal} ({nominalPct}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-700">Unable to Analyze</span>
                </div>
                <span className="font-mono text-slate-900 font-semibold tabular-nums">
                  {stats.failed} ({failedPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Suspicious Indicators Breakdown */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-1">
            Top Triggered Suspicious Indicators
          </h2>
          <p className="text-xs text-slate-500 mb-6">Frequency of anomaly signals across analyzed documents</p>

          <div className="space-y-4">
            {Object.entries(flagCounts).map(([label, count]) => {
              const barPercent = Math.round((count / maxFlagCount) * 100);
              return (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{label}</span>
                    <span className="font-mono text-slate-900 tabular-nums font-semibold">
                      {count} occurrences
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-700 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(barPercent, count > 0 ? 8 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            Data reflects real cumulative checks performed since database initialization. Controlled substance alerts and missing doctor registration IDs constitute the primary drivers of elevated risk scores.
          </div>
        </div>
      </div>

      {/* Recent Analysis Logs Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Recent Prescription Screening Logs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Most recent triage events logged in SQLite</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors cursor-pointer"
          >
            View Full Audit History →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">ID</th>
                <th className="py-2.5 px-3 font-semibold">Timestamp (UTC)</th>
                <th className="py-2.5 px-3 font-semibold">File Name</th>
                <th className="py-2.5 px-3 font-semibold">Screening Verdict</th>
                <th className="py-2.5 px-3 font-semibold">Risk Score</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.slice(0, 5).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">#{row.id}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{row.timestamp}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{row.filename}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-semibold ${
                        row.status.includes('Suspicious')
                          ? 'text-red-700'
                          : row.status.includes('No Suspicious')
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                    {row.riskScore} / 100
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectRecord(row)}
                      className="text-xs text-sky-700 hover:text-sky-800 font-medium hover:underline cursor-pointer"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
