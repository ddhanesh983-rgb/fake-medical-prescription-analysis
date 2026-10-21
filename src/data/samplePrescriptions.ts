export interface SamplePrescription {
  id: string;
  name: string;
  description: string;
  category: 'nominal' | 'suspicious_opioid' | 'future_date' | 'unreadable';
  rawText: string;
  hasSignatureMarking: boolean;
  docSvgContent: string;
}

export const SAMPLE_PRESCRIPTIONS: SamplePrescription[] = [
  {
    id: 'sample-authentic',
    name: 'Sample 1: Authentic Clinical Prescription',
    description: 'Dr. Evelyn Vance, MCI-2018-84729. Complete patient information, valid current date, antibiotic dosage, and signature stamp.',
    category: 'nominal',
    hasSignatureMarking: true,
    rawText: `APEX MULTI-SPECIALTY CLINIC & HEALTHCARE
142 Medical Boulevard, Suite 400
Tel: (022) 555-0192 | Email: clinical@apexhealth.org

Prescribing Physician: Dr. Evelyn Vance, MBBS, MD (Internal Medicine)
State Medical Council Registration No: MCI-2018-84729

Date: 12/04/2026
Patient Name: Arthur Pendelton
Age: 45 Yrs | Gender: Male
Diagnosis: Acute Bacterial Bronchitis

Rx
1. Tab. Amoxicillin + Clavulanic Acid 625mg
   Take 1 tablet twice daily after meals for 5 days.
2. Tab. Paracetamol 650mg
   Take 1 tablet every 6 hours SOS for fever/pain.
3. Syr. Ambroxol + Guaiphenesin 100ml
   Take 10ml thrice daily for 5 days.

Refills Authorized: 0 (Zero)
Physician Signature: [Dr. Evelyn Vance - Digital Stamp Verified MCI-2018-84729]`,
    docSvgContent: `
      <div class="p-6 font-sans text-slate-800 text-xs bg-white border border-slate-300 rounded shadow-sm">
        <div class="border-b-2 border-sky-700 pb-3 mb-3 text-center">
          <h2 class="text-base font-bold text-sky-800 tracking-wide uppercase">Apex Multi-Specialty Clinic</h2>
          <p class="text-[10px] text-slate-500">142 Medical Boulevard, Suite 400 · Reg Lic: MH-MED-4492</p>
          <div class="flex justify-between items-center mt-2 text-[11px] text-slate-700">
            <span><strong>Dr. Evelyn Vance</strong>, MBBS, MD</span>
            <span>Reg No: <strong class="text-sky-900 font-mono">MCI-2018-84729</strong></span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 pb-2 mb-3 border-b border-slate-200 text-[11px]">
          <div><span class="text-slate-500">Patient:</span> <strong>Arthur Pendelton</strong> (45 M)</div>
          <div class="text-right"><span class="text-slate-500">Date:</span> <strong class="font-mono">12/04/2026</strong></div>
        </div>
        <div class="mb-4">
          <div class="text-lg font-serif font-bold text-sky-900 mb-1">Rx</div>
          <ol class="list-decimal pl-4 space-y-1.5 text-[11px]">
            <li><strong>Tab. Amoxicillin 625mg</strong> — 1 tab BD x 5 days (After food)</li>
            <li><strong>Tab. Paracetamol 650mg</strong> — 1 tab SOS (Fever/Bodyache)</li>
            <li><strong>Syr. Ambroxol 10ml</strong> — 10ml TDS x 5 days</li>
          </ol>
        </div>
        <div class="pt-4 mt-6 border-t border-slate-200 flex justify-between items-end text-[10px]">
          <span class="text-slate-400">Refill Count: 0 · Non-Transferable</span>
          <div class="text-center">
            <div class="w-24 h-8 border border-sky-400 rounded-sm bg-sky-50 flex items-center justify-center text-sky-700 font-serif italic text-[11px]">
              E. Vance MD
            </div>
            <span class="text-slate-500 block mt-0.5">Authorized Signature & Seal</span>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'sample-suspicious-opioid',
    name: 'Sample 2: Controlled Opioid & Missing Registration',
    description: 'Schedule II Oxycodone high dosage (120 tablets), unverified doctor name, missing registration number, missing hospital phone.',
    category: 'suspicious_opioid',
    hasSignatureMarking: false,
    rawText: `URGENT MEDICAL DISPENSARY ORDER
Patient: John D.
Date: 14/04/2026
Doctor: Dr. Unknown Practitioner
Registration No: [NOT PROVIDED / MISSING]

Rx
1. Oxycodone Hydrochloride 80mg Tablets
   Dispense Quantity: 120 tablets
   Take 2 tablets every 4 hours as required for chronic severe back discomfort.
2. Alprazolam 2mg (Xanax)
   Dispense Quantity: 90 tablets
   Take 1 tablet thrice daily.

Refill: 5 times authorized.
Cash payment accepted.
Signature: [BLANK / UNVERIFIED INK AREA]`,
    docSvgContent: `
      <div class="p-6 font-sans text-slate-800 text-xs bg-amber-50/40 border border-amber-300 rounded shadow-sm">
        <div class="border-b border-amber-400 pb-2 mb-3 text-center">
          <h2 class="text-sm font-bold text-red-700 uppercase">Emergency Prescription Order</h2>
          <p class="text-[10px] text-slate-500 italic">Fast-Track Dispensary Slip</p>
        </div>
        <div class="grid grid-cols-2 gap-2 pb-2 mb-3 border-b border-slate-200 text-[11px]">
          <div><span class="text-slate-500">Patient:</span> <strong>John D.</strong></div>
          <div class="text-right"><span class="text-slate-500">Date:</span> <strong class="font-mono">14/04/2026</strong></div>
          <div class="col-span-2 text-red-600 text-[10px]">Doctor Reg No: <em>None provided</em></div>
        </div>
        <div class="mb-4">
          <div class="text-lg font-serif font-bold text-red-800 mb-1">Rx</div>
          <ol class="list-decimal pl-4 space-y-1.5 text-[11px] text-red-950">
            <li><strong class="text-red-700">Oxycodone 80mg</strong> — Dispense 120 Tablets (Take 2 every 4 hrs)</li>
            <li><strong class="text-red-700">Alprazolam 2mg</strong> — Dispense 90 Tablets (Take 1 TID)</li>
          </ol>
        </div>
        <div class="pt-4 mt-6 border-t border-slate-200 flex justify-between items-end text-[10px]">
          <span class="text-amber-800 font-semibold">Refills: 5 Times · Cash Only</span>
          <div class="text-center">
            <div class="w-24 h-8 border border-dashed border-red-300 bg-red-50/50 flex items-center justify-center text-red-400 text-[9px] italic">
              [Signature Blank]
            </div>
            <span class="text-slate-400 block mt-0.5">Signature Area</span>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'sample-future-date',
    name: 'Sample 3: Future Inconsistent Date & Unregistered Clinic',
    description: 'Prescription with issuance date set in the distant future (2029-10-15), missing doctor licensing credentials and invalid format.',
    category: 'future_date',
    hasSignatureMarking: false,
    rawText: `METRO COMMUNITY CARE
Date: 15/10/2029
Pt: Walk-In Client
Age: Unknown

Rx
Clonazepam 2mg
Quantity: 100 tablets
Refill: 4 times
Dispense immediately without doctor verification call.
Authorized by: Physician Staff`,
    docSvgContent: `
      <div class="p-6 font-sans text-slate-800 text-xs bg-slate-100 border border-slate-300 rounded shadow-sm">
        <div class="border-b border-slate-300 pb-2 mb-3">
          <h2 class="text-sm font-bold text-slate-700 uppercase">Metro Community Care</h2>
          <span class="text-[10px] text-red-600 font-semibold">Future Date: 15/10/2029</span>
        </div>
        <div class="text-[11px] space-y-1 mb-4">
          <div><span class="text-slate-500">Patient:</span> <strong>Walk-In Client</strong></div>
          <div><span class="text-slate-500">Doctor License:</span> <em class="text-red-500">Missing</em></div>
        </div>
        <div class="mb-4">
          <div class="text-base font-bold text-slate-800 mb-1">Rx</div>
          <p class="text-[11px] text-slate-700 font-medium">Clonazepam 2mg — Qty: 100 Tablets (Refill 4x)</p>
        </div>
        <div class="pt-3 border-t border-slate-200 text-[10px] text-slate-400">
          No physical stamp detected · Discrepancy in date stamp
        </div>
      </div>
    `
  },
  {
    id: 'sample-unreadable',
    name: 'Sample 4: Blurry / Degraded Scan (OCR Failure)',
    description: 'Heavily degraded, low-resolution camera snapshot with motion blur preventing valid OCR character extraction.',
    category: 'unreadable',
    hasSignatureMarking: false,
    rawText: `~~~ ... %%%% ??? 111 ....`,
    docSvgContent: `
      <div class="p-6 font-sans text-slate-400 text-xs bg-slate-200/70 border border-slate-300 rounded shadow-sm text-center flex flex-col items-center justify-center min-h-[220px]">
        <div class="text-slate-400 text-2xl mb-2">🌫️</div>
        <strong class="text-slate-600 text-sm">Low Resolution / Motion Blurred Capture</strong>
        <p class="text-[11px] text-slate-500 max-w-xs mt-1">Image pixel density is below minimum OCR threshold (150 DPI). Text characters cannot be segmented.</p>
      </div>
    `
  }
];
