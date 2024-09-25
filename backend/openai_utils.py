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
            "Return the output as a JSON object with questions and their options structured like this:\n"
            "{\n"
            "  \"question\": \"Question text here\",\n"
            "  \"options\": {\n"
            "    \"a\": \"Option A\",\n"
            "    \"b\": \"Option B\",\n"
            "    \"c\": \"Option C\",\n"
            "    \"d\": \"Option D\",\n"
            "  \"correct_answer\": \"The correct answer should be the full text of the correct option, not just a letter.\"\n"
            "  }\n"
            "}\n\n" + text
        )
        
        # Call the model's chat completion
        response = model.generate_content(prompt)

        # Extract the generated text
        quiz_content = response.text
        print("Raw AI response:", quiz_content)
                # Remove Markdown formatting
        if quiz_content.startswith("```json") and quiz_content.endswith("```"):
            quiz_content = quiz_content[7:-3].strip()  # Remove the ```json and ending ``` 
        quiz_json = json.loads(quiz_content)
        print('quiz json:', quiz_json)
        return quiz_json
    
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return None

# Example usage
# text = """Adobe Acrobat PDF Files Adobe® Portable Document Format (PDF) is a universal file format that preserves all of the fonts, formatting, colours and graphics of any source document, regardless of the application and platform used to create it. Adobe PDF is an ideal format for electronic document distribution as it overcomes the problems commonly encountered with electronic file sharing."""
# quiz = generate_quiz(text)
# print(quiz)


# generator = pipeline('text-generation', model='distilgpt2')  # You can choose other models if needed


# def generate_quiz(text):
#     try:
#         # Generate quiz questions based on the provided text
#         # prompt = f"Generate a quiz with 4 multiple-choice questions based on the following text:\n\n{text}"
#         prompt = (
#             "Based on the following text, generate a quiz with 4 multiple-choice questions. "
#             "Each question should have one correct answer and three distractors. "
#             "Provide the questions and their options clearly:\n\n" +
#             text
#         )
#         response = generator(prompt, max_length=400, num_return_sequences=1, truncation=False)
        
#         # Extract the generated text
#         quiz_content = response[0]['generated_text']
#         return quiz_content
#     except Exception as e:
#         print(f"Error generating quiz: {str(e)}")
#         return None


# from openai import OpenAI
# import os


# # Initialize the OpenAI client
# client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# def generate_quiz(text):
#     try:
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant that generates quizzes based on given text."},
#                 {"role": "user", "content": f"Generate a quiz with 4 multiple-choice questions based on the following text:\n\n{text}"}
#             ]
#         )
#         return response.choices[0].message.content
#     except Exception as e:
#         print(f"OpenAI API error: {str(e)}")
#         return None
# import os
# import openai

# openai.api_key = os.getenv('OPENAI_API_KEY')


# def generate_quiz(text):
#     try:
#         response = openai.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant that generates quizzes based on given text."},
#                 {"role": "user", "content": f"Generate a quiz with 4 multiple-choice questions based on the following text:\n\n{text}"}
#             ]
#         )
#         return response.choices[0].message['content']
#     except Exception as e:
#         print(f"OpenAI API error: {str(e)}")
#         return None