from models import Quiz, QuestionAnswer, AnswerOption, Result
from extensions import db

def create_quiz(quiz_data, user_id):
    new_quiz = Quiz(title=quiz_data['title'], user_id=user_id)
    db.session.add(new_quiz)
    db.session.flush()  # Flush to get new_quiz.id for foreign key reference

    # Iterate through questions in the provided quiz_data
    for question in quiz_data['questions']:
        question_text = question['question']
        correct_answer_text = question['correct_answer']

        question_answer = QuestionAnswer(
            quiz_id=new_quiz.id,
            question_text=question_text,
            correct_answer_text=correct_answer_text  
        )
        
        db.session.add(question_answer) 
        db.session.flush()

        for _, option_text in question['options'].items():
            answer_option = AnswerOption(
                question_id=question_answer.id,
                answer_text=option_text,
                is_correct=(option_text == correct_answer_text)
            )
            db.session.add(answer_option)

    db.session.commit()  
    return new_quiz


def get_quizes(user_id):
    try:
        quizzes = db.session.query(Quiz)\
            .filter_by(user_id=user_id)\
            .options(
                db.joinedload(Quiz.results)
            )\
            .all()
        quizzes_data = [quiz.to_dict() for quiz in quizzes]
        return quizzes_data

    except Exception as e:
        print(f'Error in get_quizes: {str(e)}')
        return {'error': str(e)}

def delete_quiz(quiz_id):
    try:
        with db.session.begin():
            # Check if quiz exists
            quiz_exists = db.session.query(
                db.session.query(Quiz).filter_by(id=quiz_id).exists()
            ).scalar()
            
            if not quiz_exists:
                return {'error': 'Quiz not found'}
            
            # Get question IDs first
            question_ids = db.session.query(QuestionAnswer.id)\
                .filter(QuestionAnswer.quiz_id == quiz_id)\
                .all()
            question_ids = [q[0] for q in question_ids]
            
            # Bulk delete results
            db.session.query(Result)\
                .filter(Result.quiz_id == quiz_id)\
                .delete()
            
            # Bulk delete answer options using question_ids
            if question_ids:
                db.session.query(AnswerOption)\
                    .filter(AnswerOption.question_id.in_(question_ids))\
                    .delete(synchronize_session=False)
            
            # Bulk delete questions
            db.session.query(QuestionAnswer)\
                .filter(QuestionAnswer.quiz_id == quiz_id)\
                .delete()
            
            # Delete the quiz
            db.session.query(Quiz)\
                .filter(Quiz.id == quiz_id)\
                .delete()
            
            return {'message': 'Quiz deleted successfully'}
                
    except Exception as e:
        print(f'Error in delete_quiz: {str(e)}')
        db.session.rollback()
        return {'error': str(e)}




