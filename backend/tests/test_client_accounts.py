import pytest
from jose import jwt
from .. import schemas
from ..config import settings

# Testing Create Client Account

def testing_create_client_account(client):
    response = client.post("/register/", 
                json={"client_username": "Name Test", "phone_number": "123456",
                      "email": "test@email.com", "password": "A1234567#"})
    
    new_user = schemas.ClientRegisterOut(**response.json())
    assert new_user.email == "test@email.com"
    assert response.status_code == 201

# Testing User Login and Token Creation

def testing_login_client_account(test_client, client):
    response = client.post(
        "/login", data={"username": test_client['email'], 
                        "password": test_client['password']}
    )

    login_response = schemas.Token(**response.json())

    payload = jwt.decode(login_response.access_token, 
                         settings.secret_key, 
                         algorithms=[settings.algorithm])
    
    id = payload.get("client_id")

    assert id == test_client['client_id']
    assert login_response.token_type == 'bearer'
    assert response.status_code == 200

# Testing Client Username Fields Exceptions

@pytest.mark.parametrize("username, phone_number, email, password, status_code", [
    ('Other Test1', '123456', 'test1@email.com', 'A123456#', 422),
    ('Other Test#', '123456', 'test1@email.com', 'A123456#', 422),
    ('a' * 51, '123456', 'test1@email.com', 'A123456#', 422)
])
def testing_incorrect_email_register(client, username, phone_number, email, password, status_code):
    response = client.post("/register/", 
                json={"client_username": username, "phone_number": phone_number,
                      "email": email, "password": password})

    assert response.status_code == status_code

# Testing Password Fields Exceptions

@pytest.mark.parametrize("username, phone_number, email, password, status_code", [
    ('Other Test', '123456', 'test1@email.com', 'A123#', 422),
    ('Other Test', '123456', 'test1@email.com', 'Abcdefg#', 422),
    ('Other Test', '123456', 'test1@email.com', '123456#', 422),
    ('Other Test', '123456', 'test1@email.com', '123456#', 422)
])
def testing_incorrect_password_register_credentials(client, username, phone_number, email, password, status_code):
    response = client.post("/register/", 
                json={"client_username": username, "phone_number": phone_number,
                      "email": email, "password": password})

    assert response.status_code == status_code

# Testing Empty Required Credentials

@pytest.mark.parametrize("username, phone_number, email, password, status_code", [
    (None, '123456', 'test1@email.com', 'A123456#', 422),
    ('Other Test', None, 'test1@email.com', 'A123456#', 422),
    ('Other Test', '123456', None, 'A123456#', 422),
    ('Other Test', '123456', 'test1@email.com', None, 422)
])
def testing_empty_register_credentials(client, username, phone_number, email, password, status_code):
    response = client.post("/register/", 
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
        "/login",data={"username": email, 
                       "password": password}
    )

    assert response.status_code == status_code