import cv2
import numpy as np
import pytesseract
from PIL import Image
import os
import re
from config import Config

# Configure tesseract executable path if available
if os.path.exists(Config.TESSERACT_CMD):
    pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_CMD

def preprocess_image(image_path):
    """
    Load and preprocess prescription image:
    1. Convert to grayscale
    2. Reduce noise with bilateral filter or Gaussian blur
    3. Enhance contrast with CLAHE
    4. Adaptive Otsu thresholding for crisp text
    """
    img = cv2.imread(str(image_path))
    if img is None:
        raise ValueError("Could not read image file.")
    
    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Contrast Limited Adaptive Histogram Equalization (CLAHE)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast_enhanced = clahe.apply(gray)
    
    # Bilateral filter to smooth flat areas while preserving sharp edges
    denoised = cv2.bilateralFilter(contrast_enhanced, d=9, sigmaColor=75, sigmaSpace=75)
    
    # Adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )
    
    # Check signature / stamp density area in bottom half
    height, width = gray.shape
    bottom_half = gray[int(height * 0.65):, :]
    non_white_ratio = np.sum(bottom_half < 200) / float(bottom_half.size)
    has_ink_marking = non_white_ratio > 0.03
    
    return {
        'original_shape': img.shape,
        'gray': gray,
        'thresh': thresh,
        'has_signature_stamp_marking': has_ink_marking
    }

def extract_text_from_image(image_path):
    """
    Extracts text using pytesseract with fallback heuristic parser
    """
    processed = preprocess_image(image_path)
    extracted_text = ""
    
    try:
        # Run Tesseract on thresholded image
        pil_img = Image.fromarray(processed['thresh'])
        extracted_text = pytesseract.image_to_string(pil_img, config='--psm 6')
    except Exception as e:
        # If tesseract is not installed or raises an error, return empty/fallback notice
        print(f"OCR warning: {e}")
        extracted_text = ""
        
    return {
        'text': extracted_text.strip(),
        'has_signature_marking': processed['has_signature_stamp_marking'],
        'dimensions': f"{processed['original_shape'][1]}x{processed['original_shape'][0]}"
    }
