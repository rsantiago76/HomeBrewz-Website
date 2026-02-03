import json
import urllib.request
from typing import Any, Dict, Optional
from jose import jwt, jwk
from jose.utils import base64url_decode
from passlib.context import CryptContext
from app.core.config import settings

# Password Hashing Context
# Argon2 preferred, fallback to bcrypt
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

class CognitoVerifier:
    def __init__(self):
        self.region = settings.cognito_region
        self.user_pool_id = settings.cognito_user_pool_id
        self.client_id = settings.cognito_client_id
        # Construct JWKS URL
        self.jwks_url = f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}/.well-known/jwks.json"
        self._jwks_cache = None

    def get_jwks(self) -> Dict[str, Any]:
        if not self._jwks_cache:
            with urllib.request.urlopen(self.jwks_url) as response:
                self._jwks_cache = json.loads(response.read())
        return self._jwks_cache

    def verify_token_easy(self, token: str) -> Dict[str, Any]:
         # Validating via JWKS header match
        jwks = self.get_jwks()
        
        # This will verify signature, exp, etc.
        return jwt.decode(
            token, 
            jwks, 
            algorithms=['RS256'], 
            audience=self.client_id, 
            issuer=f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}",
            options={"verify_at_hash": False} 
        )

verifier = CognitoVerifier()
