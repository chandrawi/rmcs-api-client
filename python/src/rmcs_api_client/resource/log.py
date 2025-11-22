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

def list_log_by_ids(resource, ids: List[int]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        request = log_pb2.LogIds(
            ids=ids
        )
        response = stub.ListLogByIds(request=request, metadata=resource.metadata)
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

def list_log_by_latest(resource, latest: datetime, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogLatest(
            latest=int(latest.timestamp()*1000000),
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogByLatest(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_by_range(resource, begin: datetime, end: datetime, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
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
        response = stub.ListLogByRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def read_log_first(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ReadLogFirst(request=request, metadata=resource.metadata)
        return LogSchema.from_response(response.result)

def read_log_last(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ReadLogLast(request=request, metadata=resource.metadata)
        return LogSchema.from_response(response.result)

def list_log_first(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogsSelector(
            number=number,
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogFirst(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_first_offset(resource, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogsSelector(
            number=number,
            offset=offset,
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogFirstOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_last(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogsSelector(
            number=number,
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogLast(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_last_offset(resource, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes = None if device_id is None else device_id.bytes
        model_bytes = None if model_id is None else model_id.bytes
        request = log_pb2.LogsSelector(
            number=number,
            offset=offset,
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ListLogLastOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_group_by_time(resource, timestamp: datetime, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogGroupTime(
            timestamp=int(timestamp.timestamp()*1000000),
            device_id=device_bytes_list,
            model_id=model_bytes_list,
            tag=tag
        )
        response = stub.ListLogGroupByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_group_by_latest(resource, latest: datetime, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogGroupLatest(
            latest=int(latest.timestamp()*1000000),
            device_id=device_bytes_list,
            model_id=model_bytes_list,
            tag=tag
        )
        response = stub.ListLogGroupByLatest(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_group_by_range(resource, begin: datetime, end: datetime, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogGroupRange(
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            device_id=device_bytes_list,
            model_id=model_bytes_list,
            tag=tag
        )
        response = stub.ListLogGroupByRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def read_log_group_first(resource, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag
        )
        response = stub.ReadLogGroupFirst(request=request, metadata=resource.metadata)
        return LogSchema.from_response(response.result)

def read_log_group_last(resource, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag
        )
        response = stub.ReadLogGroupLast(request=request, metadata=resource.metadata)
        return LogSchema.from_response(response.result)

def list_log_group_first(resource, number: int, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogsGroupSelector(
            number=number,
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag
        )
        response = stub.ListLogGroupFirst(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_group_first_offset(resource, number: int, offset: int, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogsGroupSelector(
            number=number,
            offset=offset,
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag
        )
        response = stub.ListLogGroupFirstOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_group_last(resource, number: int, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogsGroupSelector(
            number=number,
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag
        )
        response = stub.ListLogGroupLast(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(LogSchema.from_response(result))
        return ls

def list_log_group_last_offset(resource, number: int, offset: int, device_ids: Optional[List[UUID]]=None, model_ids: Optional[List[UUID]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = log_pb2_grpc.LogServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = log_pb2.LogsGroupSelector(
            number=number,
            offset=offset,
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag
        )
        response = stub.ListLogGroupLastOffset(request=request, metadata=resource.metadata)
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
