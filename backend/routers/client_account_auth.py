from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session

from ..validations import hashing, password_validation
from ..database import get_db
from .. import models, oauth2, schemas, config

from datetime import datetime, timedelta, UTC
import secrets
import string
import uuid

import resend
resend.api_key = config.settings.resend_api_key


router = APIRouter(
    prefix="/login",
    tags=["Client Account Login"]
)

@router.post("/")
def login_client_account(credentials: schemas.ClientLoginCredentials, db: Session = Depends(get_db)):

    current_account = db.query(models.Client).filter(models.Client.email == credentials.email).first()

    if not current_account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="A senha ou e-mail são invalidos.")

    if not hashing.verify(credentials.password, current_account.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="A senha ou e-mail são invalidos.")

    revoked = db.query(models.RefreshToken).filter(models.RefreshToken.client_id == current_account.client_id)

    if revoked:
        revoked.update({"revoked": True})

    if credentials.remember_me == True:
        jti = uuid.uuid4()

        access_token = oauth2.create_access_token(data ={"client_id": current_account.client_id})
        refresh_token = oauth2.create_refresh_token(data = {"client_id": current_account.client_id, "jti": str(jti)})

        db.add(
            models.RefreshToken(
                token_id = jti,
                client_id = current_account.client_id,
                revoked = False,
                expires_at = datetime.now(UTC) + timedelta(days=config.settings.access_token_expire_days)
            )
        )

        db.commit()

        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
        
    else:
        access_token = oauth2.create_access_token(data ={"client_id": current_account.client_id})
        return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh", response_model=schemas.Token)
def refresh_token(db: Session = Depends(get_db), refresh_token = Depends(oauth2.get_refresh_client)):

    client, token = refresh_token

    current_account = db.query(models.Client).filter(models.Client.client_id == client.client_id).first()
    if not current_account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Credenciais não atorizadas")

    current_token = db.query(models.RefreshToken).filter(models.RefreshToken.token_id == token.jti).first()
    if not current_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Credenciais não atorizadas")

    if current_token.revoked == True:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Credenciais não atorizadas")

    if datetime.now(UTC) > current_token.expires_at:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Credenciais não atorizadas")
    
    access_token = oauth2.create_access_token(data ={"client_id": client.client_id})

    return {"access_token": access_token, "token_type": "bearer"}

# Recovery Account

@router.post("/recover")
def forgot_password(credentials: schemas.ConfirmationStep, db: Session = Depends(get_db)):

    current_account = db.query(models.Client).filter(models.Client.email == credentials.email).first()

    if not current_account:
        return {"message": "Se existir uma conta para este e-mail, um código será enviado."}
    
    alphabet = string.ascii_uppercase + string.digits
    code = "".join(secrets.choice(alphabet) for _ in range(6))

    hashed_code = hashing.hash(code)   

    recovery_credentials = db.query(models.RecoveryCode).filter(models.RecoveryCode.client_id == current_account.client_id).first()

    if  recovery_credentials:
            recovery_credentials.recovery_code = hashed_code
            recovery_credentials.code_expires_at = datetime.now(UTC) + timedelta(minutes=5)
    else:
        recovery_credentials = models.RecoveryCode(
            client_id = current_account.client_id,
            recovery_code = hashed_code,
            code_expires_at = datetime.now(UTC) + timedelta(minutes=5)
        )
        db.add(recovery_credentials)

    db.commit()

    try:
        resend.Emails.send({
        "from": "Acme <onboarding@resend.dev>",
        "to": [current_account.email],
        "subject": "Recuperação de senha",
        "html": f"Seu código é <strong>{code}</strong>"
    })

    except Exception as e:
        db.delete(recovery_credentials)
        db.commit()

        raise HTTPException(
            status_code=503,
            detail="Não foi possível enviar o e-mail."
        )

    recovery_token = oauth2.create_recovery_token(
        {
            "client_id": current_account.client_id
        }
    )

    return {"recovery_token": recovery_token}

@router.post("/recover/confirmation", status_code=status.HTTP_201_CREATED)
def confirm_recovery(input: schemas.RecoveryCredentials, db: Session = Depends(get_db), token: str = Depends(oauth2.get_recovery_client)):

    recovery_credentials = db.query(models.RecoveryCode).filter(models.RecoveryCode.client_id == token.client_id).first()

    if not recovery_credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Não Autorizado")

    if datetime.now(UTC) > recovery_credentials.code_expires_at:
        raise HTTPException(
            status_code=400,
            detail="Código expirado."
        )
    
    if not hashing.verify(input.code, recovery_credentials.recovery_code):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Código invalido.")

    updated_credential = db.query(models.Client).filter(models.Client.client_id == token.client_id)

    to_verify = updated_credential.first()

    if hashing.verify(input.password, to_verify.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="A senha não pode ser repetida.")

    password_validation.password_validation(input.password)

    updated_credential.update(
        {"password": hashing.hash(input.password)},
        synchronize_session=False
    )

    db.delete(recovery_credentials)
    db.commit()
    
    return {"message": "Senha alterada."}