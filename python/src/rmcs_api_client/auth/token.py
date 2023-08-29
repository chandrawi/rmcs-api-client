from rmcs_auth_api import token_pb2, token_pb2_grpc
from typing import Optional
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc


@dataclass
class TokenSchema:
    access_id: int
    user_id: bytes
    refresh_token: str
    auth_token: str
    expire: datetime
    ip: bytes

    def from_response(r):
        return TokenSchema(r.access_id, UUID(bytes=r.user_id), r.refresh_token, r.auth_token, datetime.fromtimestamp(r.expire/1000000.0), r.ip)


def read_access_token(auth, access_id: int):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.AccessId(access_id=access_id)
        response = stub.ReadAccessToken(request)
        return TokenSchema.from_response(response.result)

def list_auth_token(auth, auth_token: str):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.AuthToken(auth_token=auth_token)
        response = stub.ListAuthToken(request)
        ls = []
        for result in response.results: ls.append(TokenSchema.from_response(result))
        return ls

def list_token_by_user(auth, user_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.UserId(user_id=user_id.bytes)
        response = stub.ListTokenByUser(request)
        ls = []
        for result in response.results: ls.append(TokenSchema.from_response(result))
        return ls

def create_access_token(auth, user_id: UUID, auth_token: str, expire: datetime, ip: bytes):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.TokenSchema(
            user_id=user_id.bytes,
            auth_token=auth_token,
            expire=int(expire.timestamp()*1000000),
            ip=ip
        )
        response = stub.CreateAccessToken(request)
        return (response.access_id, response.refresh_token, response.auth_token)

def create_auth_token(auth, user_id: UUID, expire: datetime, ip: bytes, number: int):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.AuthTokenCreate(
            user_id=user_id.bytes,
            number=number,
            expire=int(expire.timestamp()*1000000),
            ip=ip
        )
        response = stub.CreateAuthToken(request)
        tokens = []
        for token in response.tokens: tokens.append((token.access_id, token.refresh_token, token.auth_token))
        return tokens

def update_access_token(auth, access_id: int, expire: Optional[datetime], ip: Optional[bytes]):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.TokenUpdate(
            access_id=access_id,
            expire=int(expire.timestamp()*1000000),
            ip=ip
        )
        response = stub.UpdateAccessToken(request)
        return (response.refresh_token, response.auth_token)

def update_auth_token(auth, auth_token: str, expire: Optional[datetime], ip: Optional[bytes]):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.TokenUpdate(
            auth_token=auth_token,
            expire=int(expire.timestamp()*1000000),
            ip=ip
        )
        response = stub.UpdateAuthToken(request)
        return (response.refresh_token, response.auth_token)

def delete_access_token(auth, access_id: int):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.AccessId(access_id=access_id)
        stub.DeleteAccessToken(request)

def delete_auth_token(auth, auth_token: str):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.AuthToken(auth_token=auth_token)
        stub.DeleteAuthToken(request)

def delete_token_by_user(auth, user_id: UUID):
    with grpc.insecure_channel(auth.address) as channel:
        stub = token_pb2_grpc.TokenServiceStub(channel)
        request = token_pb2.UserId(user_id=user_id.bytes)
        stub.DeleteTokenByUser(request)
