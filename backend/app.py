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
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # Ensure JWTManager is imported
import io
from pdf_utils import process_pdf
from s3_utils import upload_to_s3
from openai_utils import generate_quiz
import re
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from extensions import db

load_dotenv()  # Load environment variables from .env file

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Nov2017890#@node128.codingbc.com:7878/shulamit_db'  # Update your credentials
    db.init_app(app)
    return app

app = create_app()


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a more secure key in production

# Configure AWS S3 credentials
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')

s3_client = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

jwt = JWTManager(app)

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the user already exists
    if User.query.filter_by(username=username).first():
        return jsonify(message="Username already exists"), 400
    if User.query.filter_by(email=email).first():
        return jsonify(message="Email already exists"), 400

    # Create a new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    # Generate JWT token
    access_token = create_access_token(identity=new_user.username)

    return jsonify(message="User created successfully", token=access_token), 201


@app.route('/api/signin', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.username)
        return jsonify(token=access_token, username=user.username), 200
    else:
        return jsonify(message="Invalid username or password"), 401


@app.route('/api/upload', methods=['POST'])
@jwt_required() 
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

        return jsonify({
            'message': 'File uploaded successfully',
            'quiz': quiz
        })

    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({'error': 'File processing failed', 'details': str(e)}), 500


@app.route('/api/upload', methods=['OPTIONS'])
def handle_preflight():
    return '', 200

@app.route('/api/register', methods=['OPTIONS'])
def handle_preflight1():
    return '', 200

@app.route('/api/signin', methods=['OPTIONS'])
def handle_preflight2():
    return '', 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure the database tables are created
    app.run(debug=True)
