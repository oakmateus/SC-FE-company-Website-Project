from io import BytesIO

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak
)
from reportlab.lib.enums import TA_CENTER

pdfmetrics.registerFont(
    TTFont(
        "Merriweather-Bold",
        "backend/assets/fonts/Merriweather_24pt-Bold.ttf"
    )
)

def build_story(scheduling):

    title_style = ParagraphStyle(
        "Title",
        fontName="Merriweather-Bold",
        fontSize=20,
        leading=25,
        textColor=HexColor("#421507"),
        alignment=TA_CENTER,
        spaceAfter=3*mm
    )

    subtitle_style = ParagraphStyle(
        "Sub-Title",
        fontName="Merriweather-Bold",
        fontSize=15,
        leading=20,
        textColor=HexColor("#421507"),
        alignment=TA_CENTER,
        spaceAfter=4*mm
    )

    body_style = ParagraphStyle(
        "Body",
        fontName="Times-Roman",
        fontSize=11,
        leading=15,
        textColor=HexColor("#421507"),
        spaceAfter=3*mm
    )

    list_style = ParagraphStyle(
        "List",
        parent=body_style,
        leftIndent=5*mm,
        spaceAfter=2*mm
    )

    story = []

    story.append(
        Paragraph(
            "Agendamento de Evento",
            title_style
        )
    )

    story.append(
        Paragraph(
            f"Solicitado em: {scheduling.created_at.strftime('%d/%m/%Y %H:%M')}",
            subtitle_style
        )
    )

    story.append(
        Paragraph(
            f"ID do Agendamento: #{scheduling.appointment_id}",
            body_style
        )
    )

    story.append(
        Paragraph(
            f"Cliente: {scheduling.client_username}",
            body_style
        )
    )

    story.append(
        Paragraph(
            f"Celular: {scheduling.phone_number}",
            body_style
        )
    )

    if scheduling.event_types:
        story.append(
            Paragraph(
                f"Tipo de Evento: {scheduling.event_types}",
                body_style
            )
        )

    if scheduling.custom_event:
        story.append(
            Paragraph(
                "Evento Customizado:",
                body_style
            )
        )

        story.append(
            Paragraph(
                f"{scheduling.custom_event}",
                body_style
            )
        )

    if scheduling.service_types:
        story.append(
            Paragraph(
                "Serviço(s) Solicitado(s):",
                body_style
            )
        )

        for service in scheduling.service_types:
            story.append(
                Paragraph(
                    f"• {service}",
                    list_style
                )
            )

        story.append(Spacer(1, 3 * mm))

    if scheduling.custom_service:
        story.append(
            Paragraph(
                "Serviço Personalizado:",
                body_style
            )
        )

        story.append(
            Paragraph(
                f"{scheduling.custom_service}",
                body_style
            )
        )

    if scheduling.optional_kitchens:
        story.append(
            Paragraph(
                "Cozinha(s) Solicitada(s):",
                body_style
            )
        )

        for kitchens in scheduling.optional_kitchens:
            story.append(
                Paragraph(
                    f"• {kitchens}",
                    list_style
                )
            )

        story.append(Spacer(1, 3 * mm))

    story.append(
        Paragraph(
            f"Data Estimada Para o Evento: {scheduling.estimated_event_date.strftime('%d/%m/%Y')}",
            body_style
        )
    )

    if scheduling.estimated_guests_quantity:
        story.append(
            Paragraph(
                f"Quantidade Estimada de Convidados: {scheduling.estimated_guests_quantity}",
                body_style
            )
        )

    story.append(
        Paragraph(
            f"Orçamento Estimado: R${scheduling.estimated_budget:.2f}",
            body_style
        )
    )

    story.append(
        Paragraph(
            "Endereço do Evento:",
            body_style
        )
    )
    
    story.append(
        Paragraph(
            f"{scheduling.event_address}",
            body_style
        )
    )

    story.append(
        Paragraph(
            "Observações Opcionais:",
            body_style
        )
    )

    if scheduling.optional_observations:
        story.append(
            Paragraph(
                f"{scheduling.optional_observations}",
                body_style
            )
        )

    return story

def scheduling_pdf(scheduling):

    content_buffer = BytesIO()
    width, height = A4

    doc = SimpleDocTemplate(
        content_buffer,
        pagesize=A4,
        leftMargin=25*mm,
        rightMargin=25*mm,
        topMargin=28*mm,
        bottomMargin=25*mm
    )

    story = build_story(scheduling)

    doc.build(story)

    return finalize_pdf(content_buffer)

def history_pdf(schedulings):

    content_buffer = BytesIO()
    width, height = A4

    doc = SimpleDocTemplate(
        content_buffer,
        pagesize=A4,
        leftMargin=25*mm,
        rightMargin=25*mm,
        topMargin=28*mm,
        bottomMargin=25*mm
    )

    story = []

    for scheduling in schedulings:
        story.extend(build_story(scheduling))
        story.append(PageBreak())

    doc.build(story)

    return finalize_pdf(content_buffer)

def finalize_pdf(content_buffer):

    content_buffer.seek(0)

    content = PdfReader(content_buffer)
    writer = PdfWriter()

    for page in content.pages:

        with open("backend/assets/letterhead.pdf", "rb") as file:
            letterhead = PdfReader(file)
            background_page = letterhead.pages[0]

            background_page.merge_page(page)

            writer.add_page(background_page)

    output = BytesIO()
    writer.write(output)

    return output.getvalue()