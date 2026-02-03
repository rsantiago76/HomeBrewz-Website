from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Body
from app import schemas, models
from app.api import deps
from app.services.storage import StorageService
from pydantic import BaseModel

router = APIRouter()

class PresignedUrlRequest(BaseModel):
    file_name: str
    file_type: str
    folder: str = "products"

@router.post("/presigned", response_model=dict)
async def generate_upload_url(
    *,
    request: PresignedUrlRequest,
    current_user: models.User = Depends(deps.get_current_active_user), # Any active user or restriction?
) -> Any:
    """
    Generate S3 presigned URL for file upload.
    User must be authenticated.
    """
    # TODO: Add role check? Only Roaster Staff/Admin should upload product images.
    # For now, simplistic auth check.
    
    storage = StorageService()
    # Note: bucket name might need configuration
    # In a real app we'd inject this setting
    # storage.bucket_name = settings.S3_BUCKET_NAME
    
    data = storage.generate_presigned_post(request.file_name, request.file_type, request.folder)
    
    if not data:
        raise HTTPException(status_code=500, detail="Could not generate upload URL")
        
    return data
