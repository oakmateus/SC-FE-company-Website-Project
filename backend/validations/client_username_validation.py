from fastapi import HTTPException, status
import re

def username_size(username: str):
    if len(username) > 50:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="Limite de caracteres excedido.")

def username_number_verify(username: str):
    have_number = bool(re.search(r'\d', username))
    if have_number == True:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="Nome de usuário invalido.")
    
def special_character(username: str):
    specials = "!@#$%^&*()_+-"
    for e in specials:
        if bool(e in username) == True:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                                detail="Nome de usuário invalido.")
        
def username_validation(username: str):
    username_size(username)
    username_number_verify(username)
    special_character(username)