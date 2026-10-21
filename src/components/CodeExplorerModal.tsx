import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal } from 'lucide-react';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const fileSnippets: Record<string, { desc: string; code: string }> = {
    'app.py': {
      desc: 'Flask application server endpoints, file upload handling, and SQLite integration.',
      code: `from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from config import Config
from database import init_db, save_analysis, get_dashboard_stats
from ocr_utils import extract_text_from_image
from detector import PrescriptionDetector
from report_generator import generate_pdf_report

app = Flask(__name__)
app.config.from_object(Config)

init_db()
detector = PrescriptionDetector()

@app.route('/')
def index():
    stats = get_dashboard_stats()
    return render_template('index.html', stats=stats)

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files.get('prescription')
    # Preprocessing, OCR & Anomaly Triaging
    ocr_res = extract_text_from_image(file)
    result = detector.analyze(ocr_res['text'])
    report_file = generate_pdf_report(result)
    rec_id = save_analysis(file.filename, result['status'], result['risk_score'], report_file)
    return render_template('results.html', record_id=rec_id, **result)`
    },
    'detector.py': {
      desc: 'Clinical entity extraction regexes, suspicious indicators rule engine, and Scikit-learn ML scoring.',
      code: `import re, joblib, numpy as np
from datetime import datetime, timedelta

CONTROLLED_SUBSTANCES = ['oxycodone', 'hydrocodone', 'fentanyl', 'morphine', 'alprazolam', 'clonazepam']

class PrescriptionDetector:
    def parse_fields(self, text, has_signature_marking=True):
        fields = {
            'doctor_name': re.search(r'\\b(Dr\\.?|Doctor)\\s+([A-Za-z\\.\\s]{3,35})\\b', text),
            'doctor_reg_no': re.search(r'\\b(Reg\\.?\\s*(No|ID)?[:\\.\\s]*)([A-Z0-9\\-\\/]{4,16})\\b', text),
            'date': re.search(r'\\b(\\d{1,2}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{2,4})\\b', text),
            'has_signature_stamp': has_signature_marking
        }
        return fields

    def check_suspicious_indicators(self, fields, text):
        flags = []
        penalty = 0
        if not fields.get('doctor_reg_no'):
            flags.append({'code': 'MISSING_REG_NO', 'penalty': 25, 'title': 'Doctor Reg Missing'})
            penalty += 25
        if any(d in text.lower() for d in CONTROLLED_SUBSTANCES):
            flags.append({'code': 'SCHEDULE_DRUG_ALERT', 'penalty': 20, 'title': 'Schedule II Opioid'})
            penalty += 20
        return flags, min(penalty, 100)`
    },
    'train_model.py': {
      desc: 'Machine learning training pipeline with TF-IDF vectorization and Logistic Regression.',
      code: `from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Stratified split to prevent data leakage between train and test splits
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=250, sublinear_tf=True)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

model = LogisticRegression(class_weight='balanced')
model.fit(X_train_vec, y_train)

# Persist artifacts with joblib
joblib.dump(model, 'models/prescription_classifier.joblib')
joblib.dump(vectorizer, 'models/tfidf_vectorizer.joblib')`
    },
    'ocr_utils.py': {
      desc: 'OpenCV image contrast enhancement (CLAHE, bilateral filter, Otsu) and Tesseract OCR.',
      code: `import cv2, pytesseract, numpy as np
from PIL import Image

def preprocess_image(image_path):
    img = cv2.imread(str(image_path))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast_enhanced = clahe.apply(gray)
    denoised = cv2.bilateralFilter(contrast_enhanced, d=9, sigmaColor=75, sigmaSpace=75)
    thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    return {'thresh': thresh}

def extract_text_from_image(image_path):
    processed = preprocess_image(image_path)
    pil_img = Image.fromarray(processed['thresh'])
    text = pytesseract.image_to_string(pil_img, config='--psm 6')
    return {'text': text.strip()}`
    },
    'test_app.py': {
      desc: 'Automated pytest test suite verifying database operations, endpoints, and rule scoring.',
      code: `import pytest
from app import app
from detector import PrescriptionDetector

def test_home_page():
    with app.test_client() as client:
        res = client.get('/')
        assert res.status_code == 200

def test_detector_rules():
    detector = PrescriptionDetector()
    sample = "Urgent Oxycodone 80mg disp 120 tablets Date: 15/08/2029"
    result = detector.analyze(sample, has_signature_marking=False)
    assert result['status'] == 'Potentially Suspicious — Manual Verification Required'
    assert result['risk_score'] >= 50.0`
    },
    'requirements.txt': {
      desc: 'Python package dependencies for production and local environments.',
      code: `Flask==3.0.3
Werkzeug==3.0.3
opencv-python-headless==4.9.0.80
Pillow==10.3.0
pytesseract==0.3.10
scikit-learn==1.4.2
pandas==2.2.2
numpy==1.26.4
joblib==1.4.0
reportlab==4.2.0
python-dotenv==1.0.1
pytest==8.2.0`
    }
  };

  const copyToClipboard = () => {
    const text = fileSnippets[selectedFile]?.code || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                fake_prescription_detection/ Repository Explorer
              </h3>
              <p className="text-[11px] text-slate-500">
                Inspect complete Python source code files generated for the B.Sc. project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* File List Sidebar */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/50 p-3 overflow-y-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Project Structure
            </span>
            {Object.keys(fileSnippets).map((fn) => (
              <button
                key={fn}
                onClick={() => setSelectedFile(fn)}
                className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors flex items-center justify-between cursor-pointer ${
                  selectedFile === fn
                    ? 'bg-sky-700 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <span>{fn}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-200 px-2 text-[11px] text-slate-500 space-y-2">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <Terminal className="w-3.5 h-3.5" />
                <span>Run Locally</span>
              </div>
              <p className="font-mono text-[10px] bg-slate-200/80 p-2 rounded text-slate-800">
                cd fake_prescription_detection<br />
                pip install -r requirements.txt<br />
                python app.py
              </p>
              <p className="text-[10px] text-slate-400">
                Runs locally on http://127.0.0.1:5000
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-8 flex flex-col bg-slate-900 text-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950 text-xs font-mono text-slate-400">
              <span>fake_prescription_detection/{selectedFile}</span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed">
              <p className="text-slate-400 text-[11px] mb-3 pb-2 border-b border-slate-800 italic">
                # {fileSnippets[selectedFile]?.desc}
              </p>
              <pre className="whitespace-pre-wrap">{fileSnippets[selectedFile]?.code}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
