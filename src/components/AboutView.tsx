import React from 'react';
import { BookOpen, Database, BrainCircuit, CheckSquare, Layers, Cpu, ShieldAlert, FileText } from 'lucide-react';

interface AboutViewProps {
  onOpenCodeExplorer: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenCodeExplorer }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-700">
          Academic Research Profile
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Fake Medical Prescription Detection Using Machine Learning
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          A final-year Bachelor of Science in Data Science capstone investigation evaluating the synergistic application of computer vision, optical character recognition, and probabilistic classification algorithms to screen fraudulent pharmaceutical prescriptions.
        </p>
      </div>

      {/* Project Objective & Background */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-sky-700" />
          <h2 className="text-base font-bold text-slate-900">1. Project Objective & Clinical Urgency</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Prescription drug abuse—particularly involving Schedule II/IV opioids, stimulants, and benzodiazepines—poses a critical global health crisis. Fraudulent prescriptions are generated through desktop software forgery, stolen doctor pads, altered dosages, or fabricated registration numbers.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          The core objective of this project is to build an automated, accessible screening prototype that parses physical or digital prescription scans and performs an initial triage before medication is dispensed, highlighting suspicious discrepancies for pharmacist review.
        </p>
      </section>

      {/* Comparison: Existing Limitations vs Proposed System */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          2. Existing Workflow Bottlenecks vs Proposed Solution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
            <strong className="text-slate-900 block font-semibold text-sm">Traditional Manual Screening</strong>
            <ul className="space-y-2 text-slate-600 list-disc pl-4 leading-relaxed">
              <li>Manual telephone calls to prescribing clinics that often result in busy lines or delayed responses.</li>
              <li>High cognitive burden on dispensing pharmacists during peak operational intake hours.</li>
              <li>Inability to reliably cross-check subtle date anomalies, unit modifications, or duplicate serial identifiers across shifts.</li>
              <li>Lack of structured digital audit logs for post-dispensing scrutiny and regulatory inspection.</li>
            </ul>
          </div>

          <div className="p-4 bg-sky-50/60 border border-sky-200 rounded space-y-2">
            <strong className="text-sky-950 block font-semibold text-sm">Proposed Automated Screening Pipeline</strong>
            <ul className="space-y-2 text-slate-700 list-disc pl-4 leading-relaxed">
              <li>Instant 2-second document triage with OpenCV contrast optimization and Tesseract OCR character extraction.</li>
              <li>Automated regex and NLP identification of mandatory doctor registration IDs, clinic contact headers, and dates.</li>
              <li>Real-time heuristic flags for high-risk Schedule II controlled narcotics (e.g. Oxycodone, Fentanyl, Xanax).</li>
              <li>Scikit-Learn classification producing calibrated risk indices and formal downloadable PDF audit documentation.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Machine Learning Methodology & Metrics */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BrainCircuit className="w-5 h-5 text-sky-700" />
          <h2 className="text-base font-bold text-slate-900">
            3. Machine Learning Architecture & Evaluation Metrics
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            The machine-learning module converts unstructured prescription OCR text into numerical feature spaces using <strong>Term Frequency-Inverse Document Frequency (TF-IDF)</strong> vectorization with unigram and bigram tokenization.
          </p>
          <p>
            To prevent <strong>data leakage</strong>, the dataset is stratified and split into mutually exclusive training (75%) and testing (25%) partitions prior to vocabulary fitting. The classifier utilizes balanced class weights to compensate for prevalence skew.
          </p>
        </div>

        {/* Evaluation Metrics Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Evaluation Metric</th>
                <th className="py-2.5 px-3 font-semibold font-mono">Mathematical Formulation</th>
                <th className="py-2.5 px-3 font-semibold">Clinical Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Precision</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">TP / (TP + FP)</td>
                <td className="py-2.5 px-3 text-slate-600">
                  Measures the proportion of triaged prescriptions that were genuinely fraudulent, preventing false accusations against bona fide patients.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Recall (Sensitivity)</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">TP / (TP + FN)</td>
                <td className="py-2.5 px-3 text-slate-600">
                  Quantifies the proportion of all actual illicit prescriptions successfully caught, which is paramount in preventing dangerous drug diversion.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">F1-Score</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">2 * (P * R) / (P + R)</td>
                <td className="py-2.5 px-3 text-slate-600">
                  Harmonic mean balancing precision and recall across skewed healthcare distributions.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Confusion Matrix</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">[ [TN, FP], [FN, TP] ]</td>
                <td className="py-2.5 px-3 text-slate-600">
                  Maps classification error modes between false positives and false negatives to calibrate threshold cutoffs.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Model Persistence & Training Code Reference */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <strong className="text-slate-900 block font-semibold">Model Artifacts Persistence</strong>
            <span className="text-slate-500">Trained using joblib into models/prescription_classifier.joblib</span>
          </div>
          <button
            onClick={onOpenCodeExplorer}
            className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-white border border-sky-300 hover:bg-sky-50 rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            Inspect train_model.py
          </button>
        </div>
      </section>

      {/* Technologies Used Grid */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          4. Complete Technology Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">Python 3.10 & Flask</strong>
            <span className="text-slate-500">Backend API, routing, secure uploads</span>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">OpenCV & Pillow</strong>
            <span className="text-slate-500">Grayscale, CLAHE, Otsu threshold</span>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">Tesseract OCR</strong>
            <span className="text-slate-500">pytesseract text extraction</span>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">Scikit-learn</strong>
            <span className="text-slate-500">TF-IDF & Logistic Regression</span>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">SQLite3</strong>
            <span className="text-slate-500">Parameterized relational storage</span>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">Chart.js</strong>
            <span className="text-slate-500">Interactive dashboard visuals</span>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">jsPDF / ReportLab</strong>
            <span className="text-slate-500">Clinical audit PDF generation</span>
          </div>
          <div className="p-3 border border-slate-200 rounded bg-slate-50">
            <strong className="block text-slate-900 font-semibold">Bootstrap 5 / Tailwind</strong>
            <span className="text-slate-500">Responsive, accessible UI</span>
          </div>
        </div>
      </section>

      {/* Ethical Guardrails & Future Enhancements */}
      <section className="bg-amber-50/60 border border-amber-200 rounded-lg p-6 sm:p-8 space-y-3 text-xs text-amber-950">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900">
          5. Ethical AI Guardrails & Future Research
        </h2>
        <p className="leading-relaxed">
          <strong>Mandatory Non-Definitive Rule:</strong> The software is strictly forbidden from outputting claims of "100% Genuine" or "100% Fake". Forged signatures or unregistered physicians can only be conclusively validated via verified state registries or issuing clinics.
        </p>
        <p className="leading-relaxed">
          <strong>Future Research Directions:</strong> Future iterations could integrate real-time API queries against national Medical Council databases, cryptographic QR code verification for electronic health records (EHR), and privacy-preserving federated learning across pharmacy chains.
        </p>
      </section>
    </div>
  );
};
