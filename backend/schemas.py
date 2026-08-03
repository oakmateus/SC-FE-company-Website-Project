from pydantic import BaseModel, EmailStr
from pydantic_extra_types.phone_numbers import PhoneNumberValidator
from datetime import datetime
from typing import Optional, Annotated, Union
import phonenumbers
from uuid import UUID

# Token

class TokenData(BaseModel):
    client_id: Optional[int] = None
    jti: UUID | None = None

class Token(BaseModel):
    access_token: str
    token_type: str

    class Config:
        orm_mode = True

# Client Account Register Fields

BrazilPhoneNumber = Annotated[
    Union[str, phonenumbers.PhoneNumber],
    PhoneNumberValidator(
        default_region="BR",
        supported_regions=["BR"],
        number_format="E164",
    ),
]

class ClientRegisterCredentials(BaseModel):
    client_username: str
    email: str
    phone_number: BrazilPhoneNumber
    password: str

class ClientRegisterOut(BaseModel):
    client_id: int
    email: str
    phone_number: BrazilPhoneNumber
    created_at: datetime

    class Config:
        orm_mode = True

# Client Account Login Fields

class ClientLoginCredentials(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False
    
# Recovery Password

class ConfirmationStep(BaseModel):
    email: EmailStr

class RecoveryCredentials(BaseModel):
    password: str
    code: str