import sqlite3
import json
from datetime import datetime
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Prescriptions analysis records table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            filename TEXT NOT NULL,
            status TEXT NOT NULL,
            risk_score REAL NOT NULL,
            processing_time_ms REAL NOT NULL,
            extracted_text TEXT,
            detected_fields TEXT,
            suspicious_flags TEXT,
            model_prediction TEXT,
            model_confidence REAL,
            report_filename TEXT
        )
    ''')
    
    # Contact inquiries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

def save_analysis(filename, status, risk_score, processing_time_ms, extracted_text, detected_fields, suspicious_flags, model_prediction=None, model_confidence=None, report_filename=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    
    cursor.execute('''
        INSERT INTO analyses (
            timestamp, filename, status, risk_score, processing_time_ms,
            extracted_text, detected_fields, suspicious_flags,
            model_prediction, model_confidence, report_filename
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        now_iso,
        filename,
        status,
        risk_score,
        processing_time_ms,
        extracted_text,
        json.dumps(detected_fields) if isinstance(detected_fields, dict) else detected_fields,
        json.dumps(suspicious_flags) if isinstance(suspicious_flags, list) else suspicious_flags,
        model_prediction,
        model_confidence,
        report_filename
    ))
    
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_all_analyses(limit=100):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analyses ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        r = dict(row)
        try:
            r['detected_fields'] = json.loads(r['detected_fields']) if r['detected_fields'] else {}
        except Exception:
            r['detected_fields'] = {}
        try:
            r['suspicious_flags'] = json.loads(r['suspicious_flags']) if r['suspicious_flags'] else []
        except Exception:
            r['suspicious_flags'] = []
        results.append(r)
    return results

def get_analysis_by_id(record_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analyses WHERE id = ?', (record_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    r = dict(row)
    try:
        r['detected_fields'] = json.loads(r['detected_fields']) if r['detected_fields'] else {}
    except Exception:
        r['detected_fields'] = {}
    try:
        r['suspicious_flags'] = json.loads(r['suspicious_flags']) if r['suspicious_flags'] else []
    except Exception:
        r['suspicious_flags'] = []
    return r

def delete_analysis(record_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM analyses WHERE id = ?', (record_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as total FROM analyses')
    total = cursor.fetchone()['total']
    
    cursor.execute("SELECT COUNT(*) as suspicious FROM analyses WHERE status LIKE '%Suspicious%'")
    suspicious = cursor.fetchone()['suspicious']
    
    cursor.execute("SELECT COUNT(*) as nominal FROM analyses WHERE status LIKE '%No Suspicious%'")
    nominal = cursor.fetchone()['nominal']
    
    cursor.execute("SELECT COUNT(*) as failed FROM analyses WHERE status LIKE '%Unable%'")
    failed = cursor.fetchone()['failed']
    
    cursor.execute('SELECT AVG(risk_score) as avg_risk FROM analyses WHERE risk_score > 0')
    avg_row = cursor.fetchone()
    avg_risk = round(avg_row['avg_risk'] or 0, 1)
    
    cursor.execute('SELECT id, timestamp, filename, status, risk_score FROM analyses ORDER BY id DESC LIMIT 5')
    recent_rows = cursor.fetchall()
    recent = [dict(row) for row in recent_rows]
    
    conn.close()
    return {
        'total': total,
        'suspicious': suspicious,
        'nominal': nominal,
        'failed': failed,
        'avg_risk': avg_risk,
        'recent': recent
    }

def save_contact(name, email, subject, message):
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute('''
        INSERT INTO contacts (timestamp, name, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ''', (now_iso, name, email, subject, message))
    conn.commit()
    conn.close()
