from rmcs_resource_api import log_pb2, log_pb2_grpc
from typing import Optional, Union, List
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import DataType, pack_data, unpack_data


@dataclass
class LogSchema:
    id: int
    timestamp: datetime
    device_id: Optional[UUID]
    model_id: Optional[UUID]
    tag: int
    value: Union[bool, int, float, str, None]

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        device_id = UUID(bytes=r.device_id) if r.device_id else None
        model_id = UUID(bytes=r.model_id) if r.model_id else None
        value = unpack_data(r.log_bytes, DataType(r.log_type))
        return LogSchema(r.id, timestamp, device_id, model_id, r.tag, value)


def read_log(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogId(id=id)
        response = stub.ReadLog(request=request, metadata=resource.metadata)
        return LogSchema.from_response(response.result)

def read_log_by_time(resource, timestamp: datetime, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogTime(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ReadLogByTime(request=request, metadata=resource.metadata)
        return LogSchema.from_response(response.result)

def list_log(resource, ids: List[int]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogIds(
            ids=ids
        )
        response = stub.ListLog(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_time(resource, timestamp: datetime, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogTime(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_last_time(resource, last: datetime, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogTime(
            timestamp=int(last.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_range_time(resource, begin: datetime, end: datetime, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogRange(
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def create_log(resource, timestamp: datetime, device_id: Optional[UUID], model_id: Optional[UUID], value: Union[int, float, str, None], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogSchema(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            log_bytes=pack_data(value),
            log_type=DataType.from_value(value).value,
            tag=tag
        )
        response = stub.CreateLog(request=request, metadata=resource.metadata)
        return response.id

def update_log(resource, id: int, value: Union[int, float, str, None]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogUpdate(
            id=id,
            log_bytes=pack_data(value),
            log_type=DataType.from_value(value).value,
            tag=tag
        )
        stub.UpdateLog(request=request, metadata=resource.metadata)

def update_log_by_time(resource, timestamp: datetime, device_id: Optional[UUID], model_id: Optional[UUID], value: Union[int, float, str, None]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogUpdateTime(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            log_bytes=pack_data(value),
            log_type=DataType.from_value(value).value,
            tag=tag
        )
        stub.UpdateLogByTime(request=request, metadata=resource.metadata)

def delete_log(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogId(id=id)
        stub.DeleteLog(request=request, metadata=resource.metadata)

def delete_log_by_time(resource, timestamp: datetime, device_id: Optional[UUID], model_id: Optional[UUID], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogTime(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        stub.DeleteLogByTime(request=request, metadata=resource.metadata)
