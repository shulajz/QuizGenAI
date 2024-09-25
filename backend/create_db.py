from app import app, db
from models import User, Score

with app.app_context():
    db.create_all()
    print("Tables created successfully")
