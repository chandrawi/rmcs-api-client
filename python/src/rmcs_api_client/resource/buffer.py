from rmcs_resource_api import buffer_pb2, buffer_pb2_grpc
from typing import Optional, Union, List
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import DataType, pack_data_array, unpack_data_array


class BufferStatus(Enum):
    DEFAULT = 0
    ERROR = 1
    CONVERT = 2
    ANALYZE_GATEWAY = 3
    ANALYZE_SERVER = 4
    TRANSFER_GATEWAY = 5
    TRANSFER_SERVER = 6
    BACKUP = 7
    DELETE = 8

    def from_str(status: str):
        if status == "ERROR": return BufferStatus.ERROR
        elif status == "CONVERT": return BufferStatus.CONVERT
        elif status == "ANALYZE_GATEWAY": return BufferStatus.ANALYZE_GATEWAY
        elif status == "ANALYZE_SERVER": return BufferStatus.ANALYZE_SERVER
        elif status == "TRANSFER_GATEWAY": return BufferStatus.TRANSFER_GATEWAY
        elif status == "TRANSFER_SERVER": return BufferStatus.TRANSFER_SERVER
        elif status == "BACKUP": return BufferStatus.BACKUP
        elif status == "DELETE": return BufferStatus.DELETE
        else: return BufferStatus.DEFAULT

    def to_str(self):
        if self == BufferStatus.ERROR : return "ERROR"
        elif self == BufferStatus.CONVERT : return "CONVERT"
        elif self == BufferStatus.ANALYZE_GATEWAY : return "ANALYZE_GATEWAY"
        elif self == BufferStatus.ANALYZE_SERVER : return "ANALYZE_SERVER"
        elif self == BufferStatus.TRANSFER_GATEWAY : return "TRANSFER_GATEWAY"
        elif self == BufferStatus.TRANSFER_SERVER : return "TRANSFER_SERVER"
        elif self == BufferStatus.BACKUP : return "BACKUP"
        elif self == BufferStatus.DELETE : return "DELETE"
        else: return "DEFAULT"

@dataclass
class BufferSchema:
    id: int
    device_id: UUID
    model_id: UUID
    timestamp: datetime
    index: int
    data: List[Union[bool, int, float, str]]
    status: str

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        types = []
        for ty in r.data_type: types.append(DataType(ty))
        data = unpack_data_array(r.data_bytes, types)
        status = BufferStatus(r.status).to_str()
        return BufferSchema(r.id, UUID(bytes=r.device_id), UUID(bytes=r.model_id), timestamp, r.index, data, status)


def read_buffer(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferId(id=id)
        response = stub.ReadBuffer(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def read_buffer_first(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status
        )
        response = stub.ReadBufferFirst(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def read_buffer_last(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status
        )
        response = stub.ReadBufferLast(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def list_buffer_first(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status,
            number=number
        )
        response = stub.ListBufferFirst(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status,
            number=number
        )
        response = stub.ListBufferLast(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def create_buffer(resource, device_id: UUID, model_id: UUID, timestamp: datetime, index: int, data: List[Union[int, float, str, bool, None]], status: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        data_type = []
        for d in data: data_type.append(DataType.from_value(d).value)
        request = buffer_pb2.BufferSchema(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            index=index,
            data_bytes=pack_data_array(data),
            data_type=data_type,
            status=BufferStatus.from_str(status).value
        )
        response = stub.CreateBuffer(request=request, metadata=resource.metadata)
        return response.id

def update_buffer(resource, id: int, data: Optional[List[Union[int, float, str, bool, None]]], status: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        if data == None: data = list()
        data_type = []
        for d in data: data_type.append(DataType.from_value(d).value)
        stat = None
        if status != None: stat = BufferStatus.from_str(status).value
        request = buffer_pb2.BufferUpdate(
            id=id,
            data_bytes=pack_data_array(data),
            data_type=data_type,
            status=stat
        )
        stub.UpdateBuffer(request=request, metadata=resource.metadata)

def delete_buffer(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferId(id=id)
        stub.DeleteBuffer(request=request, metadata=resource.metadata)
