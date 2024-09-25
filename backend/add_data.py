# add_data.py
from app import app, db
from models import User, Score
from datetime import datetime  # Import datetime module

with app.app_context():
    # Create a new user
    new_user = User(username='testuser12', password='testpasswor2d1')
    new_user.set_password('testpassword')
    db.session.add(new_user)
    db.session.commit()  # Commit to save the user and assign an ID

    # Create a new score
    new_score = Score(user_id=new_user.id, score=100, quiz_category='General Knowledge', quiz_date=datetime.now())
    db.session.add(new_score)
    db.session.commit()

    print("Sample data added successfully")