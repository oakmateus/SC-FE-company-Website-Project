import pytest

# Testing access authenticated homepage

def test_auth_homepage(authorized_client, test_client):
    response = authorized_client.get("/users/me/")

    assert response.status_code == 200

    data = response.json()

    assert data["client_id"] == test_client["client_id"]
    assert data["email"] == test_client["email"]
    assert data["client_username"] == test_client["client_username"]


def test_auth_homepage_unauthorized(client):
    response = client.get("/users/me/")

    assert response.status_code == 401

# Testing scheduling and Resend service

@pytest.mark.parametrize(
    "field,max_length",
    [
        ("custom_event", 150),
        ("custom_service", 300),
        ("event_address", 300),
        ("optional_observatios", 1000),
    ],
)
def test_scheduling_string_at_limit(
    authorized_client,
    valid_scheduling_data,
    field,
    max_length,
    mock_resend,
):
    data = valid_scheduling_data.copy()

    if field == "custom_event":
        data.pop("event_types", None)

    elif field == "custom_service":
        data.pop("service_types", None)

    data[field] = "A" * max_length

    response = authorized_client.post(
        "/users/me/scheduling",
        json=data,
    )

    assert response.status_code == 200

@pytest.mark.parametrize(
    "field,max_length",
    [
        ("custom_event", 150),
        ("custom_service", 300),
        ("event_address", 300),
        ("optional_observatios", 1000),
    ],
)

def test_scheduling_string_above_limit(
    authorized_client,
    valid_scheduling_data,
    field,
    max_length,
    mock_resend,
):
    data = valid_scheduling_data.copy()

    if field == "custom_event":
        data["event_types"] = None

    elif field == "custom_service":
        data["service_types"] = None

    data[field] = "A" * (max_length + 1)

    response = authorized_client.post(
        "/users/me/scheduling",
        json=data,
    )

    assert response.status_code == 422

# Testing access profile page

def test_profile(authorized_client, test_client):
    response = authorized_client.get("/users/me/profile")

    assert response.status_code == 200
    assert response.json()["username"] == test_client["client_username"]


def test_profile_unauthorized(client):
    response = client.get("/users/me/profile")

    assert response.status_code == 401


# Testing change username

def test_change_username(authorized_client):
    response = authorized_client.post(
        "/users/me/username",
        json={"new_username": "New Test Username"}
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Nome de usuário alterado com sucesso!"


def test_change_username_same_username(authorized_client, test_client):
    response = authorized_client.post(
        "/users/me/username",
        json={"new_username": test_client["client_username"]}
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Nome de usuário em uso."


def test_change_username_unauthorized(client):
    response = client.post(
        "/users/me/username",
        json={"new_username": "New Username"}
    )

    assert response.status_code == 401


# Testing change email

def test_change_email(authorized_client, test_client):
    response = authorized_client.post(
        "/users/me/email",
        json={
            "email": "newemail@email.com",
            "password": test_client["password"]
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "E-Mail atualizado com sucesso!"


@pytest.mark.parametrize("email, password, status_code", [
    ("newemail@email.com", "WrongPassword123#", 401),
    ("test1@email.com", "A123456#", 401),
])
def test_invalid_email_change(
    authorized_client,
    email,
    password,
    status_code
):
    response = authorized_client.post(
        "/users/me/email",
        json={
            "email": email,
            "password": password
        }
    )

    assert response.status_code == status_code


def test_change_email_unauthorized(client):
    response = client.post(
        "/users/me/email",
        json={
            "email": "newemail@email.com",
            "password": "A123456#"
        }
    )

    assert response.status_code == 401


# Testing change phone number

def test_change_phone(authorized_client, test_client):
    response = authorized_client.post(
        "/users/me/phone",
        json={
            "phone_number": "+5521999999999",
            "password": test_client["password"]
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Número de celular atualizado com sucesso!"


@pytest.mark.parametrize("phone_number, password", [
    ("+5521999999999", "WrongPassword123#"),
])
def test_invalid_phone_change(
    authorized_client,
    test_client,
    phone_number,
    password
):
    response = authorized_client.post(
        "/users/me/phone",
        json={
            "phone_number": phone_number,
            "password": password
        }
    )

    assert response.status_code == 401


def test_change_phone_same_phone(authorized_client, test_client):
    response = authorized_client.post(
        "/users/me/phone",
        json={
            "phone_number": test_client["phone_number"],
            "password": test_client["password"]
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Número de celular em utilização."


def test_change_phone_unauthorized(client):
    response = client.post(
        "/users/me/phone",
        json={
            "phone_number": "+5521999999999",
            "password": "A123456#"
        }
    )

    assert response.status_code == 401


# Testing change password

def test_change_password(authorized_client, test_client):
    response = authorized_client.post(
        "/users/me/password",
        json={
            "email": test_client["email"],
            "password": test_client["password"],
            "new_password": "NewPassword123#"
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Senha atualizada com sucesso!"


@pytest.mark.parametrize("email, password, new_password", [
    ("wrong@email.com", "A123456#", "NewPassword123#"),
    ("test1@email.com", "WrongPassword123#", "NewPassword123#"),
])
def test_invalid_password_change(
    authorized_client,
    email,
    password,
    new_password
):
    response = authorized_client.post(
        "/users/me/password",
        json={
            "email": email,
            "password": password,
            "new_password": new_password
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Atualização de dados não autorizada."


def test_change_password_same_password(authorized_client, test_client):
    response = authorized_client.post(
        "/users/me/password",
        json={
            "email": test_client["email"],
            "password": test_client["password"],
            "new_password": test_client["password"]
        }
    )

    assert response.status_code == 401


def test_change_password_unauthorized(client, test_client):
    response = client.post(
        "/users/me/password",
        json={
            "email": test_client["email"],
            "password": test_client["password"],
            "new_password": "NewPassword123#"
        }
    )

    assert response.status_code == 401


# Testing scheduling history

def test_history_empty(authorized_client):
    response = authorized_client.get("/users/me/history")

    assert response.status_code == 404
    assert response.json()["detail"] == "Nenhum agendamento encontrado."


def test_history_unauthorized(client):
    response = client.get("/users/me/history")

    assert response.status_code == 401


# Testing delete account

def test_delete_account(authorized_client, test_client):
    response = authorized_client.post(
        "/users/me/delete",
        json={
            "email": test_client["email"],
            "password": test_client["password"]
        }
    )

    assert response.status_code == 204
    assert response.content == b""


@pytest.mark.parametrize("email, password", [
    ("wrong@email.com", "A123456#"),
    ("test1@email.com", "WrongPassword123#"),
])
def test_invalid_delete_account(
    authorized_client,
    email,
    password
):
    response = authorized_client.post(
        "/users/me/delete",
        json={
            "email": email,
            "password": password
        }
    )

    assert response.status_code == 401


def test_delete_account_unauthorized(client, test_client):
    response = client.post(
        "/users/me/delete",
        json={
            "email": test_client["email"],
            "password": test_client["password"]
        }
    )

    assert response.status_code == 401