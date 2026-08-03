from fastapi import HTTPException, status
from pydantic import TypeAdapter, EmailStr
from .. import schemas

def email_format(useremail):
    email_adapter = TypeAdapter(EmailStr)

    try:
        email_adapter.validate_python(useremail.email)
    except Exception:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="Formato de e-mail invalido.")   
    