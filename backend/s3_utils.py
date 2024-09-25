import io
from botocore.exceptions import BotoCoreError, ClientError

def upload_to_s3(s3_client, file_bytes, filename):
    try:
        s3_client.upload_fileobj(io.BytesIO(file_bytes), 'quizgame-storage-bucket', filename)
        return {'success': True}
    except (BotoCoreError, ClientError) as e:
        print(f"S3 upload error: {str(e)}")
        return {'success': False, 'error': str(e)}