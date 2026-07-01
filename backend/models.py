from sqlalchemy import Column, String, ForeignKey, Integer, Float
from sqlalchemy.sql import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from .database import Base

class Client(Base):
    __tablename__ = 'client'

    client_id = Column(Integer, primary_key=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String(14), unique=True, nullable=False)
    client_username = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)

class CompleteServicePack(Base):
    __tablename__ = 'complete_service_pack'

    appointment_id = Column(Integer, primary_key=True, nullable=False)
    complete_name = Column(String, nullable=False)
    cep_number = Column(String(8), nullable=True)
    state_name = Column(String(30), nullable=True)
    city_name = Column(String(30), nullable=True)
    thoroughfare = Column(String, nullable=True)
    thoroughfare_number = Column(String(10), nullable=True)
    extra_locale_info = Column(String(50), nullable=True)
    guests_number = Column(Integer, nullable=True)
    inicial_budget = Column(Float, nullable=True)
    client_owner_id = Column(Integer, ForeignKey('client.client_id', ondelete="CASCADE"), nullable=False)
    owner_phone_number = Column(String(14), ForeignKey('client.phone_number', ondelete="CASCADE"), nullable=False)
