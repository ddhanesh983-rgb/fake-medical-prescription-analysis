import pytest
import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app import app
from database import init_db, save_analysis, get_analysis_by_id, delete_analysis, get_dashboard_stats
from detector import PrescriptionDetector

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        init_db()
        yield client

def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200

def test_detect_page(client):
    response = client.get('/detect')
    assert response.status_code == 200

def test_dashboard_api(client):
    response = client.get('/api/dashboard')
    assert response.status_code == 200
    data = response.get_json()
    assert 'total' in data
    assert 'suspicious' in data
    assert 'nominal' in data

def test_detector_rule_engine():
    detector = PrescriptionDetector()
    
    # Authentic-looking sample
    sample_text = (
        "Green Valley Clinic Dr. Marcus Brody MBBS Reg No: MED-339281\n"
        "Pt: Liam Walker Age: 27 Date: 20/04/2026\n"
        "Rx Azithromycin 500mg OD for 3 days\n"
        "Signature: Brody"
    )
    result = detector.analyze(sample_text, has_signature_marking=True)
    assert 'status' in result
    assert result['status'] == 'No Suspicious Indicators Detected — Authenticity Not Confirmed'
    assert result['risk_score'] < 40.0

def test_detector_suspicious_sample():
    detector = PrescriptionDetector()
    
    # Suspicious sample: Missing doctor reg, future date, opioid
    sample_text = (
        "Urgent Rx Prescription Oxycodone 80mg disp 120 tablets\n"
        "Date: 15/08/2029\n"
        "Dispense without delay"
    )
    result = detector.analyze(sample_text, has_signature_marking=False)
    assert result['status'] == 'Potentially Suspicious — Manual Verification Required'
    assert result['risk_score'] >= 50.0

def test_database_crud():
    rec_id = save_analysis(
        filename="test_sample.png",
        status="No Suspicious Indicators Detected — Authenticity Not Confirmed",
        risk_score=15.0,
        processing_time_ms=120.5,
        extracted_text="Sample Test Text",
        detected_fields={'doctor_name': 'Dr. Test'},
        suspicious_flags=[]
    )
    assert rec_id > 0

    record = get_analysis_by_id(rec_id)
    assert record is not None
    assert record['filename'] == "test_sample.png"

    deleted = delete_analysis(rec_id)
    assert deleted is True
