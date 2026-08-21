from fastapi import FastAPI, Depends
from .routers import client_account, client_account_auth, authenticated_homepage
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client_account.router)
app.include_router(client_account_auth.router)
app.include_router(authenticated_homepage.router)

@app.get("/")
def homepage():
    return

@app.get("/about")
def about():
    return

@app.get("/terms")
def terms():
    return