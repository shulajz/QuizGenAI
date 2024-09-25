from flask import Flask, jsonify, request
from flask_cors import CORS
from quiz_manager import fetch_quiz_questions
from flask_sqlalchemy import SQLAlchemy
import os
import boto3
import PyPDF2
from dotenv import load_dotenv
import pdfplumber
from pypdf import PdfReader
import io
from pdf_utils import process_pdf
from s3_utils import upload_to_s3
from openai_utils import generate_quiz

load_dotenv()  # Load environment variables from .env file
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

# Configure AWS S3 credentials
s3_client = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Function to fix missing spaces between words
import re

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        file_bytes = file.read()
        
        # Process PDF
        full_text = process_pdf(file_bytes)
        
        # Upload to S3
        s3_result = upload_to_s3(s3_client, file_bytes, file.filename)
        if not s3_result['success']:
            return jsonify({'error': 'File upload failed', 'details': s3_result['error']}), 500

        # Generate quiz using OpenAI
        quiz = generate_quiz(full_text)

        print(quiz)

        return jsonify({
            'message': 'File uploaded successfully',
            'quiz': quiz
        })

    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({'error': 'File processing failed', 'details': str(e)}), 500



# # Initialize the database
# db = SQLAlchemy(app)
@app.route('/api/request-quiz', methods=['POST'])
def request_quiz():
    try:
        data = request.json

        num_questions = data.get('numQuestions')
        category = data.get('category') if data.get('category') != 'any' else None
        difficulty = data.get('difficulty') if data.get('difficulty') != 'any' else None
        question_type = data.get('type') if data.get('type') != 'any' else None
        print(f'Received data: numQuestions={num_questions}, category={category}, difficulty={difficulty}, type={question_type}')

        quiz_questions = fetch_quiz_questions(num_questions=num_questions, category=category, difficulty=difficulty, question_type=question_type)

        return jsonify({'quizQuestions': quiz_questions}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/upload', methods=['OPTIONS'])
def handle_preflight():
    return '', 200

if __name__ == '__main__':
    app.run(debug=True)





# Configure the PostgreSQL database connection
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://shulajz:1234qwer@localhost/postgres'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False