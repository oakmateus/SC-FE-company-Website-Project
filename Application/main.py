from fastapi import FastAPI
from . import database, models
from .database import Base, engine

app = FastAPI()

@app.get("/")
def root():
    return {'default': 'default'}