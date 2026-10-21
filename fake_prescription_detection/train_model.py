"""
B.Sc. Data Science Project: Machine Learning Training Pipeline
File: train_model.py

Trains a TF-IDF text feature extractor and scikit-learn classifier
(Logistic Regression / Random Forest) on a labeled corpus of prescription OCR texts.
"""

import os
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score

from config import Config

def generate_sample_academic_dataset():
    """
    Academic demonstration dataset simulating clinical prescription text patterns.
    Note: For research or real deployment, replace with verified clinical ground truth
    obtained with institutional review board (IRB) approval.
    """
    genuine_samples = [
        "Apex Multi-Speciality Clinic Dr. Evelyn Vance MBBS MD Reg No: MCI-2018-84729 Patient: Arthur Pendelton Age: 45 Date: 12/04/2026 Rx Amoxicillin 500mg TDS x 5 days Paracetamol 650mg SOS Signed Dr Vance",
        "St. Jude Medical Center Dr. Robert Chen MD DNB Reg: GMC-992144 Patient: Clara Oswald Age: 32 Date: 18/04/2026 Rx Metformin 500mg BD Pantoprazole 40mg OD AC Sig: R.Chen Stamp Verified",
        "Metro Healthcare Hospital Dr. Sarah Jenkins MS Reg No: 84920/2019 Patient: David Miller Age: 58 Date: 05/04/2026 Rx Atorvastatin 20mg HS Amlodipine 5mg OD Refills: 0 Sign & Stamp",
        "Green Valley Clinic Dr. Marcus Brody MBBS Reg No: MED-339281 Pt: Liam Walker Age: 27 Date: 20/04/2026 Rx Azithromycin 500mg OD for 3 days Cetirizine 10mg HS Signature Brody",
        "City General Dispensary Dr. A. K. Sharma MD Reg No: DMC-44829 Patient: Meera Patel Age: 61 Date: 10/04/2026 Rx Telmisartan 40mg OD Glimepiride 1mg OD Doctor Stamp Authorized",
        "Beacon Hill Family Health Dr. Emily Thorne DO Reg No: STATE-77391 Patient: Thomas Wayne Age: 50 Date: 15/04/2026 Rx Lisinopril 10mg daily Hydrochlorothiazide 12.5mg daily Signature Thorne",
        "Riverside Community Clinic Dr. James Wilson MD Reg No: LIC-499201 Patient: Martha Kent Age: 66 Date: 11/04/2026 Rx Levothyroxine 50mcg OD Omeprazole 20mg OD Verified Signature",
        "Oakridge Care Pavilion Dr. Nina Rossi MBBS Reg No: 550293/MC Patient: Lucas Scott Age: 22 Date: 19/04/2026 Rx Ibuprofen 400mg TID with food Antacid suspension 10ml TDS Signed Rossi"
    ]

    suspicious_samples = [
        "Urgent Rx Prescription Oxycodone 80mg disp 120 tablets take 2 every 4 hours refill 5 times no doctor name no reg date 2029-01-01",
        "Pharmacy Slip Patient: John Doe Rx Fentanyl transdermal patches 100mcg/hr x 10 boxes dispense immediately cash only Dr Unknown",
        "Alprazolam 2mg Xanax bars qty 90 tab stat refill 3 times Date: 15/08/2029 urgent authorization required no reg number",
        "Doctor prescription pad Morphine sulphate 30mg 60 tabs Adderall 30mg 90 tabs high dose dispense without delay signature missing",
        "Prescription Form Pt: Walk In Patient Date: 01/01/2030 Rx Clonazepam 2mg 100 tablets refill 4 times no clinic header",
        "Rx Order Oxycontin 40mg 100 pills daily dispense cash patient signature illegible missing license number",
        "Medical Rx Note Date: 22/12/2028 Patient: Anonymous Rx Methadone 10mg BID 120 tabs refill unlimited Dr Stamp none",
        "Generic Prescription Sheet Hydrocodone 10/325mg 90 pills no doctor registration number no clinic telephone"
    ]

    texts = genuine_samples + suspicious_samples
    # Label: 0 = No Suspicious Indicators, 1 = Potentially Suspicious
    labels = [0] * len(genuine_samples) + [1] * len(suspicious_samples)
    
    return pd.DataFrame({'text': texts, 'label': labels})

def train_and_save_model(data_path=None):
    print("=" * 65)
    print("B.Sc. Data Science: Prescription Suspicious Pattern Training")
    print("=" * 65)

    if data_path and os.path.exists(data_path):
        print(f"Loading external dataset from {data_path}...")
        df = pd.read_csv(data_path)
    else:
        print("Using structured academic reference dataset (16 calibrated clinical samples)...")
        df = generate_sample_academic_dataset()

    X = df['text']
    y = df['label']

    # Train / Test split (stratified to maintain class balance, no data leakage)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    print(f"Training Samples: {len(X_train)} | Test Samples: {len(X_test)}")

    # Feature Extraction: TF-IDF with unigrams and bigrams
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=250,
        sublinear_tf=True,
        stop_words='english'
    )

    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Classification Model: Logistic Regression with balanced weights
    classifier = LogisticRegression(class_weight='balanced', random_state=42)
    classifier.fit(X_train_vec, y_train)

    # Evaluation
    y_pred = classifier.predict(X_test_vec)
    print("\n--- Model Evaluation on Unseen Test Split ---")
    print(classification_report(y_test, y_pred, target_names=['Nominal (0)', 'Suspicious (1)']))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save artifacts
    Config.MODEL_FOLDER.mkdir(parents=True, exist_ok=True)
    joblib.dump(classifier, Config.MODEL_PATH)
    joblib.dump(vectorizer, Config.VECTORIZER_PATH)
    print(f"\nArtifacts saved successfully:")
    print(f" - Model: {Config.MODEL_PATH}")
    print(f" - Vectorizer: {Config.VECTORIZER_PATH}")
    print("\nAcademic Note: Performance depends on dataset quality.")
    print("Real-world clinical validation requires verification against authenticated pharmacy records.")

if __name__ == '__main__':
    train_and_save_model()
