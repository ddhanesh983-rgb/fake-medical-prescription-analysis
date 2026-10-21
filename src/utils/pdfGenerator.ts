import { jsPDF } from 'jspdf';
import { AnalysisRecord } from '../types/prescription';

export function downloadPrescriptionPDF(record: AnalysisRecord) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 45;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(2, 132, 199); // #0284c7
  doc.text('RxShield — Medical Prescription Audit Report', margin, y);
  y += 18;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // #64748b
  doc.text(`B.Sc. Data Science Project Screening Analysis · Report Generated: ${new Date().toUTCString()}`, margin, y);
  y += 14;

  // Divider line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + contentWidth, y);
  y += 20;

  // Summary Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 85, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 85, 4, 4, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Document File:', margin + 14, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(record.filename, margin + 120, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Screening Status:', margin + 14, y + 38);
  if (record.status.includes('Suspicious')) {
    doc.setTextColor(220, 38, 38);
  } else if (record.status.includes('No Suspicious')) {
    doc.setTextColor(22, 163, 74);
  } else {
    doc.setTextColor(217, 119, 6);
  }
  doc.text(record.status, margin + 120, y + 38);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Risk Score:', margin + 14, y + 56);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.riskScore} / 100`, margin + 120, y + 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Processing Time:', margin + 14, y + 74);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.processingTimeMs} ms · Method: ${record.modelOutput.mode}`, margin + 120, y + 74);

  y += 105;

  // Extracted Metadata Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Extracted Clinical Metadata', margin, y);
  y += 15;

  const f = record.detectedFields;
  const fieldsData = [
    ['Doctor Name', f.doctorName || 'Not detected'],
    ['Medical Council Reg No', f.doctorRegNo || 'Not detected (Missing)'],
    ['Clinic / Hospital', f.clinicHospital || 'Not detected'],
    ['Patient Name', f.patientName || 'Not detected'],
    ['Prescription Date', f.date || 'Not detected'],
    ['Rx Symbol Present', f.hasRxSymbol ? 'Yes' : 'No'],
    ['Signature / Stamp Region', f.hasSignatureStamp ? 'Ink marking / seal detected' : 'Unverified / Blank']
  ];

  doc.setFontSize(9);
  fieldsData.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, margin + 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, margin + 180, y);
    y += 14;
  });

  y += 15;

  // Suspicious Flags Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`Suspicious Indicators (${record.suspiciousFlags.length} Triggered)`, margin, y);
  y += 16;

  if (record.suspiciousFlags.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74);
    doc.text('No high-risk anomalies or regulatory discrepancies were detected.', margin + 10, y);
    y += 20;
  } else {
    record.suspiciousFlags.forEach((flag) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      if (flag.severity === 'high') {
        doc.setTextColor(220, 38, 38);
      } else {
        doc.setTextColor(217, 119, 6);
      }
      doc.text(`[${flag.severity.toUpperCase()} - ${flag.penalty} pts] ${flag.title}`, margin + 10, y);
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const splitDesc = doc.splitTextToSize(flag.explanation, contentWidth - 20);
      doc.text(splitDesc, margin + 20, y);
      y += splitDesc.length * 10 + 6;
    });
  }

  y += 10;

  // Extracted OCR text excerpt
  if (record.extractedText) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Extracted OCR Text Preview (First 4 Lines)', margin, y);
    y += 14;

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const textLines = record.extractedText.split('\n').slice(0, 4);
    textLines.forEach(l => {
      doc.text(l.substring(0, 80), margin + 10, y);
      y += 11;
    });
    y += 10;
  }

  // Legal and Clinical Disclaimer at Bottom
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, 700, margin + contentWidth, 700);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('LEGAL & CLINICAL DISCLAIMER (B.Sc. Data Science Screening Tool):', margin, 715);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const disclaimerText = 
    'This report is generated by an academic screening tool for demonstration and preliminary triaging purposes. ' +
    'It cannot definitively prove that a prescription is fake or confirm authenticity. Final verification must be performed ' +
    'by a qualified pharmacist, healthcare professional, or the issuing medical institution.';
  const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth);
  doc.text(splitDisclaimer, margin, 728);

  const safeFilename = `RxShield_Report_${record.id}.pdf`;
  doc.save(safeFilename);
}
