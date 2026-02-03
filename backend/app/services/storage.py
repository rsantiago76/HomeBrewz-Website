import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import uuid

class StorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            region_name=settings.cognito_region, # reusing region setting or add new one? Assuming same region.
            # Credentials should be picked up from env vars (AWS_ACCESS_KEY_ID, etc.) automatically by boto3
            # or strictly passed if using different IAM user.
            # For Amplify hosting/Container, it might use TaskRole.
            # Local dev needs .env vars.
        )
        self.bucket_name = "homebrewz-storage" # TODO: Move to settings

    def generate_presigned_post(self, file_name: str, file_type: str, folder: str = "products"):
        """
        Generate a presigned URL/fields for POSTing a file to S3.
        """
        object_name = f"{folder}/{uuid.uuid4()}-{file_name}"
        
        try:
            response = self.s3_client.generate_presigned_post(
                Bucket=self.bucket_name,
                Key=object_name,
                Fields={
                    'acl': 'public-read', # Or private if using CloudFront signed URLs
                    'Content-Type': file_type
                },
                Conditions=[
                    {'acl': 'public-read'},
                    {'Content-Type': file_type},
                    ['content-length-range', 0, 10485760] # 10MB limit
                ],
                ExpiresIn=3600
            )
            return response # Contains 'url' and 'fields'
        except ClientError as e:
            # Log error
            return None
