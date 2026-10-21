/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { HomeView } from './components/HomeView';
import { DetectView } from './components/DetectView';
import { ResultsView } from './components/ResultsView';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { AnalysisRecord, DashboardStats } from './types/prescription';

const STORAGE_KEY = 'rxshield_screening_history_v1';

const INITIAL_HISTORY: AnalysisRecord[] = [
  {
    id: 1042,
    timestamp: '2026-04-19 14:22:10',
    filename: 'prescription_dr_vance_amoxicillin.png',
    fileSize: '1.4 MB',
    status: 'No Suspicious Indicators Detected — Authenticity Not Confirmed',
    riskScore: 12,
    processingTimeMs: 142,
    extractedText: 'APEX MULTI-SPECIALTY CLINIC Dr. Evelyn Vance MBBS MD Reg No: MCI-2018-84729 Patient: Arthur Pendelton Date: 12/04/2026 Rx Tab. Amoxicillin 625mg Signature Verified',
    detectedFields: {
      doctorName: 'Dr. Evelyn Vance',
      doctorRegNo: 'MCI-2018-84729',
      clinicHospital: 'Apex Multi-Specialty Clinic',
      patientName: 'Arthur Pendelton',
      patientAge: '45 yrs',
      date: '12/04/2026',
      medicines: ['Tab. Amoxicillin 625mg TDS', 'Tab. Paracetamol 650mg SOS'],
      hasRxSymbol: true,
      hasSignatureStamp: true
    },
    suspiciousFlags: [],
    modelOutput: {
      mode: 'Scikit-Learn TF-IDF + Logistic Regression',
      prediction: 'Nominal Class (0)',
      confidence: 0.94
    }
  },
  {
    id: 1041,
    timestamp: '2026-04-18 11:05:44',
    filename: 'urgent_dispensary_oxycodone_slip.jpg',
    fileSize: '2.1 MB',
    status: 'Potentially Suspicious — Manual Verification Required',
    riskScore: 84,
    processingTimeMs: 189,
    extractedText: 'URGENT DISPENSARY ORDER Oxycodone 80mg disp 120 tablets Patient: John D. Refill: 5 times no doctor registration no signature',
    detectedFields: {
      doctorName: null,
      doctorRegNo: null,
      clinicHospital: 'Urgent Dispensary Order',
      patientName: 'John D.',
      patientAge: null,
      date: '14/04/2026',
      medicines: ['Oxycodone 80mg — Dispense 120 Tablets', 'Alprazolam 2mg — Dispense 90 Tablets'],
      hasRxSymbol: true,
      hasSignatureStamp: false
    },
    suspiciousFlags: [
      {
        code: 'MISSING_REG_NO',
        title: 'Medical Council Registration Number Missing',
        explanation: 'Doctor registration number is completely absent from document header.',
        severity: 'high',
        penalty: 25
      },
      {
        code: 'SCHEDULE_DRUG_ALERT',
        title: 'Schedule II Controlled Substance (Oxycodone, Alprazolam)',
        explanation: 'High-risk narcotic with abnormal bulk dispense quantity and repeated refill flags.',
        severity: 'high',
        penalty: 20
      },
      {
        code: 'NO_SIGNATURE_STAMP',
        title: 'Physician Signature or Verification Stamp Area Blank',
        explanation: 'No physical ink signature or clinic authorization seal detected.',
        severity: 'medium',
        penalty: 20
      }
    ],
    modelOutput: {
      mode: 'Scikit-Learn TF-IDF + Logistic Regression',
      prediction: 'Suspicious Class (1)',
      confidence: 0.91
    }
  },
  {
    id: 1040,
    timestamp: '2026-04-17 09:30:12',
    filename: 'metro_care_future_date_altered.png',
    fileSize: '0.9 MB',
    status: 'Potentially Suspicious — Manual Verification Required',
    riskScore: 74,
    processingTimeMs: 165,
    extractedText: 'METRO COMMUNITY CARE Date: 15/10/2029 Pt: Walk-In Client Rx Clonazepam 2mg 100 tabs refill 4 times',
    detectedFields: {
      doctorName: null,
      doctorRegNo: null,
      clinicHospital: 'Metro Community Care',
      patientName: 'Walk-In Client',
      patientAge: null,
      date: '15/10/2029',
      medicines: ['Clonazepam 2mg Qty 100 tabs'],
      hasRxSymbol: true,
      hasSignatureStamp: false
    },
    suspiciousFlags: [
      {
        code: 'FUTURE_DATE',
        title: 'Inconsistent Future Issuance Date',
        explanation: 'Prescription date (15/10/2029) is far in the future, indicative of document tampering.',
        severity: 'high',
        penalty: 30
      },
      {
        code: 'MISSING_REG_NO',
        title: 'Doctor Registration Absent',
        explanation: 'No registered physician license provided.',
        severity: 'high',
        penalty: 25
      }
    ],
    modelOutput: {
      mode: 'Scikit-Learn TF-IDF + Logistic Regression',
      prediction: 'Suspicious Class (1)',
      confidence: 0.88
    }
  },
  {
    id: 1039,
    timestamp: '2026-04-16 16:48:02',
    filename: 'st_jude_pediatric_amox.jpg',
    fileSize: '1.7 MB',
    status: 'No Suspicious Indicators Detected — Authenticity Not Confirmed',
    riskScore: 14,
    processingTimeMs: 130,
    extractedText: 'ST JUDE MEDICAL CENTER Dr. Robert Chen MD DNB Reg: GMC-992144 Patient: Clara Oswald Date: 16/04/2026 Rx Metformin 500mg Signed R.Chen',
    detectedFields: {
      doctorName: 'Dr. Robert Chen',
      doctorRegNo: 'GMC-992144',
      clinicHospital: 'St. Jude Medical Center',
      patientName: 'Clara Oswald',
      patientAge: '32 yrs',
      date: '16/04/2026',
      medicines: ['Metformin 500mg BD', 'Pantoprazole 40mg OD'],
      hasRxSymbol: true,
      hasSignatureStamp: true
    },
    suspiciousFlags: [],
    modelOutput: {
      mode: 'Scikit-Learn TF-IDF + Logistic Regression',
      prediction: 'Nominal Class (0)',
      confidence: 0.95
    }
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const [initialSampleId, setInitialSampleId] = useState<string | null>(null);
  const [isCodeExplorerOpen, setIsCodeExplorerOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<AnalysisRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_HISTORY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [history]);

  // Compute live dashboard metrics
  const stats: DashboardStats = {
    total: history.length,
    suspicious: history.filter(h => h.status.includes('Suspicious')).length,
    nominal: history.filter(h => h.status.includes('No Suspicious')).length,
    failed: history.filter(h => h.status.includes('Unable')).length,
    avgRisk: history.length > 0
      ? Math.round((history.reduce((acc, h) => acc + h.riskScore, 0) / history.length) * 10) / 10
      : 0,
    recent: history.slice(0, 5)
  };

  const handleAnalysisComplete = (newRecord: AnalysisRecord) => {
    setHistory(prev => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
    setCurrentTab('results');
  };

  const handleDeleteRecord = (id: number) => {
    setHistory(prev => prev.filter(r => r.id !== id));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
      setCurrentTab('history');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setSelectedRecord(null);
    if (currentTab === 'results') setCurrentTab('history');
  };

  const handleSelectRecord = (record: AnalysisRecord) => {
    setSelectedRecord(record);
    setCurrentTab('results');
  };

  const handleOpenSampleFromHome = (sampleId: string) => {
    setInitialSampleId(sampleId);
    setCurrentTab('detect');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <DisclaimerBanner />
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            stats={stats}
            onNavigate={setCurrentTab}
            onOpenSample={handleOpenSampleFromHome}
          />
        )}

        {currentTab === 'detect' && (
          <DetectView
            initialSampleId={initialSampleId}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {currentTab === 'results' && selectedRecord && (
          <ResultsView
            record={selectedRecord}
            onAnalyzeAnother={() => {
              setInitialSampleId(null);
              setCurrentTab('detect');
            }}
            onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            history={history}
            onNavigate={setCurrentTab}
            onSelectRecord={handleSelectRecord}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            history={history}
            onSelectRecord={handleSelectRecord}
            onDeleteRecord={handleDeleteRecord}
            onClearHistory={handleClearHistory}
          />
        )}

        {currentTab === 'about' && (
          <AboutView onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)} />
        )}

        {currentTab === 'contact' && <ContactView />}
      </main>

      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
      />

      <CodeExplorerModal
        isOpen={isCodeExplorerOpen}
        onClose={() => setIsCodeExplorerOpen(false)}
      />
    </div>
  );
}
