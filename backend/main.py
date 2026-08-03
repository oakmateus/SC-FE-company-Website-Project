from fastapi import FastAPI, Depends
from .routers import client_account, client_account_auth
from fastapi.middleware.cors import CORSMiddleware

from . import oauth2

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client_account.router)
app.include_router(client_account_auth.router)

@app.get("/")
def root():
    return

@app.get("/users/me")
def current_client(client = Depends(oauth2.get_current_client)):
    return client