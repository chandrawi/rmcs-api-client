from rmcs_resource_api import log_pb2, log_pb2_grpc
from typing import Optional, Union
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import ConfigType, pack_config, unpack_config


class LogStatus(Enum):
    DEFAULT = 0
    SUCCESS = 1
    ERROR_RAW = 2
    ERROR_MISSING = 3
    ERROR_CONVERSION = 4
    ERROR_ANALYZE = 5
    ERROR_NETWORK = 6
    FAIL_READ = 7
    FAIL_CREATE = 8
    FAIL_UPDATE = 9
    FAIL_DELETE = 10
    INVALID_TOKEN = 11
    INVALID_REQUEST = 12
    NOT_FOUND = 13
    METHOD_NOT_ALLOWED = 14
    UNKNOWN_ERROR = 15
    UNKNOWN_STATUS = 16

    def from_str(status: str):
        if status == "SUCCESS": return LogStatus.SUCCESS
        elif status == "ERROR_RAW": return LogStatus.ERROR_RAW
        elif status == "ERROR_MISSING": return LogStatus.ERROR_MISSING
        elif status == "ERROR_CONVERSION": return LogStatus.ERROR_CONVERSION
        elif status == "ERROR_ANALYZE": return LogStatus.ERROR_ANALYZE
        elif status == "ERROR_NETWORK": return LogStatus.ERROR_NETWORK
        elif status == "FAIL_READ": return LogStatus.FAIL_READ
        elif status == "FAIL_CREATE": return LogStatus.FAIL_CREATE
        elif status == "FAIL_UPDATE": return LogStatus.FAIL_UPDATE
        elif status == "FAIL_DELETE": return LogStatus.FAIL_DELETE
        elif status == "INVALID_TOKEN": return LogStatus.INVALID_TOKEN
        elif status == "INVALID_REQUEST": return LogStatus.INVALID_REQUEST
        elif status == "NOT_FOUND": return LogStatus.NOT_FOUND
        elif status == "METHOD_NOT_ALLOWED": return LogStatus.METHOD_NOT_ALLOWED
        elif status == "UNKNOWN_ERROR": return LogStatus.UNKNOWN_ERROR
        elif status == "UNKNOWN_STATUS": return LogStatus.UNKNOWN_STATUS
        else: return LogStatus.DEFAULT

    def to_str(self):
        if self == LogStatus.SUCCESS: return "SUCCESS"
        elif self == LogStatus.ERROR_RAW: return "ERROR_RAW"
        elif self == LogStatus.ERROR_MISSING: return "ERROR_MISSING"
        elif self == LogStatus.ERROR_CONVERSION: return "ERROR_CONVERSION"
        elif self == LogStatus.ERROR_ANALYZE: return "ERROR_ANALYZE"
        elif self == LogStatus.ERROR_NETWORK: return "ERROR_NETWORK"
        elif self == LogStatus.FAIL_READ: return "FAIL_READ"
        elif self == LogStatus.FAIL_CREATE: return "FAIL_CREATE"
        elif self == LogStatus.FAIL_UPDATE: return "FAIL_UPDATE"
        elif self == LogStatus.FAIL_DELETE: return "FAIL_DELETE"
        elif self == LogStatus.INVALID_TOKEN: return "INVALID_TOKEN"
        elif self == LogStatus.INVALID_REQUEST: return "INVALID_REQUEST"
        elif self == LogStatus.NOT_FOUND: return "NOT_FOUND"
        elif self == LogStatus.METHOD_NOT_ALLOWED: return "METHOD_NOT_ALLOWED"
        elif self == LogStatus.UNKNOWN_ERROR: return "UNKNOWN_ERROR"
        elif self == LogStatus.UNKNOWN_STATUS: return "UNKNOWN_STATUS"
        else: return LogStatus.DEFAULT


@dataclass
class LogSchema:
    timestamp: datetime
    device_id: UUID
    status: str
    value: Union[int, float, str]

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        status = LogStatus(r.status).to_str()
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

def list_log_by_time(resource, timestamp: datetime, device_id: Optional[UUID]=None, status: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        stat = None
        if status != None: stat = LogStatus.from_str(status).value
        request = log_pb2.LogTime(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes,
            status=stat
        )
        response = stub.ListLogByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_last_time(resource, last: datetime, device_id: Optional[UUID]=None, status: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        stat = None
        if status != None: stat = LogStatus.from_str(status).value
        request = log_pb2.LogTime(
            timestamp=int(last.timestamp()*1000000),
            device_id=device_bytes,
            status=stat
        )
        response = stub.ListLogByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_range_time(resource, begin: datetime, end: datetime, device_id: Optional[UUID]=None, status: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        stat = None
        if status != None: stat = LogStatus.from_str(status).value
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

def create_log(resource, timestamp: datetime, device_id: UUID, status: str, value: Union[int, float, str, None]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogSchema(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_id.bytes,
            status=status,
            log_bytes=pack_config(value),
            log_type=ConfigType.from_value(value).value
        )
        stub.CreateLog(request=request, metadata=resource.metadata)

def update_log(resource, timestamp: datetime, device_id: UUID, status: Optional[str], value: Union[int, float, str, None]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        stat = None
        if status != None: stat = LogStatus.from_str(status).value
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
