from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, models, utils

router = APIRouter(
    prefix="/register",
    tags=["Client Account Register"]
    )

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.ClientRegisterOut)
def create_client_account(credentials: schemas.ClientRegisterCredentials, db: Session = Depends(get_db)):

    utils.password_size(credentials.password)
    utils.isupper_character(credentials.password)
    utils.password_have_number(credentials.password)
    utils.special_character(credentials.password)

    credentials.password = utils.hash(credentials.password)

    new_client_account = models.Client(**credentials.dict())

    db.add(new_client_account)
    db.commit()
    db.refresh(new_client_account)

    return new_client_account

