from fastapi import APIRouter, Depends
from .. import oauth2

router = APIRouter(
    prefix="/users/me",
    tags=["Authenticated Homepage Dashboard"]
)

@router.get("/")
def current_client(client = Depends(oauth2.get_current_client)):
    return client

@router.get("/scheduling")
def current_client(client = Depends(oauth2.get_current_client)):
    return client