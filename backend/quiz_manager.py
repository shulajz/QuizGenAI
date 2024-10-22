import requests

def fetch_quiz_questions(num_questions=10, category=None, difficulty=None, question_type=None):
    url = 'https://opentdb.com/api.php'
    params = {
        'amount': num_questions,
        'type': 'multiple'
    }
    if category:
        params['category'] = category
    if difficulty:
        params['difficulty'] = difficulty

    response = requests.get(url, params=params)
    data = response.json()
    return data['results']
