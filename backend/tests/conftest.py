from fastapi.testclient import TestClient
import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .. import models
from ..oauth2 import create_access_token
from ..database import Base, get_db
from ..config import settings
from ..main import app

SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}_test"

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
                 "phone_number": "123456",
                 "email": "test1@email.com",
                 "password": "A123456#"}
    response = client.post("/register/", json=user_data)

    assert response.status_code == 201
    new_user = response.json()
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