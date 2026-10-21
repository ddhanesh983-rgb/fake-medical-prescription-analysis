import React, { useState } from 'react';
import { Download, ArrowLeft, AlertTriangle, CheckCircle, HelpCircle, FileText, Clock, FileCode } from 'lucide-react';
import { AnalysisRecord } from '../types/prescription';
import { downloadPrescriptionPDF } from '../utils/pdfGenerator';

interface ResultsViewProps {
  record: AnalysisRecord;
  onAnalyzeAnother: () => void;
  onOpenCodeExplorer: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ record, onAnalyzeAnother, onOpenCodeExplorer }) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'ocr'>('fields');

  const getStatusColor = (status: string) => {
    if (status.includes('Suspicious')) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: AlertTriangle,
        gauge: 'bg-red-600'
      };
    }
    if (status.includes('No Suspicious')) {
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        icon: CheckCircle,
        gauge: 'bg-emerald-600'
      };
    }
    return {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: HelpCircle,
      gauge: 'bg-amber-600'
    };
  };

  const statusStyle = getStatusColor(record.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner Navigation & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onAnalyzeAnother}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Analyze Another Prescription</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCodeExplorer}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-600" />
            <span>View Python Triage Code</span>
          </button>
          <button
            onClick={() => downloadPrescriptionPDF(record)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 px-4 py-1.5 rounded transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Primary Triage Verdict Banner */}
      <div className={`p-6 rounded-lg border ${statusStyle.bg} ${statusStyle.border} space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Screening Audit Record #{record.id}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-800">{record.filename}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3" />
                <span className="font-mono tabular-nums">{record.processingTimeMs} ms</span>
              </span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <StatusIcon className={`w-5 h-5 shrink-0 mt-0.5 ${statusStyle.text}`} />
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${statusStyle.text}`}>
                  {record.status}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                  Screening verdict generated via heuristic NLP verification and Scikit-learn TF-IDF classification. Final clinical dispensing decision requires pharmacist review.
                </p>
              </div>
            </div>
          </div>

          {/* Risk Score Widget */}
          <div className="bg-white/80 border border-slate-200/80 rounded-lg p-3 shrink-0 min-w-[200px] text-right">
            <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
              Calculated Risk Index
            </span>
            <div className="flex items-baseline justify-end gap-1 my-1">
              <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {record.riskScore}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full ${statusStyle.gauge} transition-all duration-500`}
                style={{ width: `${Math.max(record.riskScore, 6)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Document / OCR Text on Left, Clinical Fields & Suspicious Indicators on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Original Document & Extracted OCR Character Stream */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Prescription Document Scan
              </h2>
              <span className="text-xs text-slate-500">{record.fileSize || '1.2 MB'}</span>
            </div>

            {/* Document display */}
            <div className="bg-slate-50 rounded border border-slate-200 p-3 max-h-[380px] overflow-y-auto">
              {record.extractedText.includes('Arthur Pendelton') ? (
                <div className="p-4 bg-white rounded border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="text-center pb-2 border-b border-sky-600">
                    <strong className="text-sm font-bold text-sky-900 block">Apex Multi-Specialty Clinic</strong>
                    <span className="text-[10px] text-slate-500">Dr. Evelyn Vance, MBBS MD · Reg No: MCI-2018-84729</span>
                  </div>
                  <div className="flex justify-between text-[11px] py-1 border-b border-slate-100">
                    <span>Patient: Arthur Pendelton</span>
                    <span className="font-mono">12/04/2026</span>
                  </div>
                  <div className="py-2 text-[11px] space-y-1">
                    <strong className="text-sky-900">Rx</strong>
                    <p>1. Tab. Amoxicillin 625mg TDS x 5 days</p>
                    <p>2. Tab. Paracetamol 650mg SOS</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Refills: 0</span>
                    <span className="text-sky-700 italic border border-sky-200 bg-sky-50 px-2 py-0.5 rounded">
                      E. Vance MD Verified Seal
                    </span>
                  </div>
                </div>
              ) : record.extractedText.includes('Oxycodone') ? (
                <div className="p-4 bg-amber-50/50 rounded border border-amber-300 text-xs text-slate-800 space-y-2">
                  <div className="text-center pb-2 border-b border-red-400">
                    <strong className="text-sm font-bold text-red-800 block">Fast-Track Dispensary Order</strong>
                    <span className="text-[10px] text-red-600">Doctor Reg No: NOT PROVIDED</span>
                  </div>
                  <div className="flex justify-between text-[11px] py-1 border-b border-slate-200">
                    <span>Patient: John D.</span>
                    <span className="font-mono">14/04/2026</span>
                  </div>
                  <div className="py-2 text-[11px] space-y-1 text-red-950">
                    <strong className="text-red-700">Rx</strong>
                    <p>1. Oxycodone 80mg — Dispense 120 Tablets (Refill 5x)</p>
                    <p>2. Alprazolam 2mg — Dispense 90 Tablets</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-right text-[10px] text-red-500 italic">
                    [Signature Area Blank / Unverified]
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                  {record.extractedText}
                </div>
              )}
            </div>
          </div>

          {/* OCR Extracted Text Stream Tab */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  Tesseract OCR Raw Output
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {record.extractedText.length} characters
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-slate-700 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {record.extractedText || 'No text extracted.'}
            </div>
          </div>
        </div>

        {/* Right Column: Detected Clinical Fields & Suspicious Indicators */}
        <div className="lg:col-span-7 space-y-6">
          {/* Extracted Fields Table */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Extracted Clinical Metadata
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 grid grid-cols-3 gap-4">
                <span className="text-slate-500 font-medium">Doctor Name</span>
                <span className="col-span-2 text-slate-900 font-semibold">
                  {record.detectedFields.doctorName || (
                    <span className="text-slate-400 font-normal">Not detected</span>
                  )}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-4">
                <span className="text-slate-500 font-medium">Medical Council Reg. No</span>
                <span className="col-span-2">
                  {record.detectedFields.doctorRegNo ? (
                    <span className="font-mono text-sky-900 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {record.detectedFields.doctorRegNo}
                    </span>
                  ) : (
                    <span className="text-red-700 font-semibold">Missing / Undetected</span>
                  )}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-4">
                <span className="text-slate-500 font-medium">Clinic / Hospital</span>
                <span className="col-span-2 text-slate-900">
                  {record.detectedFields.clinicHospital || (
                    <span className="text-slate-400">Not detected</span>
                  )}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-4">
                <span className="text-slate-500 font-medium">Patient Name</span>
                <span className="col-span-2 text-slate-900 font-medium">
                  {record.detectedFields.patientName || (
                    <span className="text-slate-400">Not detected</span>
                  )}
                  {record.detectedFields.patientAge && (
                    <span className="text-slate-500 ml-2">({record.detectedFields.patientAge})</span>
                  )}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-4">
                <span className="text-slate-500 font-medium">Prescription Date</span>
                <span className="col-span-2 text-slate-900 font-mono">
                  {record.detectedFields.date || (
                    <span className="text-amber-700 font-sans font-medium">Date missing</span>
                  )}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-4">
                <span className="text-slate-500 font-medium">Signature / Stamp Check</span>
                <span className="col-span-2">
                  {record.detectedFields.hasSignatureStamp ? (
                    <span className="text-emerald-700 font-medium">Ink stroke / stamp density confirmed</span>
                  ) : (
                    <span className="text-red-700 font-medium">No signature or authorization stamp detected</span>
                  )}
                </span>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-4">
                <span className="text-slate-500 font-medium">Detected Medications</span>
                <div className="col-span-2">
                  {record.detectedFields.medicines && record.detectedFields.medicines.length > 0 ? (
                    <ul className="space-y-1">
                      {record.detectedFields.medicines.map((m, idx) => (
                        <li key={idx} className="text-slate-800 font-medium">
                          {m}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400">No structured dosage lines identified</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Suspicious Indicators Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Suspicious Indicators & Risk Drivers
              </h2>
              <span className="text-xs font-semibold text-slate-600">
                {record.suspiciousFlags.length} Indicators Flagged
              </span>
            </div>

            {record.suspiciousFlags.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 space-y-1">
                <strong className="font-semibold block">Nominal Screening Profile</strong>
                <p>
                  No regulatory discrepancies, date conflicts, or abnormal controlled-substance patterns were detected.
                  Document complies with standard baseline formatting.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {record.suspiciousFlags.map((flag, idx) => {
                  const isHigh = flag.severity === 'high';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded border text-xs space-y-1 ${
                        isHigh ? 'bg-red-50/70 border-red-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className={`font-semibold ${isHigh ? 'text-red-950' : 'text-slate-900'}`}>
                          {flag.title}
                        </strong>
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            isHigh ? 'text-red-700' : 'text-amber-700'
                          }`}
                        >
                          +{flag.penalty} pts
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isHigh ? 'text-red-900' : 'text-slate-600'}`}>
                        {flag.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Model Architecture Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                <span>ML Model: </span>
                <span className="font-medium text-slate-800">{record.modelOutput.mode}</span>
              </div>
              <div>
                <span>Confidence: </span>
                <span className="font-mono text-slate-800">{Math.round(record.modelOutput.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
