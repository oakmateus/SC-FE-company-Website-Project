from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import oauth2, schemas, models, config
from ..services import scheduling_pdf
from ..validations import scheduling_validations
from datetime import date

import base64

import resend
resend.api_key = config.settings.resend_api_key

router = APIRouter(
    prefix="/users/me",
    tags=["Authenticated Homepage Dashboard"]
)

@router.get("/")
def current_client(client = Depends(oauth2.get_current_client)):
    return client

@router.post("/scheduling")
def current_client(scheduling: schemas.Scheduling, db: Session = Depends(get_db), client = Depends(oauth2.get_current_client)):

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