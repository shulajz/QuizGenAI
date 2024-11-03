import vertexai
from vertexai.generative_models import GenerativeModel
import json

vertexai.init(project='focus-storm-436610-b2', location="us-central1")

# Define the function to generate a quiz
def generate_quiz(text):
    try:
        # Initialize the GenerativeModel
        model = GenerativeModel("gemini-1.5-flash-001")
        
        prompt = (
            "You are a helpful assistant that generates quizzes based on given text. "
            "Based on the following text, generate a quiz with 6 multiple-choice questions in JSON format. "
            "Each question should have one correct answer and three distractors. "
            "Additionally, include a title for the quiz. "
            "Return the output as a JSON object structured like this:\n"
            "{\n"
            "  \"title\": \"Quiz Title Here\",\n"
            "  \"questions\": [\n"
            "    {\n"
            "      \"question\": \"Question text here\",\n"
            "      \"options\": {\n"
            "        \"a\": \"Option A\",\n"
            "        \"b\": \"Option B\",\n"
            "        \"c\": \"Option C\",\n"
            "        \"d\": \"Option D\"\n"
            "      },\n"
            "      \"correct_answer\": \"The correct answer should be the full text of the correct option, not just a letter.\"\n"
            "    },\n"
            "    ... (add more questions here)\n"
            "  ]\n"
            "}\n\n" + text
        )
        
        # Call the model's chat completion
        response = model.generate_content(prompt)

        # Extract the generated text
        quiz_content = response.text
        # Remove Markdown formatting
        if quiz_content.startswith("```json") and quiz_content.endswith("```"):
            quiz_content = quiz_content[7:-3].strip()  # Remove the ```json and ending ``` 
        quiz_json = json.loads(quiz_content)
        return quiz_json
    
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return None
