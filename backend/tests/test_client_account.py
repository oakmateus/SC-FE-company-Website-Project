import pytest
from jose import jwt
from .. import schemas
from ..config import settings

# Testing Create Client Account

def test_create_client_account(client):

    new_user = {
        "client_username": "Name Test",
        "email": "test@email.com",
        "phone_number": "+5521970871876",
        "password": "A1234567#"
    }

    response = client.post("/register", json=new_user)

    register = schemas.ClientRegisterOut(**response.json())

    assert response.status_code == 201
    assert register.email == new_user["email"]
    assert register.phone_number == new_user["phone_number"]
    assert register.client_id is not None
    assert register.created_at is not None

# Testing User Login and Token Creation

def testing_login_client_account(test_client, client):
    response = client.post(
        "/login", 
        json={
            "email": test_client['email'], 
            "password": test_client['password']
        }
    )

    assert response.status_code == 200

    login_response = schemas.Token(**response.json())

    payload = jwt.decode(
        login_response.access_token, 
        settings.secret_key, 
        algorithms=[settings.algorithm]
    )
    
    client_id = payload.get("client_id")

    assert client_id == test_client['client_id']
    assert login_response.token_type == 'bearer'
    assert login_response.access_token

def test_login_client_account_remember_me(test_client, client):
    response = client.post(
        "/login",
        json={
            "email": test_client["email"],
            "password": test_client["password"],
            "remember_me": True
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["access_token"]
    assert data["refresh_token"]
    assert data["token_type"] == "bearer"

    access_payload = jwt.decode(
        data["access_token"],
        settings.secret_key,
        algorithms=[settings.algorithm]
    )

    refresh_payload = jwt.decode(
        data["refresh_token"],
        settings.secret_key,
        algorithms=[settings.algorithm]
    )

    assert access_payload["client_id"] == test_client["client_id"]
    assert access_payload["scope"] == "access"

    assert refresh_payload["client_id"] == test_client["client_id"]
    assert refresh_payload["scope"] == "refresh"
    assert refresh_payload["type"] == "refresh"
    assert refresh_payload["jti"]

# Testing Client Username Fields Exceptions

@pytest.mark.parametrize("username, email, phone_number, password, status_code", [
    ('Other Test1', 'test1@email.com', '+5512345678912', 'A123456#', 422),
    ('Other Test#', 'test1@email.com', '+5512345678912', 'A123456#', 422),
    ('a' * 51, 'test1@email.com', '+5512345678912', 'A123456#', 422)
])
def testing_incorrect_email_register(client, username, phone_number, email, password, status_code):
    response = client.post("/register", 
                json={"client_username": username, "phone_number": phone_number,
                      "email": email, "password": password})

    assert response.status_code == status_code

# Testing Password Fields Exceptions

@pytest.mark.parametrize("username, email, phone_number, password, status_code", [
    ('Other Test', 'test1@email.com', '+5512345678912', 'A123#', 422),
    ('Other Test', 'test1@email.com', '+5512345678912', 'Abcdefg#', 422),
    ('Other Test', 'test1@email.com', '+5512345678912', '123456#', 422),
    ('Other Test', 'test1@email.com', '+5512345678912', '123456#', 422)
])
def testing_incorrect_password_register_credentials(client, username, phone_number, email, password, status_code):
    response = client.post("/register", 
                json={"client_username": username, "phone_number": phone_number,
                      "email": email, "password": password})

    assert response.status_code == status_code

# Testing Empty Required Credentials

@pytest.mark.parametrize("username, phone_number, email, password, status_code", [
    (None, 'test1@email.com', '+5512345678912', 'A123456#', 422),
    ('Other Test', None, '+5512345678912', 'A123456#', 422),
    ('Other Test', 'test1@email.com', None, 'A123456#', 422),
    ('Other Test', 'test1@email.com', '+5512345678912', None, 422)
])
def testing_empty_register_credentials(client, username, phone_number, email, password, status_code):
    response = client.post("/register", 
                json={"client_username": username, "phone_number": phone_number,
                      "email": email, "password": password})

    assert response.status_code == status_code

# Login Exceptions Tests

@pytest.mark.parametrize("email, password, status_code", [
    ('wrongemail@email.com', 'A123456#', 401),
    ('test1@email.com', 'WrongPassword', 401),
    ('wrongemail@email.com', 'WrongPassword', 401),
    (None, '#123456A', 422),
    ('test1@email.com', None, 422)
])
def testing_incorrect_login(client, email, password, status_code):
    response = client.post(
        "/login", json={"email": email, 
                       "password": password}
    )

    assert response.status_code == status_code

# Testing refresh token

def test_refresh_token(client, refresh_token, test_client):

    response = client.post(
        "/login/refresh",
        headers={
            "Authorization": f"Bearer {refresh_token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["access_token"]
    assert data["token_type"] == "bearer"

    payload = jwt.decode(
        data["access_token"],
        settings.secret_key,
        algorithms=[settings.algorithm]
    )

    assert payload["client_id"] == test_client["client_id"]
    assert payload["scope"] == "access"

@pytest.mark.parametrize(
    "fixture_name",
    ["revoked_refresh_token", 
     "expired_refresh_token",]
)
def test_invalid_refresh_token(request, client, fixture_name):
    refresh_token = request.getfixturevalue(fixture_name)

    response = client.post(
        "/login/refresh",
        headers={
            "Authorization": f"Bearer {refresh_token}"
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciais não atorizadas"

def test_refresh_token_without_token(client):

    response = client.post("/login/refresh")

    assert response.status_code == 401

def test_refresh_token_invalid_token(client):

    response = client.post(
        "/login/refresh",
        headers={
            "Authorization": "Bearer invalid-token"
        }
    )

    assert response.status_code == 401