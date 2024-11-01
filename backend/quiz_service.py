from models import Quiz, QuestionAnswer
from extensions import db

def create_quiz(quiz_data):
    new_quiz = Quiz(title=quiz_data['title'])
    db.session.add(new_quiz)
    db.session.flush()  # Flush to get new_quiz.id for foreign key reference

    for question in quiz_data['questions']:
        question_text = question['question']
        correct_answer = question['correct_answer']
        
        for _, option_text in question['options'].items():
            # Check if this option is the correct answer
            is_correct = (option_text == correct_answer)

            # Create a QuestionAnswer entry
            question_answer = QuestionAnswer(
                quiz_id=new_quiz.id,
                question_text=question_text,
                answer_text=option_text,
                is_correct=is_correct
            )
            
            db.session.add(question_answer)

    db.session.commit()  # Commit all changes
    return new_quiz
