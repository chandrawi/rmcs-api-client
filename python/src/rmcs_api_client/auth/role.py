from rmcs_auth_api import role_pb2, role_pb2_grpc
from typing import Optional
from dataclasses import dataclass
from uuid import UUID
import grpc


@dataclass
class RoleSchema:
    id: UUID
    api_id: UUID
    name: str
    multi: bool
    ip_lock: bool
    access_duration: int
    refresh_duration: int
    access_key: bytes
    procedures: list[UUID]

    def from_response(r):
        procedures = []
        for p in r.procedures: procedures.append(UUID(bytes=p))
        return RoleSchema(UUID(bytes=r.id), UUID(bytes=r.api_id), r.name, r.multi, r.ip_lock, r.access_duration, r.refresh_duration, r.access_key, procedures)


def read_role(auth, id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.RoleId(id=id.bytes)
        response = stub.ReadRole(request)
        return RoleSchema.from_response(response.result)

def read_role_by_name(auth, api_id: UUID, name: str):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.RoleName(api_id=api_id.bytes, name=name)
        response = stub.ReadRoleByName(request)
        return RoleSchema.from_response(response.result)

def list_role_by_api(auth, api_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.ApiId(api_id=api_id.bytes)
        response = stub.ListRoleByApi(request)
        ls = []
        for result in response.results: ls.append(RoleSchema.from_response(result))
        return ls

def list_role_by_user(auth, user_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.UserId(id=user_id.bytes)
        response = stub.ListRoleByUser(request)
        ls = []
        for result in response.results: ls.append(RoleSchema.from_response(result))
        return ls

def create_role(auth, api_id: UUID, name: str, multi: bool, ip_lock: bool, access_duration: int, refresh_duration: int):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.RoleSchema(
            api_id=api_id.bytes,
            name=name,
            multi=multi,
            ip_lock=ip_lock,
            access_duration=access_duration,
            refresh_duration=refresh_duration
        )
        response = stub.CreateRole(request)
        return UUID(bytes=response.id)

def update_role(auth, id: UUID, name: Optional[str], multi: Optional[bool], ip_lock: Optional[bool], access_duration: Optional[int], refresh_duration: Optional[int]):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.RoleUpdate(
            id=id.bytes,
            name=name,
            multi=multi,
            ip_lock=ip_lock,
            access_duration=access_duration,
            refresh_duration=refresh_duration
        )
        stub.UpdateRole(request)

def delete_role(auth, id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.RoleId(id=id.bytes)
        stub.DeleteRole(request)

def add_role_access(auth, id: UUID, procedure_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.RoleAccess(id=id.bytes, procedure_id=procedure_id.bytes)
        stub.AddRoleAccess(request)

def remove_role_access(auth, id: UUID, procedure_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = role_pb2_grpc.RoleServiceStub(channel)
        request = role_pb2.RoleAccess(id=id.bytes, procedure_id=procedure_id.bytes)
        stub.RemoveRoleAccess(request)
