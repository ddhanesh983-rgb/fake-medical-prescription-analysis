export type ScreeningStatus =
  | 'No Suspicious Indicators Detected — Authenticity Not Confirmed'
  | 'Potentially Suspicious — Manual Verification Required'
  | 'Unable to Analyze — Please Upload a Clearer Image';

export interface ExtractedFields {
  doctorName?: string | null;
  doctorRegNo?: string | null;
  clinicHospital?: string | null;
  patientName?: string | null;
  patientAge?: string | null;
  date?: string | null;
  medicines: string[];
  hasRxSymbol: boolean;
  hasSignatureStamp: boolean;
}

export interface SuspiciousFlag {
  code: string;
  title: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
  penalty: number;
}

export interface ModelOutput {
  mode: string;
  prediction: string;
  confidence: number;
}

export interface AnalysisRecord {
  id: number;
  timestamp: string;
  filename: string;
  fileSize?: string;
  imageUrl?: string;
  status: ScreeningStatus;
  riskScore: number;
  processingTimeMs: number;
  extractedText: string;
  detectedFields: ExtractedFields;
  suspiciousFlags: SuspiciousFlag[];
  modelOutput: ModelOutput;
  reportFilename?: string;
}

export interface DashboardStats {
  total: number;
  suspicious: number;
  nominal: number;
  failed: number;
  avgRisk: number;
  recent: AnalysisRecord[];
}
