from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from ..utils import password_utils, client_username_fields
from ..database import get_db
from .. import schemas, models

router = APIRouter(
    prefix="/register",
    tags=["Client Account Register"]
    )

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ClientRegisterOut)
def create_client_account(credentials: schemas.ClientRegisterCredentials, db: Session = Depends(get_db)):

    client_username_fields.username_size(credentials.client_username)
    client_username_fields.username_number_verify(credentials.client_username)
    client_username_fields.special_character(credentials.client_username)

    password_utils.password_size(credentials.password)
    password_utils.isupper_character(credentials.password)
    password_utils.password_have_number(credentials.password)
    password_utils.special_character(credentials.password)

    credentials.password = password_utils.hash(credentials.password)

    new_client_account = models.Client(**credentials.dict())

    db.add(new_client_account)
    db.commit()
    db.refresh(new_client_account)

    return new_client_account

