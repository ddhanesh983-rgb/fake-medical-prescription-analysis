import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'rxshield-dev-secret-key-change-in-production')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB maximum upload limit
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
    
    # Directories
    UPLOAD_FOLDER = BASE_DIR / 'uploads'
    REPORT_FOLDER = BASE_DIR / 'reports'
    MODEL_FOLDER = BASE_DIR / 'models'
    DATABASE_PATH = BASE_DIR / 'prescriptions.db'
    
    # ML Model Paths
    MODEL_PATH = MODEL_FOLDER / 'prescription_classifier.joblib'
    VECTORIZER_PATH = MODEL_FOLDER / 'tfidf_vectorizer.joblib'
    
    # Tesseract path configuration (overridable via env for Windows)
    TESSERACT_CMD = os.environ.get('TESSERACT_CMD', r'C:\Program Files\Tesseract-OCR\tesseract.exe')
