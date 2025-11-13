from rmcs_resource_api import data_pb2, data_pb2_grpc
from typing import Optional, Union, List
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import DataType, pack_data_array, pack_data_array_model, unpack_data_array, Tag


@dataclass
class DataSchema:
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
        return DataSchema(UUID(bytes=r.device_id), UUID(bytes=r.model_id), timestamp, data, r.tag)


@dataclass
class DataSetSchema:
    set_id: UUID
    timestamp: datetime
    data: List[Union[int, float, str, bool, None]]

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        types = []
        for ty in r.data_type: types.append(DataType(ty))
        data = unpack_data_array(r.data_bytes, types)
        return DataSetSchema(UUID(bytes=r.set_id), timestamp, data)


def read_data(resource, device_id: UUID, model_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataId(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ReadData(request=request, metadata=resource.metadata)
        return DataSchema.from_response(response.result)

def list_data_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_last_time(resource, device_id: UUID, model_id: UUID, last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_range_time(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_number_before(resource, device_id: UUID, model_id: UUID, before: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(before.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListDataByNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_number_after(resource, device_id: UUID, model_id: UUID, after: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(after.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListDataByNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_ids_time(resource, device_ids: List[UUID], model_ids: List[UUID], timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataByIdsTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_ids_last_time(resource, device_ids: List[UUID], model_ids: List[UUID], last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataByIdsLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_ids_range_time(resource, device_ids: List[UUID], model_ids: List[UUID], begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsRange(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataByIdsRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_ids_number_before(resource, device_ids: List[UUID], model_ids: List[UUID], before: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsNumber(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(before.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListDataByIdsNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSchema.from_response(result))
        return ls

def list_data_by_ids_number_after(resource, device_ids: List[UUID], model_ids: List[UUID], after: datetime, number: int, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsNumber(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(after.timestamp()*1000000),
            number=number,
            tag=tag
        )
        response = stub.ListDataByIdsNumberAfter(request=request, metadata=resource.metadata)
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

def list_data_set_by_time(resource, set_id: UUID, timestamp: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetTime(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000)
        )
        response = stub.ListDataSetByTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DataSetSchema.from_response(result))
        return ls

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

def create_data(resource, device_id: UUID, model_id: UUID, timestamp: datetime, data: List[Union[int, float, str, bool, None]], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        data_type = []
        for d in data: data_type.append(DataType.from_value(d).value)
        request = data_pb2.DataSchema(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            data_bytes=pack_data_array(data),
            data_type=data_type,
            tag=tag if tag is not None else 0
        )
        stub.CreateData(request=request, metadata=resource.metadata)

def create_data_multiple(resource, device_ids: list[UUID], model_ids: list[UUID], timestamps: list[datetime], data: List[List[Union[int, float, str, bool, None]]], tags: Optional[List[int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        number = len(device_ids)
        if tags is None: tags = [Tag.DEFAULT] * number
        if any(length != number for length in [len(model_ids), len(timestamps), len(data), len(tags)]):
            raise grpc.RpcError(grpc.StatusCode.INVALID_ARGUMENT)
        schemas = []
        for i in range(number):
            data_type = []
            for d in data[i]: data_type.append(DataType.from_value(d).value)
            schemas.append(data_pb2.DataSchema(
                device_id=device_ids[i].bytes,
                model_id=model_ids[i].bytes,
                timestamp=int(timestamps[i].timestamp()*1000000),
                data_bytes=pack_data_array(data[i]),
                data_type=data_type,
                tag=tags[i]
            ))
        request = data_pb2.DataMultipleSchema(schemas=schemas)
        stub.CreateDataMultiple(request=request, metadata=resource.metadata)

def delete_data(resource, device_id: UUID, model_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataId(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        stub.DeleteData(request=request, metadata=resource.metadata)

def read_data_timestamp(resource, device_id: UUID, model_id: UUID, timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataId(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ReadDataTimestamp(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def list_data_timestamp_by_last_time(resource, device_id: UUID, model_id: UUID, last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataTimestampByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_data_timestamp_by_range_time(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataTimestampByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def read_data_timestamp_by_ids(resource, device_ids: List[UUID], model_ids: List[UUID], timestamp: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIds(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(timestamp.timestamp()*1000000),
            tag=tag
        )
        response = stub.ReadDataTimestampByIds(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def list_data_timestamp_by_ids_last_time(resource, device_ids: List[UUID], model_ids: List[UUID], last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataTimestampByIdsLastTime(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_data_timestamp_by_ids_range_time(resource, device_ids: List[UUID], model_ids: List[UUID], begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsRange(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.ListDataTimestampByIdsRangeTime(request=request, metadata=resource.metadata)
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

def count_data(resource, device_id: UUID, model_id: UUID, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            tag=tag
        )
        response = stub.CountData(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_last_time(resource, device_id: UUID, model_id: UUID, last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.CountDataByLastTime(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_range_time(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.CountDataByRangeTime(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_ids(resource, device_ids: List[UUID], model_ids: List[UUID], tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            tag=tag
        )
        response = stub.CountDataByIds(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_ids_last_time(resource, device_ids: List[UUID], model_ids: List[UUID], last: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(last.timestamp()*1000000),
            tag=tag
        )
        response = stub.CountDataByIdsLastTime(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_ids_range_time(resource, device_ids: List[UUID], model_ids: List[UUID], begin: datetime, end: datetime, tag: Optional[int]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataIdsRange(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            tag=tag
        )
        response = stub.CountDataByIdsRangeTime(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_set(resource, set_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetTime(
            set_id=set_id.bytes
        )
        response = stub.CountDataBySet(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_set_last_time(resource, set_id: UUID, last: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetTime(
            set_id=set_id.bytes,
            timestamp=int(last.timestamp()*1000000)
        )
        response = stub.CountDataBySetLastTime(request=request, metadata=resource.metadata)
        return response.count

def count_data_by_set_range_time(resource, set_id: UUID, begin: datetime, end: datetime):
    with grpc.insecure_channel(resource.address) as channel:
        stub = data_pb2_grpc.DataServiceStub(channel)
        request = data_pb2.DataSetRange(
            set_id=set_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000)
        )
        response = stub.CountDataBySetRangeTime(request=request, metadata=resource.metadata)
        return response.count
