import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenCodeExplorer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCodeExplorer }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                Rx
              </span>
              <span className="text-lg font-bold text-white tracking-tight">RxShield</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-3">
              B.Sc. Data Science Capstone Project: “Fake Medical Prescription Detection Using Machine Learning and Python.”
              Engineered with OpenCV image enhancement, Tesseract OCR, heuristic NLP parsing, and Scikit-learn TF-IDF text classification.
            </p>
            <div className="text-xs text-slate-500">
              <span>Python 3.10 · Flask · Scikit-learn · OpenCV · SQLite3</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Project Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Project Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('detect')} className="hover:text-white transition-colors cursor-pointer">
                  Prescription Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Screening Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-white transition-colors cursor-pointer">
                  Audit History
                </button>
              </li>
              <li>
                <button onClick={onOpenCodeExplorer} className="hover:text-white transition-colors cursor-pointer text-sky-400">
                  Inspect Python Source Code
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Regulatory Protocol
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Screening tool only. Does not replace accredited pharmacist or licensed physician verification. Uploaded documents in this prototype are processed locally for demonstration.
            </p>
            <div className="text-[11px] text-slate-500">
              Triage labels: Nominal Indicators · Potentially Suspicious · Unanalyzable
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 RxShield Research Team · B.Sc. Data Science Academic Project</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Methodology
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Academic Inquiries
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
