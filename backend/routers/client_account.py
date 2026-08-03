from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..validations import client_username_validation, hashing, password_validation, email_validation
from ..database import get_db
from .. import schemas, models, oauth2 

router = APIRouter(
    prefix="/conta",
    tags=["Client Account Register"]
    )

@router.post("/registro", status_code=status.HTTP_201_CREATED, response_model=schemas.ClientRegisterOut)
def create_client_account(credentials: schemas.ClientRegisterCredentials, db: Session = Depends(get_db)):

    client_username_validation.username_validation(credentials.client_username)
    password_validation.password_validation(credentials.password)
    email_validation.email_format(credentials)

    current_email = db.query(models.Client).filter(models.Client.email == credentials.email).first()
    if current_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="E-mail já cadastrado.")
    
    current_phone = db.query(models.Client).filter(models.Client.phone_number == credentials.phone_number).first()
    if current_phone:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Número de telefone já cadastrado.")

    credentials.password = hashing.hash(credentials.password)

    new_client_account = models.Client(**credentials.dict())

    db.add(new_client_account)
    db.commit()
    db.refresh(new_client_account)

    return new_client_account
