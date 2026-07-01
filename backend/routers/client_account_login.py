from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..validations import password_validation
from ..database import get_db
from .. import models, oauth2, schemas

router = APIRouter(
    prefix="/login",
    tags=["Client Account Login"]
)

@router.post("/", response_model=schemas.Token)
def login_client_account(credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    current_account = db.query(models.Client).filter(models.Client.email == credentials.username).first()

    if not current_account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Credential não existente")

    if not password_validation.verify(credentials.password, current_account.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Credential não existente")

    access_token = oauth2.create_access_token(data ={"client_id": current_account.client_id})

    return {"access_token": access_token, "token_type": "bearer"}