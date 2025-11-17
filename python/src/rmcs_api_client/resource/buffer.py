from rmcs_resource_api import buffer_pb2, buffer_pb2_grpc
from typing import Optional, Union, List
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import DataType, pack_data_array, unpack_data_array, Tag


@dataclass
class BufferSchema:
    id: int
    device_id: UUID
    model_id: UUID
    timestamp: datetime
    data: List[Union[int, float, str, bool, None]]
    tag: int

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        types = []
        for ty in r.data_type: types.append(DataType(ty))
        data = unpack_data_array(r.data_bytes, types)
        return BufferSchema(r.id, UUID(bytes=r.device_id), UUID(bytes=r.model_id), timestamp, data, r.tag)


def read_buffer(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferId(id=id)
        response = stub.ReadBuffer(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def read_buffer_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ReadBufferByTime(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def list_buffer_by_ids(resource, ids: List[int]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferIds(
            ids=ids
        )
        response = stub.ListBufferByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_latest(resource, device_id: UUID, model_id: UUID, last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferByLatest(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_range(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferByRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_number_before(resource, device_id: UUID, model_id: UUID, before: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(before.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListBufferByNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_number_after(resource, device_id: UUID, model_id: UUID, after: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(after.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListBufferByNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def read_buffer_first(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ReadBufferFirst(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def read_buffer_last(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ReadBufferLast(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def list_buffer_first(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag,
            number=number
        )
        response = stub.ListBufferFirst(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_first_offset(resource, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag,
            number=number,
            offset=offset
        )
        response = stub.ListBufferFirstOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag,
            number=number
        )
        response = stub.ListBufferLast(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last_offset(resource, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag,
            number=number,
            offset=offset
        )
        response = stub.ListBufferLastOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_by_time(resource, device_ids: List[UUID], model_ids: List[UUID], timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferGroupTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferGroupByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_by_latest(resource, device_ids: List[UUID], model_ids: List[UUID], last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferGroupTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferGroupByLatest(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_by_range(resource, device_ids: List[UUID], model_ids: List[UUID], begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferGroupRange(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferGroupByRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_by_number_before(resource, device_ids: List[UUID], model_ids: List[UUID], before: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferGroupNumber(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(before.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListBufferGroupByNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_by_number_after(resource, device_ids: List[UUID], model_ids: List[UUID], after: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferGroupNumber(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(after.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListBufferGroupByNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_first(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag,
            number=number
        )
        response = stub.ListBufferGroupFirst(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_first_offset(resource, number: int, offset: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag,
            number=number,
            offset=offset
        )
        response = stub.ListBufferGroupFirstOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_last(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag,
            number=number
        )
        response = stub.ListBufferGroupLast(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_group_last_offset(resource, number: int, offset: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag,
            number=number,
            offset=offset
        )
        response = stub.ListBufferGroupLastOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def read_buffer_set(resource, set_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetId(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ReadBufferSet(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def list_buffer_set_by_time(resource, set_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetTime(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferSetByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_set_by_latest(resource, set_id: UUID, last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetTime(
            set_id=set_id.bytes,
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferSetByLatest(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_set_by_range(resource, set_id: UUID, begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetRange(
            set_id=set_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListBufferSetByRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def create_buffer(resource, device_id: UUID, model_id: UUID, timestamp: datetime, data: List[Union[int, float, str, bool, None]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        data_type = []
        for d in data: data_type.append(DataType.from_value(d).value)
        request = buffer_pb2.BufferSchema(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            data_bytes=pack_data_array(data),
            data_type=data_type,
            tag=tag
        )
        response = stub.CreateBuffer(request=request, metadata=resource.metadata)
        return response.id

def create_buffer_multiple(resource, device_ids: list[UUID], model_ids: list[UUID], timestamps: list[datetime], data: List[List[Union[int, float, str, bool, None]]], tags: Optional[List[int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        number = len(device_ids)
        if tags is None: tags = [Tag.DEFAULT] * number
        if any(length != number for length in [len(model_ids), len(timestamps), len(data), len(tags)]):
            raise grpc.RpcError(grpc.StatusCode.INVALID_ARGUMENT)
        schemas = []
        for i in range(number):
            data_type = []
            for d in data[i]: data_type.append(DataType.from_value(d).value)
            schemas.append(buffer_pb2.BufferSchema(
                device_id=device_ids[i].bytes,
                model_id=model_ids[i].bytes,
                timestamp=int(timestamps[i].timestamp()*1000000),
                data_bytes=pack_data_array(data[i]),
                data_type=data_type,
                tag=tags[i]
            ))
        request = buffer_pb2.BufferMultipleSchema(schemas=schemas)
        response = stub.CreateBufferMultiple(request=request, metadata=resource.metadata)
        return response.ids

def update_buffer(resource, id: int, data: Optional[List[Union[int, float, str, bool, None]]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        data_bytes = None
        data_list = []
        if data != None: 
            data_bytes = pack_data_array(data)
            data_list = data
        data_type = []
        for d in data_list: data_type.append(DataType.from_value(d).value)
        request = buffer_pb2.BufferUpdate(
            id=id,
            data_bytes=data_bytes,
            data_type=data_type,
            tag=tag
        )
        stub.UpdateBuffer(request=request, metadata=resource.metadata)

def update_buffer_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime, data: Optional[List[Union[int, float, str, bool, None]]]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        data_bytes = None
        data_list = []
        if data != None: 
            data_bytes = pack_data_array(data)
            data_list = data
        data_type = []
        for d in data_list: data_type.append(DataType.from_value(d).value)
        request = buffer_pb2.BufferUpdateTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            data_bytes=data_bytes,
            data_type=data_type,
            tag=tag
        )
        stub.UpdateBufferByTime(request=request, metadata=resource.metadata)

def delete_buffer(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferId(id=id)
        stub.DeleteBuffer(request=request, metadata=resource.metadata)

def delete_buffer_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        stub.DeleteBufferByTime(request=request, metadata=resource.metadata)

def read_buffer_timestamp_first(resource, device_id: Optional[UUID], model_id: Optional[UUID], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ReadBufferTimestampFirst(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def read_buffer_timestamp_last(resource, device_id: Optional[UUID], model_id: Optional[UUID], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.ReadBufferTimestampLast(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def list_buffer_timestamp_first(resource, number: int, device_id: Optional[UUID], model_id: Optional[UUID], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag,
            number=number
        )
        response = stub.ListBufferTimestampFirst(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_timestamp_last(resource, number: int, device_id: Optional[UUID], model_id: Optional[UUID], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag,
            number=number
        )
        response = stub.ListBufferTimestampLast(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_group_timestamp_first(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag,
            number=number
        )
        response = stub.ListBufferGroupTimestampFirst(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_group_timestamp_last(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag,
            number=number
        )
        response = stub.ListBufferGroupTimestampLast(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def count_buffer(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferCount(
            device_id=device_bytes,
            model_id=model_bytes,
            tag=tag
        )
        response = stub.CountBuffer(request=request, metadata=resource.metadata)
        return response.count

def count_buffer_group(resource, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BufferGroupSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            tag=tag
        )
        response = stub.CountBufferGroup(request=request, metadata=resource.metadata)
        return response.count
