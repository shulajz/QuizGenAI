
import redis
import json
import os
from functools import wraps
from flask import jsonify
from dotenv import load_dotenv

load_dotenv()

# Get the Redis URL from the environment or default to localhost
redis_url = os.getenv('REDISCLOUD_URL', 'redis://localhost:6379/0')
redis_client = redis.from_url(redis_url)


def cache_quiz(timeout=300):  # 5 minutes default timeout
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            quiz_id = kwargs.get('quiz_id')
            if not quiz_id:
                return f(*args, **kwargs)
            
            cache_key = f'quiz:{quiz_id}'
            
            try:
                # Try to get data from cache
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    print("Cache hit for quiz:", quiz_id)
                    return jsonify(json.loads(cached_data))
                
                # If not in cache, get from database
                print("Cache miss for quiz:", quiz_id)
                response = f(*args, **kwargs)
                
                # Extract data from response before caching
                if response[1] == 200:  # Check status code
                    response_data = response[0].get_json()  # Get data from Response object
                    redis_client.setex(
                        cache_key,
                        timeout,
                        json.dumps(response_data)
                    )
                
                return response
            except redis.RedisError as e:
                print(f"Redis error: {e}")
                return f(*args, **kwargs)
            except Exception as e:
                print(f"Caching error: {e}")
                return f(*args, **kwargs)
                
        return decorated_function
    return decorator

def invalidate_quiz_cache(quiz_id):
    cache_key = f'quiz:{quiz_id}'
    try:
        redis_client.delete(cache_key)
        print(f"Cache invalidated for quiz:{quiz_id}")
    except redis.RedisError as e:
        print(f"Error invalidating cache for quiz:{quiz_id}: {e}")