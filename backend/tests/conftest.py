from datetime import date, datetime, UTC, timedelta
from unittest.mock import patch

import pytest

from fastapi.testclient import TestClient

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from jose import jwt

from .. import models
from ..config import settings
from ..database import Base, get_db
from ..main import app
from ..oauth2 import create_access_token

SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@localhost:{settings.database_port}/{settings.database_name}_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture()
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture()
def client(session):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
            
    app.dependency_overrides[get_db] = override_get_db

    yield TestClient(app)

@pytest.fixture
def test_client(client):
    user_data = {"client_username": "Example Test", 
                 "phone_number": "+5521970871876",
                 "email": "test1@email.com",
                 "password": "A123456#"}
    response = client.post("/register", json=user_data)

    assert response.status_code == 201
    new_user = response.json()

    new_user["client_username"] = user_data["client_username"]
    new_user['password'] = user_data['password']

    return new_user

@pytest.fixture
def token(test_client):
    return create_access_token({"client_id": test_client['client_id']})

@pytest.fixture
def authorized_client(client, token):
    
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    
    return client

@pytest.fixture
def refresh_token(test_client, client):
    response = client.post(
        "/login",
        json={
            "email": test_client["email"],
            "password": test_client["password"],
            "remember_me": True
        }
    )

    assert response.status_code == 200

    return response.json()["refresh_token"]

@pytest.fixture
def revoked_refresh_token(refresh_token, session):
    payload = jwt.decode(
        refresh_token,
        settings.secret_key,
        algorithms=[settings.algorithm]
    )

    token = session.query(models.RefreshToken).filter(
        models.RefreshToken.token_id == payload["jti"]
    ).first()

    token.revoked = True
    session.commit()

    return refresh_token

@pytest.fixture
def expired_refresh_token(refresh_token, session):
    payload = jwt.decode(
        refresh_token,
        settings.secret_key,
        algorithms=[settings.algorithm]
    )

    token = session.query(models.RefreshToken).filter(
        models.RefreshToken.token_id == payload["jti"]
    ).first()

    token.expires_at = datetime.now(UTC) - timedelta(minutes=1)
    session.commit()

    return refresh_token

@pytest.fixture
def valid_scheduling_data():
    return {
        "event_types": "Casamento",
        "custom_event": None,
        "service_types": ["Buffet"],
        "custom_service": None,
        "optional_kitchens": ["Brasileira"],
        "estimated_date": (
            date.today() + timedelta(days=30)
        ).isoformat(),
        "event_address": "Rua Teste, 123",
        "estimated_gests_quantity": 100,
        "estimated_budget": "5000.00",
        "optional_observatios": None,
    }


@pytest.fixture
def mock_resend():
    with patch(
        "backend.routers.authenticated_homepage.resend.Emails.send"
    ) as mock_send:
        yield mock_send