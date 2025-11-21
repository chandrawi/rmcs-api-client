from rmcs_resource_api import slice_pb2, slice_pb2_grpc
from typing import Optional, List
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc


@dataclass
class SliceSchema:
    id: int
    device_id: UUID
    model_id: UUID
    timestamp_begin: datetime
    timestamp_end: datetime
    name: str
    description: str

    def from_response(r):
        timestamp_begin = datetime.fromtimestamp(r.timestamp_begin/1000000.0)
        timestamp_end = datetime.fromtimestamp(r.timestamp_end/1000000.0)
        return SliceSchema(r.id, UUID(bytes=r.device_id), UUID(bytes=r.model_id), timestamp_begin, timestamp_end, r.name, r.description)

@dataclass
class SliceSetSchema:
    id: int
    set_id: UUID
    timestamp_begin: datetime
    timestamp_end: datetime
    name: str
    description: str

    def from_response(r):
        timestamp_begin = datetime.fromtimestamp(r.timestamp_begin/1000000.0)
        timestamp_end = datetime.fromtimestamp(r.timestamp_end/1000000.0)
        return SliceSetSchema(r.id, UUID(bytes=r.set_id), timestamp_begin, timestamp_end, r.name, r.description)


def read_slice(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceId(id=id)
        response = stub.ReadSlice(request=request, metadata=resource.metadata)
        return SliceSchema.from_response(response.result)

def list_slice_by_ids(resource, ids: List[int]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceIds(ids=ids)
        response = stub.ListSliceByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ListSliceByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_by_range(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListSliceByRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_by_name_time(resource, name: str, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceNameTime(
            name=name,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ListSliceByNameTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_by_name_range(resource, name: str, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceNameRange(
            name=name,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListSliceByNameRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_option(resource, device_id: Optional[UUID], model_id: Optional[UUID], name: Optional[str], begin_or_timestamp: Optional[datetime], end: Optional[datetime]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        id_device = None
        if device_id != None: id_device = device_id.bytes
        id_model = None
        if model_id != None: id_model = model_id.bytes
        timestamp_begin = None
        if begin_or_timestamp != None: timestamp_begin = int(begin_or_timestamp.timestamp()*1000000)
        timestamp_end = None
        if end != None: timestamp_end = int(end.timestamp()*1000000)
        request = slice_pb2.SliceOption(
            device_id=id_device,
            model_id=id_model,
            name=name,
            begin=timestamp_begin,
            end=timestamp_end
        )
        response = stub.ListSliceOption(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def create_slice(resource, device_id: UUID, model_id: UUID, timestamp_begin: datetime, timestamp_end: datetime, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceSchema(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp_begin=int(timestamp_begin.timestamp()*1000000),
            timestamp_end=int(timestamp_end.timestamp()*1000000),
            name=name,
            description=description
        )
        response = stub.CreateSlice(request=request, metadata=resource.metadata)
        return response.id

def update_slice(resource, id: int, timestamp_begin: Optional[datetime]=None, timestamp_end: Optional[datetime]=None, name: Optional[str]=None, description: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        begin = None
        if timestamp_begin != None: begin = int(timestamp_begin.timestamp()*1000000)
        end = None
        if timestamp_end != None: end = int(timestamp_end.timestamp()*1000000)
        request = slice_pb2.SliceUpdate(
            id=id,
            timestamp_begin=begin,
            timestamp_end=end,
            name=name,
            description=description
        )
        stub.UpdateSlice(request=request, metadata=resource.metadata)

def delete_slice(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceId(id=id)
        stub.DeleteSlice(request=request, metadata=resource.metadata)

def read_slice_set(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceId(id=id)
        response = stub.ReadSliceSet(request=request, metadata=resource.metadata)
        return SliceSetSchema.from_response(response.result)

def list_slice_set_by_ids(resource, ids: List[int]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceIds(ids=ids)
        response = stub.ListSliceSetByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_set_by_time(resource, set_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceSetTime(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ListSliceSetByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSetSchema.from_response(result))
        return ls

def list_slice_set_by_range(resource, set_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceSetRange(
            set_id=set_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListSliceSetByRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSetSchema.from_response(result))
        return ls

def list_slice_set_by_name_time(resource, name: str, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceNameTime(
            name=name,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ListSliceSetByNameTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSetSchema.from_response(result))
        return ls

def list_slice_set_by_name_range(resource, name: str, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceNameRange(
            name=name,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListSliceSetByNameRange(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSetSchema.from_response(result))
        return ls

def list_slice_set_option(resource, set_id: Optional[UUID], name: Optional[str], begin_or_timestamp: Optional[datetime], end: Optional[datetime]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        id_set = None
        if set_id != None: id_set = set_id.bytes
        timestamp_begin = None
        if begin_or_timestamp != None: timestamp_begin = int(begin_or_timestamp.timestamp()*1000000)
        timestamp_end = None
        if end != None: timestamp_end = int(end.timestamp()*1000000)
        request = slice_pb2.SliceSetOption(
            set_id=id_set,
            name=name,
            timestamp_begin=timestamp_begin,
            timestamp_end=timestamp_end
        )
        response = stub.ListSliceSetOption(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSetSchema.from_response(result))
        return ls

def create_slice_set(resource, set_id: UUID, timestamp_begin: datetime, timestamp_end: datetime, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceSetSchema(
            set_id=set_id.bytes,
            timestamp_begin=int(timestamp_begin.timestamp()*1000000),
            timestamp_end=int(timestamp_end.timestamp()*1000000),
            name=name,
            description=description
        )
        response = stub.CreateSliceSet(request=request, metadata=resource.metadata)
        return response.id

def update_slice_set(resource, id: int, timestamp_begin: Optional[datetime]=None, timestamp_end: Optional[datetime]=None, name: Optional[str]=None, description: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        begin = None
        if timestamp_begin != None: begin = int(timestamp_begin.timestamp()*1000000)
        end = None
        if timestamp_end != None: end = int(timestamp_end.timestamp()*1000000)
        request = slice_pb2.SliceUpdate(
            id=id,
            timestamp_begin=begin,
            timestamp_end=end,
            name=name,
            description=description
        )
        stub.UpdateSliceSet(request=request, metadata=resource.metadata)

def delete_slice_set(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceId(id=id)
        stub.DeleteSliceSet(request=request, metadata=resource.metadata)
