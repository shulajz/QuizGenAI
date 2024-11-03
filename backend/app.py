from flask import Flask, jsonify, request
from datetime import timedelta
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from flask import send_from_directory
import boto3
import PyPDF2
from dotenv import load_dotenv
import pdfplumber
from pypdf import PdfReader
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import io
from pdf_utils import process_pdf
from s3_utils import upload_to_s3
from openai_utils import generate_quiz
import re
from models import User, Quiz, QuestionAnswer, Result
from flask_migrate import Migrate
from extensions import db
from quiz_service import create_quiz, get_quizes, delete_quiz
from cache import cache_quiz, invalidate_quiz_cache

load_dotenv()  # Load environment variables from .env file

def create_app():
    app = Flask(__name__)
    
    # Database configuration
    database_url = os.getenv('DATABASE_URL')
    # Fix Heroku's postgres:// vs postgresql:// issue
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', os.getenv('HEROKU_POSTGRESQL_PURPLE_URL', database_url))

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 5,
        'max_overflow': 10,
        'pool_timeout': 30,
        'pool_recycle': 1800,
    }
    
    # JWT configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))
    
    # CORS configuration
    # CORS(app, resources={r"/*": {"origins": os.getenv('CORS_ORIGIN')}}, supports_credentials=True)
    CORS(app, resources={r"/*": {
    "origins": ["http://localhost:3000", "https://my-quiz.herokuapp.com"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}}, supports_credentials=True)
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    
    return app

app = create_app()


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1) 
app.config['JWT_SECRET_KEY'] = 'your_secret_key'

# Configure AWS S3 credentials
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
s3_client = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

jwt = JWTManager(app)

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
    access_token = create_access_token(identity=new_user.id)

    return jsonify(message="User created successfully", token=access_token, userId=new_user.id, username=new_user.username), 201


@app.route('/api/signin', methods=['POST'])
def login():
    print('hi!!!')
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(token=access_token, username=user.username, userId=user.id), 200
    else:
        return jsonify(message="Invalid username or password"), 401


@app.route('/api/upload', methods=['POST'])
@jwt_required() 
def upload_file():
    user_id = get_jwt_identity()

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
        quiz = generate_quiz(full_text, is_topic=False)
    
        # Create quiz and its answers
        new_quiz = create_quiz(quiz, user_id)

        return jsonify({
            'message': 'File uploaded successfully',
            'quizId': new_quiz.id
        })

    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({'error': 'File processing failed', 'details': str(e)}), 500


@app.route('/api/generate-quiz', methods=['POST'])
@jwt_required() 
def generate_quiz_endpoint():
    user_id = get_jwt_identity()

    try:
        data = request.get_json()
        topic = data.get('topic')

        if not topic:
            return jsonify({'error': 'Topic is required'}), 400

        # Generate quiz using OpenAI
        quiz_data = generate_quiz(topic, is_topic=True)

        if not quiz_data:
            return jsonify({'error': 'Failed to generate quiz'}), 500
    
        # Create quiz and its answers
        new_quiz = create_quiz(quiz_data, user_id)

        return jsonify({'quiz_id': new_quiz.id}), 200


    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({'error': 'File processing failed', 'details': str(e)}), 500

@app.route('/api/users/<int:user_id>/quizzes', methods=['GET'])
@jwt_required()
def get_user_quizzes(user_id):
    print(f"Fetching quizzes for user_id: {user_id}") 
    quizzes_data = get_quizes(user_id)

    if 'error' in quizzes_data:
        return jsonify(quizzes_data), 500

    return jsonify(quizzes_data), 200

@app.route('/api/results', methods=['POST'])
@jwt_required()
def create_result():
    data = request.get_json()

    user_id = data.get('user_id')
    quiz_id = data.get('quiz_id')
    score = data.get('score')
    total_questions = data.get('total_questions')
    time_taken = data.get('time_taken', 0)  # Optional field, default to 0 if not provided

    try:
        new_result = Result(
            user_id=user_id,
            quiz_id=quiz_id,
            score=score,
            total_questions=total_questions,
            time_taken=time_taken,
        )
        db.session.add(new_result)
        db.session.commit()

        return jsonify({'message': 'Result created successfully', 'result_id': new_result.id}), 201
    except Exception as e:
        print(f'Error creating result: {str(e)}')
        return jsonify({'error': 'An error occurred while creating the result'}), 500

@app.route('/api/quizzes/<int:quiz_id>', methods=['GET'])
@jwt_required()
@cache_quiz(timeout=300) 
def get_quiz_by_id(quiz_id):
    """Retrieve a quiz by its ID."""
    try:
        # For taking a quiz - load questions and their options
        quiz = db.session.query(Quiz)\
            .filter_by(id=quiz_id)\
            .options(
                db.joinedload(Quiz.questions).joinedload(QuestionAnswer.options)
            )\
            .first()
        if quiz is None:
            return jsonify({'error': 'Quiz not found'}), 404
        return jsonify(quiz.to_dict_with_questions()), 200

    except Exception as e:
        print(f'Error retrieving quiz: {str(e)}')
        return jsonify({'error': 'An error occurred while retrieving the quiz'}), 500



@app.route('/api/quizzes/<int:quiz_id>', methods=['DELETE'])
@jwt_required()
def delete_quiz_route(quiz_id):
    try:
        result = delete_quiz(quiz_id)
        if result is None: 
            return jsonify({'error': 'Unknown error occurred'}), 500
            
        if 'error' in result:
            return jsonify(result), 404 if result['error'] == 'Quiz not found' else 500

        invalidate_quiz_cache(quiz_id)
            
        return jsonify(result), 200
        
    except Exception as e:
        print(f'Error in delete_quiz_route: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/')
def serve():
    """Serve React App"""
    try:
        return send_from_directory('../frontend/build', 'index.html')
    except Exception as e:
        print(f"Error serving index: {str(e)}")
        return jsonify({'error': 'Failed to load application'}), 500

@app.route('/<path:path>')
def static_proxy(path):
    """Serve static files"""
    try:
        file_path = os.path.join('../frontend/build', path)
        if os.path.isfile(file_path):
            return send_from_directory('../frontend/build', path)
        return serve()  # Return index.html for all other routes
    except Exception as e:
        print(f"Error serving static file: {str(e)}")
        return serve()

@app.errorhandler(404)
def not_found(e):
    return serve()

@app.errorhandler(405)
def method_not_allowed(e):
    return serve()


@app.route('/api/upload', methods=['OPTIONS'])
def handle_preflight():
    return '', 200

@app.route('/api/register', methods=['OPTIONS'])
def handle_preflight1():
    return '', 200

@app.route('/api/signin', methods=['OPTIONS'])
def handle_preflight2():
    return '', 200

@app.route('/api/users/<int:user_id>/quizzes', methods=['OPTIONS'])
def handle_preflight3():
    return '', 200

@app.route('/api/results', methods=['OPTIONS'])
def handle_preflight4():
    return '', 200

# if __name__ == '__main__':
#     with app.app_context():
#         db.create_all() 
#     app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Use Heroku's PORT environment variable
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)