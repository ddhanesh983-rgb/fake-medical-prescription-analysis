import os
from pathlib import Path
from datetime import datetime
from config import Config

def generate_pdf_report(analysis_data, output_filename=None):
    """
    Generates a structured clinical screening audit report.
    Uses reportlab if available; otherwise produces a formatted text/HTML audit document.
    """
    Config.REPORT_FOLDER.mkdir(parents=True, exist_ok=True)
    if not output_filename:
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"RxReport_{analysis_data.get('id', 'temp')}_{timestamp_str}.pdf"
    
    file_path = Config.REPORT_FOLDER / output_filename

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

        doc = SimpleDocTemplate(str(file_path), pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []
        styles = getSampleStyleSheet()

        # Header Title
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#0284c7'),
            spaceAfter=4
        )
        sub_style = ParagraphStyle(
            'SubStyle',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#64748b'),
            spaceAfter=12
        )
        
        story.append(Paragraph("RxShield - Prescription Screening Audit Report", title_style))
        story.append(Paragraph(f"B.Sc. Data Science Project Screening Analysis · Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}", sub_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=14))

        # Screening Summary Table
        status = analysis_data.get('status', 'Unknown')
        risk_score = analysis_data.get('risk_score', 0)
        
        status_color = colors.HexColor('#dc2626') if 'Suspicious' in status else colors.HexColor('#16a34a')
        
        summary_data = [
            [Paragraph("<b>File Name:</b>", styles['Normal']), analysis_data.get('filename', 'N/A')],
            [Paragraph("<b>Screening Verdict:</b>", styles['Normal']), Paragraph(f"<font color='{status_color.hexval()}'><b>{status}</b></font>", styles['Normal'])],
            [Paragraph("<b>Calculated Risk Score:</b>", styles['Normal']), f"{risk_score} / 100"],
            [Paragraph("<b>Processing Latency:</b>", styles['Normal']), f"{analysis_data.get('processing_time_ms', 0)} ms"],
            [Paragraph("<b>Classifier Mode:</b>", styles['Normal']), str(analysis_data.get('model_prediction', 'Rule Engine'))]
        ]
        
        summary_table = Table(summary_data, colWidths=[160, 360])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 14))

        # Extracted Medical Entities
        story.append(Paragraph("<b>Extracted Clinical Metadata</b>", styles['Heading3']))
        fields = analysis_data.get('detected_fields', {}) or {}
        
        field_rows = [
            ["Entity Field", "Extracted Value"],
            ["Doctor Name", fields.get('doctor_name') or "Not Detected"],
            ["Medical Council Reg No", fields.get('doctor_reg_no') or "Not Detected"],
            ["Clinic / Hospital", fields.get('clinic_hospital') or "Not Detected"],
            ["Patient Name", fields.get('patient_name') or "Not Detected"],
            ["Issuance Date", fields.get('date') or "Not Detected"],
            ["Rx Symbol Present", "Yes" if fields.get('has_rx_symbol') else "No"],
            ["Signature / Stamp Detected", "Yes" if fields.get('has_signature_stamp') else "No / Inconclusive"]
        ]
        
        fields_table = Table(field_rows, colWidths=[200, 320])
        fields_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284c7')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('PADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(fields_table)
        story.append(Spacer(1, 14))

        # Suspicious Indicators Section
        story.append(Paragraph("<b>Detected Suspicious Indicators & Risk Drivers</b>", styles['Heading3']))
        flags = analysis_data.get('suspicious_flags', []) or []
        if flags:
            flag_rows = [["Indicator", "Severity", "Explanation"]]
            for flag in flags:
                flag_rows.append([
                    flag.get('title', 'Indicator'),
                    flag.get('severity', 'info').upper(),
                    Paragraph(flag.get('explanation', ''), styles['Normal'])
                ])
            flag_table = Table(flag_rows, colWidths=[150, 70, 300])
            flag_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ef4444')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fef2f2')]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fecaca')),
                ('PADDING', (0, 0), (-1, -1), 5),
            ]))
            story.append(flag_table)
        else:
            story.append(Paragraph("No anomalous risk indicators triggered by the current rule checklist or classifier.", styles['Normal']))
        
        story.append(Spacer(1, 18))
        
        # Mandatory Disclaimer
        disclaimer_style = ParagraphStyle(
            'DisclaimerStyle',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#475569'),
            borderPadding=8,
            borderColor=colors.HexColor('#cbd5e1'),
            borderWidth=0.5,
            backColor=colors.HexColor('#f1f5f9')
        )
        disclaimer_text = (
            "<b>LEGAL & CLINICAL DISCLAIMER:</b> This report is generated by an academic screening tool for demonstration "
            "and preliminary triaging purposes. It cannot definitively confirm or disprove authenticity. Final clinical, "
            "pharmacological, and legal verification MUST be conducted by a registered pharmacist or the issuing healthcare institution."
        )
        story.append(Paragraph(disclaimer_text, disclaimer_style))

        doc.build(story)
        return output_filename

    except ImportError:
        # Fallback text file generation if reportlab is not present
        txt_path = Config.REPORT_FOLDER / output_filename.replace('.pdf', '.txt')
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write("=== RxShield Screening Audit Report ===\n")
            f.write(f"Generated: {datetime.now().isoformat()}\n")
            f.write(f"File: {analysis_data.get('filename')}\n")
            f.write(f"Verdict: {analysis_data.get('status')}\n")
            f.write(f"Risk Score: {analysis_data.get('risk_score')}/100\n")
            f.write("\nClinical Disclaimer: Screening tool only. Final verification required by pharmacist.\n")
        return txt_path.name
