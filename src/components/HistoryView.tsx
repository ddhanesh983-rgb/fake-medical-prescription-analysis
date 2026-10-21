import React, { useState } from 'react';
import { AnalysisRecord } from '../types/prescription';
import { Search, Trash2, FileText, Download, Shield } from 'lucide-react';
import { downloadPrescriptionPDF } from '../utils/pdfGenerator';

interface HistoryViewProps {
  history: AnalysisRecord[];
  onSelectRecord: (record: AnalysisRecord) => void;
  onDeleteRecord: (id: number) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectRecord,
  onDeleteRecord,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'suspicious' | 'nominal' | 'failed'>('all');

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.detectedFields.doctorName && item.detectedFields.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.detectedFields.patientName && item.detectedFields.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'suspicious') return item.status.includes('Suspicious');
    if (statusFilter === 'nominal') return item.status.includes('No Suspicious');
    if (statusFilter === 'failed') return item.status.includes('Unable');
    return true;
  });

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Filename', 'Status', 'RiskScore', 'ProcessingTimeMs', 'DoctorName', 'DoctorRegNo', 'PatientName'];
    const rows = history.map(h => [
      h.id,
      `"${h.timestamp}"`,
      `"${h.filename}"`,
      `"${h.status}"`,
      h.riskScore,
      h.processingTimeMs,
      `"${h.detectedFields.doctorName || ''}"`,
      `"${h.detectedFields.doctorRegNo || ''}"`,
      `"${h.detectedFields.patientName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rxshield_screening_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Prescription Screening Audit Trail
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Searchable historical database of all evaluated prescription documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={history.length === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
              history.length > 0
                ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all stored screening logs? This action is irreversible.')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
            >
              Clear All Records
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by filename, doctor, patient, or status..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
          />
        </div>

        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setStatusFilter('suspicious')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'suspicious' ? 'bg-white text-red-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Suspicious
          </button>
          <button
            onClick={() => setStatusFilter('nominal')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'nominal' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Nominal
          </button>
          <button
            onClick={() => setStatusFilter('failed')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'failed' ? 'bg-white text-amber-700 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Unanalyzed
          </button>
        </div>
      </div>

      {/* Audit History Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Document File</th>
                <th className="py-3 px-4 font-semibold">Screening Verdict</th>
                <th className="py-3 px-4 font-semibold">Risk Score</th>
                <th className="py-3 px-4 font-semibold">Doctor Registration</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">#{item.id}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">{item.timestamp}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    <div>{item.filename}</div>
                    {item.detectedFields.patientName && (
                      <span className="text-[11px] text-slate-500">
                        Pt: {item.detectedFields.patientName}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        item.status.includes('Suspicious')
                          ? 'text-red-700'
                          : item.status.includes('No Suspicious')
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                    {item.riskScore} / 100
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {item.detectedFields.doctorRegNo || (
                      <span className="text-red-600 font-sans">Missing</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onSelectRecord(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 rounded transition-colors cursor-pointer"
                      >
                        View Report
                      </button>
                      <button
                        onClick={() => downloadPrescriptionPDF(item)}
                        className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete screening audit record #${item.id}?`)) {
                            onDeleteRecord(item.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No prescription screening records match the specified search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy and Data Protection Notice */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
        <Shield className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800">Privacy & Deletion Governance:</strong> Patient records stored in the SQLite database are accessible only during this session and can be permanently removed at any time using the Delete or Clear All controls above. Prescription documents are stored locally for audit verification.
        </p>
      </div>
    </div>
  );
};
