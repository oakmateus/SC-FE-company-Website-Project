from sqlalchemy import Column, String, ForeignKey, Integer, Numeric, UUID, Boolean, Date
from sqlalchemy.sql import text
from sqlalchemy.dialects.postgresql import ARRAY
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

class ServiceAppointment(Base):
    __tablename__ = 'service_appointments'

    appointment_id = Column(Integer, primary_key=True, nullable=False)
    client_id = Column(Integer, ForeignKey('client.client_id', ondelete="CASCADE"), nullable=False)
    client_username = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    event_types = Column(String, nullable=False)
    custom_event = Column(String(150), nullable=True)
    service_types = Column(ARRAY(String), nullable=False)
    custom_service = Column(String(300), nullable=True)
    optional_kitchens = Column(ARRAY(String), nullable=False, default=list)
    estimated_event_date = Column(Date, nullable=False)
    estimated_guests_quantity = Column(Integer, nullable=True)
    estimated_budget = Column(Numeric(10, 2), nullable=False)
    event_address = Column(String(300), nullable=False)
    optional_observations = Column(String(1000), nullable=True)

class RecoveryCode(Base):
    __tablename__ = 'recovery_code'

    code_id = Column(Integer, primary_key=True, nullable=False)
    client_id = Column(Integer, ForeignKey('client.client_id', ondelete="CASCADE"), nullable=False, unique=True)
    recovery_code = Column(String, nullable=False)
    code_created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    code_expires_at = Column(TIMESTAMP(timezone=True), nullable=False)

class RefreshToken(Base):
    __tablename__ = 'refresh_token'

    token_id = Column(UUID, primary_key=True, nullable=False)
    client_id = Column(Integer, ForeignKey('client.client_id', ondelete="CASCADE"), nullable=False)
    revoked = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    expires_at = Column(TIMESTAMP(timezone=True), nullable=False)