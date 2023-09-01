from rmcs_auth_api import user_pb2, user_pb2_grpc
from typing import Optional, List
from dataclasses import dataclass
from uuid import UUID
import grpc


@dataclass
class UserRoleSchema:
    api_id: UUID
    role: str
    multi: bool
    ip_lock: bool
    access_duration: int
    refresh_duration: int
    access_key: bytes

    def from_response(r):
        return UserRoleSchema(UUID(bytes=r.api_id), r.role, r.multi, r.ip_lock, r.access_duration, r.refresh_duration, r.access_key)


@dataclass
class UserSchema:
    id: bytes
    name: str
    email: str
    phone: str
    password: str
    roles: List[UserRoleSchema]

    def from_response(r):
        user_roles = []
        for p in r.roles: user_roles.append(UserRoleSchema.from_response(p))
        return UserSchema(UUID(bytes=r.id), r.name, r.email, r.phone, r.password, user_roles)


def read_user(auth, id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.UserId(id=id.bytes)
        response = stub.ReadUser(request=request, metadata=auth.metadata)
        return UserSchema.from_response(response.result)

def read_user_by_name(auth, name: str):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.UserName(name=name)
        response = stub.ReadUserByName(request=request, metadata=auth.metadata)
        return UserSchema.from_response(response.result)

def list_user_by_role(auth, role_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.RoleId(id=role_id.bytes)
        response = stub.ListUserByRole(request=request, metadata=auth.metadata)
        ls = []
        for result in response.results: ls.append(UserSchema.from_response(result))
        return ls

def create_user(auth, name: str, email: str, phone: str, password: str):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.UserSchema(
            name=name,
            email=email,
            phone=phone,
            password=password
        )
        response = stub.CreateUser(request=request, metadata=auth.metadata)
        return UUID(bytes=response.id)

def update_user(auth, id: UUID, name: Optional[str], email: Optional[str], phone: Optional[str], password: Optional[str]):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.UserUpdate(
            id=id.bytes,
            name=name,
            email=email,
            phone=phone,
            password=password
        )
        stub.UpdateUser(request=request, metadata=auth.metadata)

def delete_user(auth, id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.UserId(id=id.bytes)
        stub.DeleteUser(request=request, metadata=auth.metadata)

def add_user_role(auth, id: UUID, role_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.UserRole(user_id=id.bytes, role_id=role_id.bytes)
        stub.AddUserRole(request=request, metadata=auth.metadata)

def remove_user_role(auth, id: UUID, role_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        request = user_pb2.UserRole(user_id=id.bytes, role_id=role_id.bytes)
        stub.RemoveUserRole(request=request, metadata=auth.metadata)
