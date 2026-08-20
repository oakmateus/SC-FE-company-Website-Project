from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from ..database import get_db
from .. import oauth2, schemas, models, config
from ..services import scheduling_pdf
from ..validations import scheduling_validations, hashing

import base64

import resend
resend.api_key = config.settings.resend_api_key

router = APIRouter(
    prefix="/users/me",
    tags=["Authenticated Homepage Dashboard"]
)

@router.get("/")
def auth_homepage(client = Depends(oauth2.get_current_client)):
    return client

@router.post("/scheduling")
def scheduling(scheduling: schemas.Scheduling, db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):

    scheduling_validations.fieds_colision_treatment(scheduling)
    scheduling_validations.empty_fields_and_expired_date(scheduling)
    scheduling_validations.string_validations(scheduling.custom_event, 150)
    scheduling_validations.string_validations(scheduling.custom_service, 300)
    scheduling_validations.string_validations(scheduling.event_address, 300)
    scheduling_validations.string_validations(scheduling.optional_observatios, 1000)

    db.add(
        models.ServiceAppointment(
            client_id = client.client_id,
            client_username = client.client_username,
            phone_number = client.phone_number,
            event_types = scheduling.event_types,
            custom_event = scheduling.custom_event,
            service_types = scheduling.service_types,
            custom_service = scheduling.custom_service,
            optional_kitchens = scheduling.optional_kitchens,
            estimated_event_date = scheduling.estimated_date,
            estimated_guests_quantity = scheduling.estimated_gests_quantity,
            estimated_budget = scheduling.estimated_budget,
            event_address = scheduling.event_address,
            optional_observations = scheduling.optional_observatios
        )
    )

    db.commit()

    scheduling_infos = db.query(models.ServiceAppointment).filter(
        models.ServiceAppointment.client_id == client.client_id).order_by(
        models.ServiceAppointment.created_at.desc()).first()

    if not scheduling_infos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Agendamento não existente.")

    try:
        pdf = scheduling_pdf.scheduling_pdf(scheduling_infos)

        resend.Emails.send({
            "from": "Acme <onboarding@resend.dev>",
            "to": [config.settings.development_email],
            "subject": "Agendamento de Evento",
            "html": f"<p>Agendamento de evento recebido.",
            "attachments": [
                {
                    "filename": "agendamento.pdf",
                    "content": base64.b64encode(pdf).decode("utf-8")
                }
            ]
        })
    except Exception as e:
        print(e)
        print("Error: Ocorreu um erro ao enviar o PDF!")

    return {"message": "Sucesso! Entraremos em contato em breve."}

@router.get("/history")
def scheduling_history(db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):

    schedulings = db.query(models.ServiceAppointment).filter(
        models.ServiceAppointment.client_id == client.client_id).all()

    if not schedulings:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Nenhum agendamento encontrado.")

    pdf = scheduling_pdf.history_pdf(schedulings)

    return Response(content=pdf, 
                    media_type="application/pdf",
                    headers={
                        "Content-Disposition": "inline. filename=history.pdf"
                    })

@router.get("/profile")
def profile(db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):
    current = db.query(models.Client).filter(models.Client.client_id == client.client_id).first()

    if not current:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Não autorizado.")

    return {"username": current.client_username}

@router.post("/username")
def change_username(credentials: schemas.UpdateAccount, db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):
    current_client = db.query(models.Client).filter(models.Client.client_id == client.client_id)

    current = current_client.first()

    if not current:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Não autorizado.")

    if current.client_username == credentials.new_username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Nome de usuário em uso.")

    current_client.update({"client_username": credentials.new_username})
    db.commit()

    return {"message": "Nome de usuário alterado com sucesso!"}

@router.post("/email")
def email_reset(credentials: schemas.UpdateAccount, db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):
    current_client = db.query(models.Client).filter(models.Client.client_id == client.client_id)

    current = current_client.first()

    if not current:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Não autorizado.")

    if not hashing.verify(credentials.password, current.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Atualização de dados não autorizada.")

    if current.email == credentials.email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="E-Mail em utilização.")
    
    current_client.update({"email": credentials.email})
    db.commit()

    return {"message": "E-Mail atualizado com sucesso!"}

@router.post("/phone")
def phone_reset(credentials: schemas.UpdateAccount, db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):
    current_client = db.query(models.Client).filter(models.Client.client_id == client.client_id)

    current = current_client.first()

    if not current:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Não autorizado.")

    if not hashing.verify(credentials.password, current.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Atualização de dados não autorizada.")

    if current.phone_number == credentials.phone_number:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Número de celular em utilização.")
    
    current_client.update({"phone_number": credentials.phone_number})
    db.commit()

    return {"message": "Número de celular atualizado com sucesso!"}

@router.post("/password")
def password_reset(credentials: schemas.UpdateAccount, db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):
    current_client = db.query(models.Client).filter(models.Client.client_id == client.client_id)

    current = current_client.first()

    if not current:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Não autorizado.")

    if not current.email == credentials.email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Atualização de dados não autorizada.")

    if not hashing.verify(credentials.password, current.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Atualização de dados não autorizada.")

    if hashing.verify(credentials.new_password, current.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Atualização de dados não autorizada.")

    current_client.update({"password": hashing.hash(credentials.new_password)})
    db.commit()

    return {"message": "Senha atualizada com sucesso!"}

@router.post("/delete", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(credentials: schemas.UpdateAccount, db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):
    current_client = db.query(models.Client).filter(models.Client.client_id == client.client_id)

    current = current_client.first()

    if not current:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Não autorizado.")

    if not current.email == credentials.email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Exclusão de conta não autorizada.")

    if not hashing.verify(credentials.password, current.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Exclusão de conta não autorizada.")

    db.delete(current)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    db: Session = Depends(get_db),
    refresh_token = Depends(oauth2.get_refresh_client)
):
    client, token = refresh_token
    
    token = db.query(models.RefreshToken).filter(
                models.RefreshToken.token_id == token.jti,
                models.RefreshToken.revoked == False
            )

    if token.first():
        token.update({"revoked": True})
        db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)