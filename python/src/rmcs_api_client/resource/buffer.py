from rmcs_resource_api import buffer_pb2, buffer_pb2_grpc
from typing import Optional, Union, List
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
import grpc
from .common import DataType, pack_data_array, unpack_data_array


def status_to_int(status: Union[int, str]) -> Union[int, None]:
    if type(status) == str:
        if status == "DEFAULT": return 0
        elif status == "ERROR": return 1
        elif status == "DELETE": return 2
        elif status == "HOLD": return 3
        elif status == "SEND_UPLINK": return 4
        elif status == "SEND_DOWNLINK": return 5
        elif status == "TRANSFER_LOCAL": return 6
        elif status == "TRANSFER_GATEWAY": return 7
        elif status == "TRANSFER_SERVER": return 8
        elif status == "BACKUP": return 9
        elif status == "RESTORE": return 10
        elif status == "ANALYSIS_1": return 11
        elif status == "ANALYSIS_2": return 12
        elif status == "ANALYSIS_3": return 13
        elif status == "ANALYSIS_4": return 14
        elif status == "ANALYSIS_5": return 15
        elif status == "ANALYSIS_6": return 16
        elif status == "ANALYSIS_7": return 17
        elif status == "ANALYSIS_8": return 18
        elif status == "ANALYSIS_9": return 19
        elif status == "ANALYSIS_10": return 20
        elif status == "EXTERNAL_INPUT": return 21
        elif status == "EXTERNAL_OUTPUT": return 22
        else: return None
    elif type(status) == int:
        return status

def int_to_status(code: int) -> Union[str, int]:
        if code == 0: return "DEFAULT"
        elif code == 1: return "ERROR"
        elif code == 2: return "DELETE"
        elif code == 3: return "HOLD"
        elif code == 4: return "SEND_UPLINK"
        elif code == 5: return "SEND_DOWNLINK"
        elif code == 6: return "TRANSFER_LOCAL"
        elif code == 7: return "TRANSFER_GATEWAY"
        elif code == 8: return "TRANSFER_SERVER"
        elif code == 9: return "BACKUP"
        elif code == 10: return "RESTORE"
        elif code == 11: return "ANALYSIS_1"
        elif code == 12: return "ANALYSIS_2"
        elif code == 13: return "ANALYSIS_3"
        elif code == 14: return "ANALYSIS_4"
        elif code == 15: return "ANALYSIS_5"
        elif code == 16: return "ANALYSIS_6"
        elif code == 17: return "ANALYSIS_7"
        elif code == 18: return "ANALYSIS_8"
        elif code == 19: return "ANALYSIS_9"
        elif code == 20: return "ANALYSIS_10"
        elif code == 21: return "EXTERNAL_INPUT"
        elif code == 22: return "EXTERNAL_OUTPUT"
        else: return code

@dataclass
class BufferSchema:
    id: int
    device_id: UUID
    model_id: UUID
    timestamp: datetime
    data: List[Union[int, float, str, bool, None]]
    status: Union[str, int]

    def from_response(r):
        timestamp = datetime.fromtimestamp(r.timestamp/1000000.0)
        types = []
        for ty in r.data_type: types.append(DataType(ty))
        data = unpack_data_array(r.data_bytes, types)
        status = int_to_status(r.status)
        return BufferSchema(r.id, UUID(bytes=r.device_id), UUID(bytes=r.model_id), timestamp, data, status)


def read_buffer(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferId(id=id)
        response = stub.ReadBuffer(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def read_buffer_by_time(resource, device_id: UUID, model_id: UUID, timestamp: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ReadBufferByTime(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def list_buffer_by_last_time(resource, device_id: UUID, model_id: UUID, last: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferTime(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(last.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferByLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_range_time(resource, device_id: UUID, model_id: UUID, begin: datetime, end: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferRange(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferByRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_number_before(resource, device_id: UUID, model_id: UUID, before: datetime, number: int, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(before.timestamp()*1000000),
            number=number,
            status=status_to_int(status)
        )
        response = stub.ListBufferByNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_number_after(resource, device_id: UUID, model_id: UUID, after: datetime, number: int, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferNumber(
            device_id=device_id.bytes,
            model_id=model_id.bytes,
            timestamp=int(after.timestamp()*1000000),
            number=number,
            status=status_to_int(status)
        )
        response = stub.ListBufferByNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def read_buffer_first(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status)
        )
        response = stub.ReadBufferFirst(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def read_buffer_last(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status)
        )
        response = stub.ReadBufferLast(request=request, metadata=resource.metadata)
        return BufferSchema.from_response(response.result)

def list_buffer_first(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferFirst(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_first_offset(resource, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status),
            number=number,
            offset=offset
        )
        response = stub.ListBufferFirstOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last(resource, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferLast(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last_offset(resource, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status),
            number=number,
            offset=offset
        )
        response = stub.ListBufferLastOffset(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_ids_time(resource, device_ids: List[UUID], model_ids: List[UUID], timestamp: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferIdsTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(timestamp.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferByIdsTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_ids_last_time(resource, device_ids: List[UUID], model_ids: List[UUID], last: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferIdsTime(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(last.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferByIdsLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_ids_range_time(resource, device_ids: List[UUID], model_ids: List[UUID], begin: datetime, end: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferIdsRange(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferByIdsRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_ids_number_before(resource, device_ids: List[UUID], model_ids: List[UUID], before: datetime, number: int, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferIdsNumber(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(before.timestamp()*1000000),
            number=number,
            status=status_to_int(status)
        )
        response = stub.ListBufferByIdsNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_ids_number_after(resource, device_ids: List[UUID], model_ids: List[UUID], after: datetime, number: int, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferIdsNumber(
            device_ids=list(map((lambda x: x.bytes), device_ids)),
            model_ids=list(map((lambda x: x.bytes), model_ids)),
            timestamp=int(after.timestamp()*1000000),
            number=number,
            status=status_to_int(status)
        )
        response = stub.ListBufferByIdsNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_first_by_ids(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersIdsSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferFirstByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_first_offset_by_ids(resource, number: int, offset: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersIdsSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            status=status_to_int(status),
            number=number,
            offset=offset
        )
        response = stub.ListBufferFirstOffsetByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last_by_ids(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersIdsSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferLastByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last_offset_by_ids(resource, number: int, offset: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersIdsSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            status=status_to_int(status),
            number=number,
            offset=offset
        )
        response = stub.ListBufferLastOffsetByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_set_time(resource, set_id: UUID, timestamp: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetTime(
            set_id=set_id.bytes,
            timestamp=int(timestamp.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferBySetTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_set_last_time(resource, set_id: UUID, last: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetTime(
            set_id=set_id.bytes,
            timestamp=int(last.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferBySetLastTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_set_range_time(resource, set_id: UUID, begin: datetime, end: datetime, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetRange(
            set_id=set_id.bytes,
            begin=int(begin.timestamp()*1000000),
            end=int(end.timestamp()*1000000),
            status=status_to_int(status)
        )
        response = stub.ListBufferBySetRangeTime(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_set_number_before(resource, set_id: UUID, before: datetime, number: int, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetNumber(
            set_id=set_id.bytes,
            timestamp=int(before.timestamp()*1000000),
            number=number,
            status=status_to_int(status)
        )
        response = stub.ListBufferBySetNumberBefore(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_by_set_number_after(resource, set_id: UUID, after: datetime, number: int, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetNumber(
            set_id=set_id.bytes,
            timestamp=int(after.timestamp()*1000000),
            number=number,
            status=status_to_int(status)
        )
        response = stub.ListBufferBySetNumberAfter(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_first_by_set(resource, number: int, set_id: UUID, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BuffersSetSelector(
            set_id=set_id.bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferFirstBySet(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_first_offset_by_set(resource, number: int, offset: int, set_id: UUID, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BuffersSetSelector(
            set_id=set_id.bytes,
            status=status_to_int(status),
            number=number,
            offset=offset
        )
        response = stub.ListBufferFirstOffsetBySet(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last_by_set(resource, number: int, set_id: UUID, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BuffersSetSelector(
            set_id=set_id.bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferLastBySet(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def list_buffer_last_offset_by_set(resource, number: int, offset: int, set_id: UUID, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BuffersSetSelector(
            set_id=set_id.bytes,
            status=status_to_int(status),
            number=number,
            offset=offset
        )
        response = stub.ListBufferLastOffsetBySet(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(BufferSchema.from_response(result))
        return ls

def create_buffer(resource, device_id: UUID, model_id: UUID, timestamp: datetime, data: List[Union[int, float, str, bool, None]], status: Union[str, int]):
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
            status=status_to_int(status)
        )
        response = stub.CreateBuffer(request=request, metadata=resource.metadata)
        return response.id

def update_buffer(resource, id: int, data: Optional[List[Union[int, float, str, bool, None]]]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        data_bytes = None
        data_list = []
        if data != None: 
            data_bytes = pack_data_array(data)
            data_list = data
        data_type = []
        for d in data_list: data_type.append(DataType.from_value(d).value)
        stat = None
        if status != None: stat = status_to_int(status)
        request = buffer_pb2.BufferUpdate(
            id=id,
            data_bytes=data_bytes,
            data_type=data_type,
            status=stat
        )
        stub.UpdateBuffer(request=request, metadata=resource.metadata)

def delete_buffer(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferId(id=id)
        stub.DeleteBuffer(request=request, metadata=resource.metadata)

def read_buffer_timestamp_first(resource, device_id: Optional[UUID], model_id: Optional[UUID], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status)
        )
        response = stub.ReadBufferTimestampFirst(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def read_buffer_timestamp_last(resource, device_id: Optional[UUID], model_id: Optional[UUID], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status)
        )
        response = stub.ReadBufferTimestampLast(request=request, metadata=resource.metadata)
        return datetime.fromtimestamp(response.timestamp/1000000.0)

def list_buffer_timestamp_first(resource, number: int, device_id: Optional[UUID], model_id: Optional[UUID], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferTimestampFirst(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_timestamp_last(resource, number: int, device_id: Optional[UUID], model_id: Optional[UUID], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BuffersSelector(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferTimestampLast(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_timestamp_first_by_ids(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersIdsSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferTimestampFirstByIds(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_timestamp_last_by_ids(resource, number: int, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BuffersIdsSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferTimestampLastByIds(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_timestamp_first_by_set(resource, number: int, set_id: UUID, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BuffersSetSelector(
            set_id=set_id.bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferTimestampFirstBySet(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def list_buffer_timestamp_last_by_set(resource, number: int, set_id: UUID, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BuffersSetSelector(
            set_id=set_id.bytes,
            status=status_to_int(status),
            number=number
        )
        response = stub.ListBufferTimestampLastBySet(request=request, metadata=resource.metadata)
        ls = []
        for timestamp in response.timestamps: ls.append(datetime.fromtimestamp(timestamp/1000000.0))
        return ls

def count_buffer(resource, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes = None
        if device_id != None: device_bytes = device_id.bytes
        model_bytes = None
        if model_id != None: model_bytes = model_id.bytes
        request = buffer_pb2.BufferCount(
            device_id=device_bytes,
            model_id=model_bytes,
            status=status_to_int(status)
        )
        response = stub.CountBuffer(request=request, metadata=resource.metadata)
        return response.count

def count_buffer_by_ids(resource, device_ids: Optional[List[UUID]], model_ids: Optional[List[UUID]], status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        device_bytes_list = None
        if device_ids != None: device_bytes_list = list(map((lambda x: x.bytes), device_ids))
        model_bytes_list = None
        if model_ids != None: model_bytes_list = list(map((lambda x: x.bytes), model_ids))
        request = buffer_pb2.BufferIdsSelector(
            device_ids=device_bytes_list,
            model_ids=model_bytes_list,
            status=status_to_int(status)
        )
        response = stub.CountBufferByIds(request=request, metadata=resource.metadata)
        return response.count

def count_buffer_by_set(resource, set_id: UUID, status: Optional[Union[str, int]]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = buffer_pb2_grpc.BufferServiceStub(channel)
        request = buffer_pb2.BufferSetSelector(
            set_id=set_id.bytes,
            status=status_to_int(status)
        )
        response = stub.CountBufferBySet(request=request, metadata=resource.metadata)
        return response.count
