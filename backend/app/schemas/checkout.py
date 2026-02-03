from pydantic import BaseModel, EmailStr

class CreateCheckoutSessionIn(BaseModel):
    guest_email: EmailStr | None = None

class CreateCheckoutSessionOut(BaseModel):
    checkout_url: str
