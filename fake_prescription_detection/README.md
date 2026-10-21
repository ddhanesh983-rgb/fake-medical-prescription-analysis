# Fake Medical Prescription Detection Using Machine Learning and Python
**B.Sc. Data Science Final Year Project**

RxShield is a machine-learning and computer-vision powered screening platform engineered to analyze uploaded medical prescription documents for potentially suspicious indicators, anomalous patterns, formatting discrepancies, and high-risk controlled drug signals.

---

### ⚠️ Critical Clinical & Legal Disclaimer
> **This system is strictly a screening and triaging tool.** It cannot definitively prove or disprove whether a prescription is authentic or counterfeit. Definitive verification must always be performed by a registered pharmacist, licensed healthcare professional, or the issuing medical institution.

---

## System Architecture

1. **Document Ingestion**: Supports PNG, JPG, JPEG, and PDF (Max 10 MB).
2. **OpenCV Image Preprocessing**: Grayscale conversion, CLAHE adaptive histogram equalization, bilateral noise reduction, and adaptive binarization.
3. **OCR Extraction**: Pytesseract OCR pipeline with layout-aware character segmentation.
4. **Clinical Entity Extraction (Regex/NLP)**:
   - Doctor Name & Medical Council Registration Number
   - Clinic/Hospital Header
   - Patient Name & Demographics
   - Prescription Date (Chronological consistency validation)
   - Medication, Strength, and Dosage schedule
   - Physical Signature & Clinic Stamp region detection
5. **Suspicious Indicators Engine**: Multi-factor scoring assessing missing regulatory IDs, expired or future dates, Schedule II narcotics diversion risk, and missing authorization marks.
6. **Machine Learning Classifier**: Scikit-Learn TF-IDF vectorizer + Logistic Regression / Random Forest classification model.
7. **Storage & Reporting**: SQLite database storage with privacy protection, Chart.js analytics dashboard, and automated PDF clinical audit report generation.

---

## Windows Installation & Execution Guide

### Prerequisites
- Python 3.9, 3.10, or 3.11 installed from [python.org](https://www.python.org/downloads/)
- Make sure to check **"Add Python to PATH"** during installation.

### Step 1: Open Terminal (PowerShell or Command Prompt)
```cmd
cd path\to\fake_prescription_detection
```

### Step 2: Create and Activate a Python Virtual Environment
```cmd
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Required Dependencies
```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Install Tesseract OCR (Windows)
1. Download the Tesseract Windows installer from:  
   `https://github.com/UB-Mannheim/tesseract/wiki`
2. Install Tesseract to the default directory:  
   `C:\Program Files\Tesseract-OCR\tesseract.exe`
3. Optional: Add `C:\Program Files\Tesseract-OCR` to your Windows System `PATH` environment variable.
4. If installed in a custom directory, set the environment variable:
   ```cmd
   set TESSERACT_CMD="C:\YourPath\tesseract.exe"
   ```

### Step 5: Initialize SQLite Database
```cmd
python -c "from database import init_db; init_db(); print('Database initialized successfully.')"
```

### Step 6: Train the Machine Learning Model (Optional / Academic Demo)
```cmd
python train_model.py
```
This trains the TF-IDF feature extractor and classifier on the academic reference corpus and saves model weights to `models/prescription_classifier.joblib`.

### Step 7: Run the Flask Web Application
```cmd
python app.py
```
Open your web browser and navigate to:  
👉 **`http://127.0.0.1:5000`**

### Step 8: Run Automated Unit Tests
```cmd
pytest tests/test_app.py -v
```

---

## Troubleshooting Common Errors

1. **`tesseract is not installed or it's not in your PATH`**
   - Solution: Ensure Tesseract is installed and verify the path in `config.py` (`Config.TESSERACT_CMD`) matches your exact installation folder.

2. **`ModuleNotFoundError: No module named 'cv2'`**
   - Solution: Run `pip install opencv-python-headless`.

3. **`PermissionError: [Errno 13] Permission denied: 'uploads'`**
   - Solution: Ensure the application directory has write permissions. Folders (`uploads/`, `reports/`, `models/`) are created automatically.

4. **Port 5000 Already in Use**
   - Solution: Run with an alternative port:
     ```python
     app.run(port=5050)
     ```
