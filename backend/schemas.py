from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: str
    is_active: bool
    avatar_path: Optional[str] = None

    class Config:
        orm_mode = True

class PasswordChange(BaseModel):
    old_password: str
    new_password: str