from fastapi import HTTPException, status
from .. import schemas
import re

def username_size(username: schemas.ClientRegisterCredentials):
    if len(username) > 50:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="O nome de usuário excede o limite de caracteres permitidos")

def username_number_verify(username: schemas.ClientRegisterCredentials):
    have_number = bool(re.search(r'\d', username))
    if have_number == True:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="O nome de usuário deve ser composto apenas por letras")
    
def special_character(username: schemas.ClientRegisterCredentials):
    specials = "!@#$%^&*()_+"
    for e in specials:
        if bool(e in username) == True:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="O nome de usuário deve ser composto apenas por letras")