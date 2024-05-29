from rmcs_resource_api import log_pb2, log_pb2_grpc
from typing import Optional, Union
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import ConfigType, pack_config, unpack_config


def status_to_int(status: Union[int, str]) -> Union[int, None]:
    if type(status) == str:
        if status == "DEFAULT": return 0
        elif status == "SUCCESS": return 1
        elif status == "ERROR_SEND": return 2
        elif status == "ERROR_TRANSFER": return 3
        elif status == "ERROR_ANALYSIS": return 4
        elif status == "ERROR_NETWORK": return 5
        elif status == "FAIL_READ": return 6
        elif status == "FAIL_CREATE": return 7
        elif status == "FAIL_UPDATE": return 8
        elif status == "FAIL_DELETE": return 9
        elif status == "INVALID_TOKEN": return 10
        elif status == "INVALID_REQUEST": return 11
        elif status == "UNKNOWN_ERROR": return 12
        elif status == "UNKNOWN_STATUS": return 13
        else: return None
    elif type(status) == int:
        return status

def int_to_status(code: int) -> Union[str, int]:
        if code == 0: return "DEFAULT"
        elif code == 1: return "SUCCESS"
        elif code == 2: return "ERROR_SEND"
        elif code == 3: return "ERROR_TRANSFER"
        elif code == 4: return "ERROR_ANALYSIS"
        elif code == 5: return "ERROR_NETWORK"
        elif code == 6: return "FAIL_READ"
        elif code == 7: return "FAIL_CREATE"
        elif code == 8: return "FAIL_UPDATE"
        elif code == 9: return "FAIL_DELETE"
        elif code == 10: return "INVALID_TOKEN"
        elif code == 11: return "INVALID_REQUEST"
        elif code == 12: return "UNKNOWN_ERROR"
        elif code == 13: return "UNKNOWN_STATUS"
        else: return code

@dataclass
class LogSchema:
    timestamp: datetime
    device_id: UUID
    status: str
    value: Union[int, float, str]

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        status = int_to_status(r.status)
        value = unpack_config(r.log_bytes, ConfigType(r.log_type))
        return LogSchema(timestamp, UUID(bytes=r.device_id), status, value)


def read_log(resource, timestamp: datetime, device_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogId(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_id.bytes
        )
        response = stub.ReadLog(request=request, metadata=resource.metadata)
        return LogSchema.from_response(response.result)

def list_log_by_time(resource, timestamp: datetime, device_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        stat = None
        if status != None: stat = status_to_int(status)
        request = log_pb2.LogTime(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes,
            status=stat
        )
        response = stub.ListLogByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_last_time(resource, last: datetime, device_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        stat = None
        if status != None: stat = status_to_int(status)
        request = log_pb2.LogTime(
            timestamp=int(last.timestamp()*1000000),
            device_id=device_bytes,
            status=stat
        )
        response = stub.ListLogByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_range_time(resource, begin: datetime, end: datetime, device_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        stat = None
        if status != None: stat = status_to_int(status)
        request = log_pb2.LogRange(
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            device_id=device_bytes,
            status=stat
        )
        response = stub.ListLogByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def create_log(resource, timestamp: datetime, device_id: UUID, status: Union[str, int], value: Union[int, float, str, None]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogSchema(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_id.bytes,
            status=status_to_int(status),
            log_bytes=pack_config(value),
            log_type=ConfigType.from_value(value).value
        )
        stub.CreateLog(request=request, metadata=resource.metadata)

def update_log(resource, timestamp: datetime, device_id: UUID, status: Optional[Union[str, int]]=None, value: Union[int, float, str, None]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        stat = None
        if status != None: stat = status_to_int(status)
        request = log_pb2.LogUpdate(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_id.bytes,
            status=stat,
            log_bytes=pack_config(value),
            log_type=ConfigType.from_value(value).value
        )
        stub.UpdateLog(request=request, metadata=resource.metadata)

def delete_log(resource, timestamp: datetime, device_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogId(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_id.bytes
        )
        stub.DeleteLog(request=request, metadata=resource.metadata)
