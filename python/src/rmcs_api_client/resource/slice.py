from rmcs_resource_api import slice_pb2, slice_pb2_grpc
from typing import Optional
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
    index_begin: int
    index_end: int
    name: str
    description: str

    def from_response(r):
        timestamp_begin = datetime.fromtimestamp(r.timestamp_begin/1000000.0)
        timestamp_end = datetime.fromtimestamp(r.timestamp_end/1000000.0)
        return SliceSchema(r.id, UUID(bytes=r.device_id), UUID(bytes=r.model_id), timestamp_begin, timestamp_end, r.index_begin, r.index_end, r.name, r.description)


def read_slice(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceId(id=id)
        response = stub.ReadSlice(request=request, metadata=resource.metadata)
        return SliceSchema.from_response(response.result)

def list_slice_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceName(name=name)
        response = stub.ListSliceByName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_by_device(resource, device_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceDevice(device_id=device_id.bytes)
        response = stub.ListSliceByDevice(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_by_model(resource, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceModel(model_id=model_id.bytes)
        response = stub.ListSliceByModel(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def list_slice_by_device_model(resource, device_id: UUID, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceDeviceModel(device_id=device_id.bytes, model_id=model_id.bytes)
        response = stub.ListSliceByDeviceModel(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SliceSchema.from_response(result))
        return ls

def create_slice(resource, device_id: UUID, model_id: UUID, timestamp_begin: datetime, timestamp_end: datetime, index_begin: int, index_end: int, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceSchema(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp_begin=int(timestamp_begin.timestamp()*1000000),
            timestamp_end=int(timestamp_end.timestamp()*1000000),
            index_begin=index_begin,
            index_end=index_end,
            name=name,
            description=description
        )
        response = stub.CreateSlice(request=request, metadata=resource.metadata)
        return response.id

def update_slice(resource, id: int, timestamp_begin: Optional[datetime], timestamp_end: Optional[datetime], index_begin: Optional[int], index_end: Optional[int], name: Optional[str], description: Optional[str]):
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
            index_begin=index_begin,
            index_end=index_end,
            name=name,
            description=description
        )
        stub.UpdateSlice(request=request, metadata=resource.metadata)

def delete_slice(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = slice_pb2_grpc.SliceServiceStub(channel)
        request = slice_pb2.SliceId(id=id)
        stub.DeleteSlice(request=request, metadata=resource.metadata)
