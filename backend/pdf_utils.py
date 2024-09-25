import io
import re
from pypdf import PdfReader

def fix_missing_spaces(text):
    """
    Inserts spaces between words in the extracted text.
    """
    # Add space before capital letters if they're not at the start of the text and not preceded by a space
    text = re.sub(r'(?<=[a-z0-9])(?=[A-Z])', ' ', text)
    
    # Add space after period if it's followed by a capital letter
    text = re.sub(r'\.(?=[A-Z])', '. ', text)
    
    # Add space after comma if it's not followed by a space
    text = re.sub(r',(?=[^\s])', ', ', text)
    
    # Add space between number and word
    text = re.sub(r'(\d)([a-zA-Z])', r'\1 \2', text)
    text = re.sub(r'([a-zA-Z])(\d)', r'\1 \2', text)
    
    # Add space before and after special characters
    text = re.sub(r'([a-zA-Z])([&@#%])', r'\1 \2', text)
    text = re.sub(r'([&@#%])([a-zA-Z])', r'\1 \2', text)
    
    # Split words that are incorrectly joined (this is a heuristic approach and might need fine-tuning)
    text = re.sub(r'([a-z])([A-Z][a-z])', r'\1 \2', text)
    
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def process_pdf(file_bytes):
    pdf_reader = PdfReader(io.BytesIO(file_bytes))
    full_text = ""
    for page in pdf_reader.pages:
        text = page.extract_text()
        full_text += fix_missing_spaces(text) + "\n\n"
    return full_text