from models import Quiz, QuestionAnswer, AnswerOption
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
        quizzes = Quiz.query.filter_by(user_id=user_id).all()
        quizzes_data = [quiz.to_dict() for quiz in quizzes]
        return quizzes_data

    except Exception as e:
        print(f'Error in get_quizes: {str(e)}')
        return {'error': str(e)}

