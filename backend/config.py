from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_name: str
    database_port: str
    database_hostname: str
    database_password: str
    database_username: str
    secret_key: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int
    algorithm: str
    recovery_secret_key: str
    recovery_token_expire_minutes: int
    resend_api_key: str
    development_email: str
    domain_email: str

    class Config:
        env_file = ".env"

settings = Settings()
