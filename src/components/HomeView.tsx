import React from 'react';
import { ArrowRight, ScanText, ShieldAlert, Cpu, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { DashboardStats } from '../types/prescription';

interface HomeViewProps {
  stats: DashboardStats;
  onNavigate: (tab: string) => void;
  onOpenSample: (sampleId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ stats, onNavigate, onOpenSample }) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-700">
              B.Sc. Data Science Capstone Research
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight" style={{ textWrap: 'balance' }}>
              Fake Medical Prescription Detection Using Machine Learning
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              An automated screening system integrating OpenCV computer vision preprocessing, Tesseract OCR character extraction, heuristic clinical entity validation, and Scikit-learn TF-IDF machine learning to triage suspicious medical prescriptions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('detect')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded transition-colors shadow-xs cursor-pointer"
              >
                <span>Analyze Prescription</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors cursor-pointer"
              >
                View Analytics Dashboard
              </button>
            </div>

            {/* Live Database Metric Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
              <div>
                <span className="block font-bold text-lg text-slate-900 font-mono tabular-nums">
                  {stats.total}
                </span>
                <span className="text-slate-500">Prescriptions Screened</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-red-700 font-mono tabular-nums">
                  {stats.suspicious}
                </span>
                <span className="text-slate-500">Suspicious Triages</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-emerald-700 font-mono tabular-nums">
                  {stats.nominal}
                </span>
                <span className="text-slate-500">Nominal Screenings</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Medical Document Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                  <span>Prescription Screening In Action</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">OpenCV + OCR</span>
              </div>

              {/* Document Mockup with Interactive Layers */}
              <div className="bg-slate-50 rounded border border-slate-200 p-4 text-[11px] font-sans space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div>
                    <strong className="text-sky-900 block font-semibold">City Health Clinic</strong>
                    <span className="text-slate-500 text-[10px]">Dr. Arthur Vance · Reg: MCI-2019-847</span>
                  </div>
                  <span className="font-mono text-slate-600 text-[10px]">12/04/2026</span>
                </div>

                <div className="space-y-1.5 py-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Patient:</span>
                    <span className="font-medium text-slate-800">Arthur Pendelton (45 M)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Medication:</span>
                    <span className="font-medium text-slate-800">Amoxicillin 625mg TDS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Doctor Signature:</span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Digital Stamp Verified
                    </span>
                  </div>
                </div>

                {/* Analytical Scanner Overlay */}
                <div className="bg-sky-50 border border-sky-200 rounded p-2 text-[10px] space-y-1">
                  <div className="flex justify-between text-sky-900 font-medium">
                    <span>Feature Extraction Matrix</span>
                    <span className="font-mono">Risk: 12/100</span>
                  </div>
                  <div className="w-full bg-sky-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-700 h-full w-[12%]"></div>
                  </div>
                  <p className="text-sky-800 text-[9px] pt-0.5">
                    No regulatory anomalies detected. Authenticity requires manual dispensing review.
                  </p>
                </div>
              </div>

              {/* Quick Sample Presets Trigger */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-medium text-slate-600 mb-2">
                  Test with pre-configured clinical cases:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      onOpenSample('sample-authentic');
                      onNavigate('detect');
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded transition-colors cursor-pointer"
                  >
                    <strong className="block text-slate-800 text-[11px]">Valid Prescription</strong>
                    <span className="text-[10px] text-slate-500">Complete credentials</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenSample('sample-suspicious-opioid');
                      onNavigate('detect');
                    }}
                    className="p-2 text-left bg-red-50/50 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded transition-colors cursor-pointer"
                  >
                    <strong className="block text-red-900 text-[11px]">High-Risk Opioid</strong>
                    <span className="text-[10px] text-red-600">Missing registration</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200 pt-12">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Prescription Screening Pipeline Architecture
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Engineered as a robust multi-stage pipeline combining image restoration, optical recognition, heuristic regulatory audits, and natural language classification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="w-9 h-9 rounded bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                <ScanText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">01. Image Preprocessing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies OpenCV CLAHE contrast enhancement, bilateral filtering to reduce paper grain noise, and Otsu adaptive thresholding for optimal character edge definition.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="w-9 h-9 rounded bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">02. Tesseract OCR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transcribes visual document imagery into clean text streams using page segmentation mode (PSM 6), capturing doctor names, dates, medication lines, and stamps.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="w-9 h-9 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">03. Suspicious Indicators</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Heuristic rules audit mandatory Medical Council registration IDs, check chronological validity against future or expired dates, and flag Schedule II opioids.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">04. ML Classification & PDF</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scikit-Learn TF-IDF vectorizer predicts document risk probability, logs results in SQLite, and compiles a downloadable formal PDF clinical audit report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Project Presentation Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                B.Sc. Data Science Research Context
              </h3>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                This project addresses the real-world healthcare challenge of prescription diversion and fraudulent pharmacy dispensing. Developed strictly as a triage screening engine, it demonstrates how computer vision and machine learning can assist clinical workflows while upholding strict human-in-the-loop ethical verification.
              </p>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Read Full Methodology
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
