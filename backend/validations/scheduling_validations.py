from fastapi import HTTPException, status
from datetime import date

def string_validations(text: str | None, max_lenght: int):
    if text is not None and len(text) > max_lenght:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Tamanho de texto excedido."
        )

def fieds_colision_treatment(scheduling):

    if (
        not scheduling.event_types
        and not scheduling.custom_event
    ) or (
        scheduling.event_types
        and scheduling.custom_event
    ):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="Insira o tipo do evento ou personalize.")

    if (
        not scheduling.service_types 
        and not scheduling.custom_service
    ) or (
        scheduling.service_types
        and scheduling.custom_service
    ):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                            detail="Insira os serviços desejados ou personalize.")
    return

def empty_fields_and_expired_date(scheduling):

    if not scheduling.event_address:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                                detail="Informe um endereço.")

    if not scheduling.estimated_date:
         raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                             detail="Informe uma data compatível.")

    if date.today() > scheduling.estimated_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Informe uma data compatível."
        )
    
    return