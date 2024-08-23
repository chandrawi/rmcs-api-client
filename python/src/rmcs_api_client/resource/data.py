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
class DataSetSchema:
    set_id: UUID
    timestamp: datetime
    data: List[Union[bool, int, float, str]]

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        types = []
        for ty in r.data_type: types.append(DataType(ty))
        data = unpack_data_array(r.data_bytes, types)
        return DataSetSchema(UUID(bytes=r.set_id), timestamp, data)


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

def list_data_by_set_time(resource, set_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetTime(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ListDataBySetTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_set_last_time(resource, set_id: UUID, last: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetTime(
            set_id=set_id.bytes,
            timestamp=int(last.timestamp()*1000000)
        )
        response = stub.ListDataBySetLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_set_range_time(resource, set_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetRange(
            set_id=set_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListDataBySetRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_set_number_before(resource, set_id: UUID, before: datetime, number: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetNumber(
            set_id=set_id.bytes,
            timestamp=int(before.timestamp()*1000000),
            number=number
        )
        response = stub.ListDataBySetNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_set_number_after(resource, set_id: UUID, after: datetime, number: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetNumber(
            set_id=set_id.bytes,
            timestamp=int(after.timestamp()*1000000),
            number=number
        )
        response = stub.ListDataBySetNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def read_data_set(resource, set_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetId(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ReadDataSet(request=request, metadata=resource.metadata)
        return DataSetSchema.from_response(response.result)

def list_data_set_by_last_time(resource, set_id: UUID, last: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetTime(
            set_id=set_id.bytes,
            timestamp=int(last.timestamp()*1000000)
        )
        response = stub.ListDataSetByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSetSchema.from_response(result))
        return ls

def list_data_set_by_range_time(resource, set_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetRange(
            set_id=set_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListDataSetByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSetSchema.from_response(result))
        return ls

def list_data_set_by_number_before(resource, set_id: UUID, before: datetime, number: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetNumber(
            set_id=set_id.bytes,
            timestamp=int(before.timestamp()*1000000),
            number=number
        )
        response = stub.ListDataSetByNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSetSchema.from_response(result))
        return ls

def list_data_set_by_number_after(resource, set_id: UUID, after: datetime, number: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetNumber(
            set_id=set_id.bytes,
            timestamp=int(after.timestamp()*1000000),
            number=number
        )
        response = stub.ListDataSetByNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSetSchema.from_response(result))
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

def read_data_timestamp(resource, device_id: UUID, model_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataId(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ReadDataTimestamp(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def list_data_timestamp_by_last_time(resource, device_id: UUID, model_id: UUID, last: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000)
        )
        response = stub.ListDataTimestampByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_data_timestamp_by_range_time(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListDataTimestampByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def read_data_timestamp_by_set(resource, set_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetId(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ReadDataTimestampBySet(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def list_data_timestamp_by_set_last_time(resource, set_id: UUID, last: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetTime(
            set_id=set_id.bytes,
            timestamp=int(last.timestamp()*1000000)
        )
        response = stub.ListDataTimestampBySetLastTime(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_data_timestamp_by_set_range_time(resource, set_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetRange(
            set_id=set_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.ListDataTimestampBySetRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def count_data(resource, device_id: UUID, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataCount(
            device_id=device_id.bytes,
            model_id=model_id.bytes
        )
        response = stub.CountData(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_last_time(resource, device_id: UUID, model_id: UUID, last: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataCount(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000)
        )
        response = stub.CountDataByLastTime(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_range_time(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataCount(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.CountDataByRangeTime(request=request, metadata=resource.metadata)
        return response.count
