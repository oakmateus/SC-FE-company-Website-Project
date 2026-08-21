from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from . import schemas, database, models
from .config import settings
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

def create_access_token(data: dict):
   to_encode = data.copy()

   expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
   to_encode.update({"exp": expire, 
                     "scope": "access"})

   encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

   return encoded_jwt

def create_refresh_token(data: dict):
   to_encode = data.copy()

   expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
   to_encode.update({"client_id": data["client_id"],
                    "exp": expire,
                    "jti": data["jti"], 
                    "scope": "refresh",
                    "type": "refresh"})

   encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

   return encoded_jwt

def create_recovery_token(data: dict):
   to_encode = data.copy()

   expire = datetime.utcnow() + timedelta(minutes=settings.recovery_token_expire_minutes)
   to_encode.update({
      "client_id": data["client_id"],
      "scope": "password_recovery",
      "type": "recovery",
      "exp": expire
   })

   encoded_jwt = jwt.encode(to_encode, settings.recovery_secret_key, algorithm=settings.algorithm)

   return encoded_jwt

# token current validation fields

def verify_token(
    token: str,
    secret_key: str,
    expected_scope: str,
    credentials_exception
):
   try:
      payload = jwt.decode(
         token,
         secret_key,
         algorithms=[settings.algorithm]
      )

      scope = payload.get("scope")

      if scope != expected_scope:
         raise credentials_exception

      jti = payload.get("jti")


      if expected_scope == "refresh" and jti is None:
         raise credentials_exception

      client_id = payload.get("client_id")

      if client_id is None:
         raise credentials_exception

      return schemas.TokenData(client_id=client_id, jti=jti)

   except JWTError:
      raise credentials_exception

def get_current_user(
   secret_key: str,
   expected_scope: str,
   token: str,
   db: Session
):
   credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
   detail="could not validate credentials", headers={"WWW-Authenticate": "Bearer"})

   token = verify_token(token, secret_key, expected_scope, credentials_exception)

   client = db.query(models.Client).filter(models.Client.client_id == token.client_id).first()

   if not client:
      raise credentials_exception

   if expected_scope == "refresh":
      return client, token

   return client

def get_current_client(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
   return get_current_user(settings.secret_key, "access", token, db)

def get_refresh_client(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
   return get_current_user(settings.secret_key, "refresh", token, db)

def get_recovery_client(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
   return get_current_user(settings.recovery_secret_key, "password_recovery", token, db)