import vertexai
from vertexai.generative_models import GenerativeModel
import json

def generate_quiz(content, is_topic=False, project_id="focus-storm-436610-b2"):
    """Generate a multiple-choice quiz from text or topic, returning JSON data."""
    try:
        try:
            vertexai.init(project=project_id, location="us-central1")
        except Exception as e:
            print(f"Error in vertexai init: {str(e)}")
            return None

        try:
            model = GenerativeModel("gemini-1.5-flash-001")
        except Exception as e:
            print(f"Error in GenerativeModel: {str(e)}")
            return None

        prompt = (
            f"Generate a quiz with 6 multiple-choice questions "
            f"{'about ' + content if is_topic else 'based on the following text:'}\n"
            "Return as JSON with format: "
            '{"title": "Quiz Title", "questions": ['
            '{"question": "Q1", "options": {"a": "A", "b": "B", "c": "C", "d": "D"}, '
            '"correct_answer": \"The correct answer should be the full text of the correct option, not just a letter.\"]}'
        )
        
        if not is_topic:
            prompt += f"\n\nText:\n{content}"
            
        response = model.generate_content(prompt)
        quiz_text = response.text.strip()
        if quiz_text.startswith("```json"):
            quiz_text = quiz_text[7:-3].strip()
        return json.loads(quiz_text)
        
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return None