"""
RxShield: Fake Medical Prescription Detection System
B.Sc. Data Science Final Year Project
Backend: Flask, SQLite, OpenCV, Tesseract OCR, Scikit-learn
"""

import os
import time
from pathlib import Path
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from werkzeug.utils import secure_filename

from config import Config
from database import init_db, save_analysis, get_all_analyses, get_analysis_by_id, delete_analysis, get_dashboard_stats, save_contact
from ocr_utils import extract_text_from_image
from detector import PrescriptionDetector
from report_generator import generate_pdf_report

app = Flask(__name__)
app.config.from_object(Config)

# Ensure required storage folders exist
Config.UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
Config.REPORT_FOLDER.mkdir(parents=True, exist_ok=True)
Config.MODEL_FOLDER.mkdir(parents=True, exist_ok=True)

# Initialize database
init_db()

# Initialize Detector
detector = PrescriptionDetector()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

# 1. Home Page
@app.route('/')
def index():
    stats = get_dashboard_stats()
    return render_template('index.html', stats=stats)

# 2. Upload / Detection Page
@app.route('/detect', methods=['GET'])
def detect():
    return render_template('detect.html')

# 3. Analyze Endpoint
@app.route('/analyze', methods=['POST'])
def analyze():
    start_time = time.time()
    
    if 'prescription' not in request.files:
        flash('No file part provided in the request.', 'danger')
        return redirect(url_for('detect'))
        
    file = request.files['prescription']
    if file.filename == '':
        flash('No file selected.', 'warning')
        return redirect(url_for('detect'))
        
    if not allowed_file(file.filename):
        flash('Invalid file extension. Please upload a PNG, JPG, JPEG or PDF document.', 'danger')
        return redirect(url_for('detect'))

    # Secure filename and prevent collisions
    filename = secure_filename(file.filename)
    safe_name = f"{int(time.time())}_{filename}"
    file_path = Config.UPLOAD_FOLDER / safe_name
    file.save(str(file_path))

    try:
        # Preprocessing & OCR Extraction
        ocr_result = extract_text_from_image(file_path)
        extracted_text = ocr_result.get('text', '')
        has_signature = ocr_result.get('has_signature_marking', True)

        # Screening Analysis (NLP & ML)
        analysis_result = detector.analyze(extracted_text, has_signature_marking=has_signature)
        
        processing_time = round((time.time() - start_time) * 1000, 1)

        # Generate PDF report
        report_data = {
            'filename': filename,
            'status': analysis_result['status'],
            'risk_score': analysis_result['risk_score'],
            'processing_time_ms': processing_time,
            'detected_fields': analysis_result['detected_fields'],
            'suspicious_flags': analysis_result['suspicious_flags'],
            'model_prediction': analysis_result['model_output'].get('prediction')
        }
        report_filename = generate_pdf_report(report_data)

        # Store in SQLite database
        record_id = save_analysis(
            filename=filename,
            status=analysis_result['status'],
            risk_score=analysis_result['risk_score'],
            processing_time_ms=processing_time,
            extracted_text=extracted_text,
            detected_fields=analysis_result['detected_fields'],
            suspicious_flags=analysis_result['suspicious_flags'],
            model_prediction=analysis_result['model_output'].get('prediction'),
            model_confidence=analysis_result['model_output'].get('confidence'),
            report_filename=report_filename
        )

        return render_template(
            'results.html',
            record_id=record_id,
            filename=filename,
            image_url=url_for('uploaded_file', filename=safe_name),
            status=analysis_result['status'],
            risk_score=analysis_result['risk_score'],
            processing_time=processing_time,
            extracted_text=extracted_text,
            fields=analysis_result['detected_fields'],
            flags=analysis_result['suspicious_flags'],
            model_output=analysis_result['model_output'],
            report_url=url_for('view_report', record_id=record_id)
        )

    except Exception as e:
        app.logger.error(f"Error during analysis: {e}")
        flash(f"An error occurred while processing the prescription: {str(e)}", 'danger')
        return redirect(url_for('detect'))

# 4. View / Download Uploaded File
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(Config.UPLOAD_FOLDER, filename)

# 5. History Page
@app.route('/history')
def history():
    records = get_all_analyses(limit=200)
    return render_template('history.html', records=records)

# 6. Dashboard Page & API
@app.route('/dashboard')
def dashboard_view():
    stats = get_dashboard_stats()
    return render_template('dashboard.html', stats=stats)

@app.route('/api/dashboard')
def api_dashboard():
    return jsonify(get_dashboard_stats())

# 7. Report Download
@app.route('/report/<int:record_id>')
def view_report(record_id):
    record = get_analysis_by_id(record_id)
    if not record or not record.get('report_filename'):
        flash('Report not found for this prescription.', 'warning')
        return redirect(url_for('history'))
    return send_from_directory(Config.REPORT_FOLDER, record['report_filename'], as_attachment=True)

# 8. Delete Record
@app.route('/delete/<int:record_id>', methods=['POST'])
def delete_record(record_id):
    success = delete_analysis(record_id)
    if success:
        flash(f'Record #{record_id} was deleted successfully.', 'success')
    else:
        flash(f'Record #{record_id} could not be found.', 'warning')
    return redirect(url_for('history'))

# 9. About Page
@app.route('/about')
def about():
    return render_template('about.html')

# 10. Contact Page & Handler
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        if not name or not email or not message:
            flash('Please complete all required fields.', 'danger')
            return render_template('contact.html')

        save_contact(name, email, subject, message)
        flash('Thank you. Your inquiry has been submitted successfully.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')

if __name__ == '__main__':
    # Local development server default on port 5000 as specified
    app.run(host='127.0.0.1', port=5000, debug=True)
