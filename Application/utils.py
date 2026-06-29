from passlib.context import CryptContext
from fastapi import status, HTTPException
import re
from . import schemas

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash(password: schemas.ClientRegisterCredentials):
    return pwd_context.hash(password)

def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def password_size(password: schemas.ClientRegisterCredentials):
    len_password = len(password)
    if len_password < 8:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="A senha precisa ter pelo menos 8 dígitos")
    
def password_have_number(password: schemas.ClientRegisterCredentials):
    have_number = bool(re.search(r'\d', password))
    if have_number == False or have_number == None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="A senha precisa ter pelo menos um número")

def isupper_character(password: schemas.ClientRegisterCredentials):
    for e in password:
        if e.isupper() == True:
            break
    else:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="A senha precisa ter pelo menos uma letra maiúscula")
    
def special_character(password: schemas.ClientRegisterCredentials):
    specials = "!@#$%^&*()_+"
    for e in specials:
        if bool(e in password) == True:
            break
    else:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="A senha precisa ter pelo menos um caractere especial")