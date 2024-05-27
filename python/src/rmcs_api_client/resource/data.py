from rmcs_resource_api import data_pb2, data_pb2_grpc
from typing import Union, List
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import DataType, pack_data_array, pack_data_array_model, unpack_data_array


@dataclass
class DataSchema:
    device_id: UUID
    model_id: UUID
    timestamp: datetime
    data: List[Union[bool, int, float, str]]

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        types = []
        for ty in r.data_type: types.append(DataType(ty))
        data = unpack_data_array(r.data_bytes, types)
        return DataSchema(UUID(bytes=r.device_id), UUID(bytes=r.model_id), timestamp, data)


@dataclass
class DataModel:
    id: UUID
    types: List[DataType]

    def from_response(r):
        types = []
        for ty in r.types: types.append(DataType(ty))
        return DataModel(UUID(bytes=r.id), types)

    def to_request(self):
        types = []
        for ty in self.types: types.append(ty.value)
        return data_pb2.DataModel(id=self.id.bytes, types=types)


def read_data(resource, device_id: UUID, model_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataId(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ReadData(request=request, metadata=resource.metadata)
        return DataSchema.from_response(response.result)

def list_data_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ListDataByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_last_time(resource, device_id: UUID, model_id: UUID, last: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000)
        )
        response = stub.ListDataByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_range_time(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListDataByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_number_before(resource, device_id: UUID, model_id: UUID, before: datetime, number: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(before.timestamp()*1000000),
            number=number
        )
        response = stub.ListDataByNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_number_after(resource, device_id: UUID, model_id: UUID, after: datetime, number: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(after.timestamp()*1000000),
            number=number
        )
        response = stub.ListDataByNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def create_data(resource, device_id: UUID, model_id: UUID, timestamp: datetime, data: List[Union[int, float, str, bool, None]]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        data_type = []
        for d in data: data_type.append(DataType.from_value(d).value)
        request = data_pb2.DataSchema(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            data_bytes=pack_data_array(data),
            data_type=data_type
        )
        stub.CreateData(request=request, metadata=resource.metadata)

def delete_data(resource, device_id: UUID, model_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataId(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        stub.DeleteData(request=request, metadata=resource.metadata)
