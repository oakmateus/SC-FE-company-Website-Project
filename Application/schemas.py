from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ClientRegisterCredentials(BaseModel):
    client_username: str
    email: EmailStr
    phone_number: str
    password: str

class ClientRegisterOut(BaseModel):
    client_id: int
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True

# Client Login Fields

class ClientLoginCredentials(BaseModel):
    email: EmailStr
    password: str

# Token

class TokenData(BaseModel):
    id: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str

    class Config:
        orm_mode = True