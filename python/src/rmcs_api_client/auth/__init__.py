from datetime import datetime
from uuid import UUID
from typing import Optional, List, Tuple
from . import auth, api, role, user, token
from .auth import UserLogin, UserRefresh
from .api import ApiSchema, ProcedureSchema
from .role import RoleSchema
from .user import UserSchema
from .token import TokenSchema


class Auth:

    def __init__(self, address: str, auth_token: str = None):
        self.address = address
        self.auth_token = auth_token

    def user_login(self, username: str, password: str) -> UserLogin:
        return auth.user_login(self, username, password)

    def user_refresh(self, api_id: UUID, access_token: str, refresh_token: str) -> UserRefresh:
        return auth.user_refresh(self, api_id, access_token, refresh_token)

    def user_logout(self, user_id: UUID, auth_token: str):
        return auth.user_logout(self, user_id, auth_token)

    def read_api(self, id: UUID) -> ApiSchema:
        return api.read_api(self, id)

    def read_api_by_name(self, name: str) -> ApiSchema:
        return api.read_api_by_name(self, name)

    def list_api_by_category(self, category: str) -> List[ApiSchema]:
        return api.list_api_by_category(self, category)

    def create_api(self, name: str, address: str, category: str, description: str, password: str, access_key: bytes) -> UUID:
        return api.create_api(self, name, address, category, description, password, access_key)

    def update_api(self, id: UUID, name: Optional[str]=None, address: Optional[str]=None, category: Optional[str]=None, description: Optional[str]=None, password: Optional[str]=None, access_key: Optional[bytes]=None):
        return api.update_api(self, id, name, address, category, description, password, access_key)

    def delete_api(self, id: UUID):
        return api.delete_api(self, id)

    def read_procedure(self, id: UUID) -> ProcedureSchema:
        return api.read_procedure(self, id)

    def read_procedure_by_name(self, api_id: UUID, name: str) -> ProcedureSchema:
        return api.read_procedure_by_name(self, api_id, name)

    def list_procedure_by_api(self, api_id: UUID) -> List[ProcedureSchema]:
        return api.list_procedure_by_api(self, api_id)

    def create_procedure(self, api_id: UUID, name: str, description: str) -> UUID:
        return api.create_procedure(self, api_id, name, description)

    def update_procedure(self, id: UUID, name: Optional[str], description: Optional[str]):
        return api.update_procedure(self, id, name, description)

    def delete_procedure(self, id: UUID):
        return api.delete_procedure(self, id)

    def read_role(self, id: UUID) -> RoleSchema:
        return role.read_role(self, id)

    def read_role_by_name(self, api_id: UUID, name: str) -> RoleSchema:
        return role.read_role_by_name(self, api_id, name)

    def list_role_by_api(self, api_id: UUID) -> List[RoleSchema]:
        return role.list_role_by_api(self, api_id)
    
    def list_role_by_user(self, user_id: UUID):
        return role.list_role_by_user(self, user_id)

    def create_role(self, api_id: UUID, name: str, multi: bool, ip_lock: bool, access_duration: int, refresh_duration: int) -> UUID:
        return role.create_role(self, api_id, name, multi, ip_lock, access_duration, refresh_duration)

    def update_role(self, id: UUID, name: Optional[str]=None, multi: Optional[bool]=None, ip_lock: Optional[bool]=None, access_duration: Optional[int]=None, refresh_duration: Optional[int]=None):
        return role.update_role(self, id, name, multi, ip_lock, access_duration, refresh_duration)

    def delete_role(self, id: UUID):
        return role.delete_role(self, id)

    def add_role_access(self, id: UUID, procedure_id: UUID):
        return role.add_role_access(self, id, procedure_id)

    def remove_role_access(self, id: UUID, procedure_id: UUID):
        return role.remove_role_access(self, id, procedure_id)

    def read_user(self, id: UUID) -> UserSchema:
        return user.read_user(self, id)

    def read_user_by_name(self, name: str) -> UserSchema:
        return user.read_user_by_name(self, name)

    def list_user_by_role(self, role_id: UUID) -> List[UserSchema]:
        return user.list_user_by_role(self, role_id)

    def create_user(self, name: str, email: str, phone: str, password: str) -> UUID:
        return user.create_user(self, name, email, phone, password)

    def update_user(self, id: UUID, name: Optional[str]=None, email: Optional[str]=None, phone: Optional[str]=None, password: Optional[str]=None):
        return user.update_user(self, id, name, email, phone, password)

    def delete_user(self, id: UUID):
        return user.delete_user(self, id)

    def add_user_role(self, id: UUID, role_id: UUID):
        return user.add_user_role(self, id, role_id)

    def remove_user_role(self, id: UUID, role_id: UUID):
        return user.remove_user_role(self, id, role_id)

    def read_access_token(self, access_id: int) -> TokenSchema:
        return token.read_access_token(self, access_id)

    def list_auth_token(self, auth_token: str) -> List[TokenSchema]:
        return token.list_auth_token(self, auth_token)
    
    def list_token_by_user(self, user_id: UUID) -> List[TokenSchema]:
        return token.list_token_by_user(self, user_id)

    def create_access_token(self, user_id: UUID, auth_token: str, expire: datetime, ip: bytes) -> Tuple[int, str, str]:
        return token.create_access_token(self, user_id, auth_token, expire, ip)

    def create_auth_token(self, user_id: UUID, expire: datetime, ip: bytes, number: int) -> List[Tuple[int, str, str]]:
        return token.create_auth_token(self, user_id, expire, ip, number)

    def update_access_token(self, access_id: int, expire: Optional[datetime]=None, ip: Optional[bytes]=None) -> Tuple[str, str]:
        return token.update_access_token(self, access_id, expire, ip)

    def update_auth_token(self, auth_token: str, expire: Optional[datetime]=None, ip: Optional[bytes]=None) -> Tuple[str, str]:
        return token.update_auth_token(self, auth_token, expire, ip)

    def delete_access_token(self, access_id: int):
        return token.delete_access_token(self, access_id)

    def delete_auth_token(self, auth_token: str):
        return token.delete_auth_token(self, auth_token)
    
    def delete_token_by_user(self, user_id: UUID):
        return token.delete_token_by_user(self, user_id)
