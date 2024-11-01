from rmcs_auth_api import profile_pb2, profile_pb2_grpc
from typing import Optional, Union, List
from dataclasses import dataclass
from uuid import UUID
import grpc
from ..resource.common import DataType, pack_data, unpack_data


def mode_to_int(mode: Union[int, str, None]) -> int:
    if type(mode) == str:
        if mode == "SINGLE_OPTIONAL": return 0
        elif mode == "SINGLE_REQUIRED": return 1
        elif mode == "MULTIPLE_OPTIONAL": return 2
        elif mode == "MULTIPLE_REQUIRED": return 3
        else: return 0
    elif type(mode) == int and mode > 0 and mode <= 4:
        return mode
    else: return 0

def int_to_mode(code: int) -> str:
        if code == 1: return "SINGLE_REQUIRED"
        elif code == 2: return "MULTIPLE_OPTIONAL"
        elif code == 3: return "MULTIPLE_REQUIRED"
        else: return "SINGLE_OPTIONAL"

@dataclass
class RoleProfileSchema:
    id: int
    role_id: UUID
    name: str
    value_type: DataType
    mode: str

    def from_response(r):
        mode = int_to_mode(r.mode)
        return RoleProfileSchema(r.id, UUID(bytes=r.role_id), r.name, DataType(r.value_type), mode)

@dataclass
class UserProfileSchema:
    id: int
    user_id: UUID
    name: str
    value: List[Union[bool, int, float, str, None]]
    order: int

    def from_response(r):
        value = unpack_data(r.value_bytes, DataType(r.value_type))
        return UserProfileSchema(r.id, UUID(bytes=r.user_id), r.name, value, r.order)


def read_role_profile(auth, id: int) -> RoleProfileSchema:
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.ProfileId(id=id)
        response = stub.ReadRoleProfile(request=request, metadata=auth.metadata)
        return RoleProfileSchema.from_response(response.result)

def list_role_profile_by_role(auth, role_id: UUID) -> List[RoleProfileSchema]:
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.RoleId(id=role_id.bytes)
        response = stub.ListRoleProfile(request=request, metadata=auth.metadata)
        ls = []
        for result in response.results: ls.append(RoleProfileSchema.from_response(result))
        return ls

def create_role_profile(auth, role_id: UUID, name: str, value_type: DataType, mode: Union[str, int]) -> int:
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.RoleProfileSchema(
            role_id=role_id.bytes,
            name=name,
            value_type=value_type.value,
            mode=mode_to_int(mode)
        )
        response = stub.CreateRoleProfile(request=request, metadata=auth.metadata)
        return response.id

def update_role_profile(auth, id: int, name: Optional[str], value_type: Optional[DataType], mode: Optional[Union[str, int]]):
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        ty = None
        if value_type != None: ty = value_type.value
        request = profile_pb2.RoleProfileUpdate(
            id=id,
            name=name,
            value_type=ty,
            mode=mode_to_int(mode)
        )
        stub.UpdateRoleProfile(request=request, metadata=auth.metadata)

def delete_role_profile(auth, id: int):
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.ProfileId(id=id)
        stub.DeleteRoleProfile(request=request, metadata=auth.metadata)

def read_user_profile(auth, id: int) -> UserProfileSchema:
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.ProfileId(id=id)
        response = stub.ReadUserProfile(request=request, metadata=auth.metadata)
        return UserProfileSchema.from_response(response.result)

def list_user_profile_by_user(auth, user_id: UUID) -> List[UserProfileSchema]:
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.UserId(id=user_id.bytes)
        response = stub.ListUserProfile(request=request, metadata=auth.metadata)
        ls = []
        for result in response.results: ls.append(UserProfileSchema.from_response(result))
        return ls

def create_user_profile(auth, user_id: UUID, name: str, value: Union[int, float, str, bool, None]) -> int:
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.UserProfileSchema(
            user_id=user_id.bytes,
            name=name,
            value_bytes=pack_data(value),
            value_type=DataType.from_value(value).value
        )
        response = stub.CreateUserProfile(request=request, metadata=auth.metadata)
        return response.id

def update_user_profile(auth, id: int, name: Optional[str], value: Optional[List[Union[int, float, str, bool, None]]]):
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        value_bytes=None
        value_type=None
        if value != None: 
            value_bytes = pack_data(value)
            value_type = DataType.from_value(value).value
        request = profile_pb2.UserProfileUpdate(
            id=id,
            name=name,
            value_bytes=value_bytes,
            value_type=value_type
        )
        stub.UpdateRoleProfile(request=request, metadata=auth.metadata)

def delete_user_profile(auth, id: int):
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.ProfileId(id=id)
        stub.DeleteUserProfile(request=request, metadata=auth.metadata)

def swap_user_profile(auth, user_id: UUID, name: str, order_1: int, order_2: int):
    with grpc.insecure_channel(auth.address) as channel:
        stub = profile_pb2_grpc.ProfileServiceStub(channel)
        request = profile_pb2.UserProfileSwap(
            user_id=user_id.bytes,
            name=name,
            order_1=order_1,
            order_2=order_2
        )
        stub.SwapUserProfile(request=request, metadata=auth.metadata)
