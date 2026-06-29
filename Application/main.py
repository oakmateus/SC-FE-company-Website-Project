from fastapi import FastAPI
from .routers import client_account_register, client_account_login

app = FastAPI()

app.include_router(client_account_register.router)
app.include_router(client_account_login.router)

@app.get("/")
def root():
    return {'default': 'default'}