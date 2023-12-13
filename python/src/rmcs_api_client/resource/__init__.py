from datetime import datetime
from uuid import UUID
from typing import Optional, Union, List
from . import model as _model, device as _device, types as _types, group as _group
from . import data as _data, buffer as _buffer, slice as _slice, log as _log
from .common import DataIndexing, DataType
from .model import ModelSchema, ModelConfigSchema
from .device import DeviceSchema, GatewaySchema, DeviceConfigSchema, GatewayConfigSchema
from .types import TypeSchema
from .group import GroupModelSchema, GroupDeviceSchema, GroupGatewaySchema
from .data import DataSchema, DataModel
from .buffer import BufferStatus, BufferSchema
from .slice import SliceSchema
from .log import LogSchema

class Resource:

    def __init__(self, address: str, access_token: Optional[str] = None):
        self.address = address
        self.metadata = [] if access_token == None \
            else [("authorization", "Bearer " + access_token)]

    def read_model(self, id: UUID) -> ModelSchema:
        return _model.read_model(self, id)

    def list_model_by_name(self, name: str) -> List[ModelSchema]:
        return _model.list_model_by_name(self, name)

    def list_model_by_category(self, category: str) -> List[ModelSchema]:
        return _model.list_model_by_category(self, category)

    def list_model_by_name_category(self, name: str, category: str) -> List[ModelSchema]:
        return _model.list_model_by_name_category(self, name, category)

    def create_model(self, id: UUID, indexing: DataIndexing, category: str, name: str, description: str) -> UUID:
        return _model.create_model(self, id, indexing, category, name, description)

    def update_model(self, id: UUID, indexing: Optional[DataIndexing], category: Optional[str], name: Optional[str], description: Optional[str]):
        return _model.update_model(self, id, indexing, category, name, description)

    def delete_model(self, id: UUID):
        return _model.delete_model(self, id)

    def add_model_type(self, id: UUID, types: List[DataType]):
        return _model.add_model_type(self, id, types)

    def remove_model_type(self, id: UUID):
        return _model.remove_model_type(self, id)

    def read_model_config(self, id: int) -> ModelConfigSchema:
        return _model.read_model_config(self, id)

    def list_model_config_by_model(self, model_id: UUID) -> List[ModelConfigSchema]:
        return _model.list_model_config_by_model(self, model_id)

    def create_model_config(self, model_id: UUID, index: int, name: str, value: Union[int, float, str, None], category: str) -> int:
        return _model.create_model_config(self, model_id, index, name, value, category)

    def update_model_config(self, id: int, name: Optional[str], value: Union[int, float, str, None], category: Optional[str]):
        return _model.update_model_config(self, id, name, value, category)

    def delete_model_config(self, id: int):
        return _model.delete_model_config(self, id)

    def read_device(self, id: UUID) -> DeviceSchema:
        return _device.read_device(self, id)

    def read_device_by_sn(self, serial_number: str) -> DeviceSchema:
        return _device.read_device_by_sn(self, serial_number)

    def list_device_by_gateway(self, gateway_id: UUID) -> List[DeviceSchema]:
        return _device.list_device_by_gateway(self, gateway_id)

    def list_device_by_type(self, type_id: UUID) -> List[DeviceSchema]:
        return _device.list_device_by_type(self, type_id)

    def list_device_by_name(self, name: str) -> List[DeviceSchema]:
        return _device.list_device_by_name(self, name)

    def list_device_by_gateway_type(self, gateway_id: UUID, type_id: UUID) -> List[DeviceSchema]:
        return _device.list_device_by_gateway_type(self, gateway_id, type_id)

    def list_device_by_gateway_name(self, gateway_id: UUID, name: str) -> List[DeviceSchema]:
        return _device.list_device_by_gateway_name(self, gateway_id, name)

    def create_device(self, id: UUID, gateway_id: UUID, type_id: UUID, serial_number: str, name: str, description: str) -> UUID:
        return _device.create_device(self, id, gateway_id, type_id, serial_number, name, description)

    def update_device(self, id: UUID, gateway_id: Optional[UUID], type_id: Optional[UUID], serial_number: Optional[str], name: Optional[str], description: Optional[str]):
        return _device.update_device(self, id, gateway_id, type_id, serial_number, name, description)

    def delete_device(self, id: UUID):
        return _device.delete_device(self, id)

    def read_gateway(self, id: UUID) -> GatewaySchema:
        return _device.read_gateway(self, id)

    def read_gateway_by_sn(self, serial_number: str) -> GatewaySchema:
        return _device.read_gateway_by_sn(self, serial_number)

    def list_gateway_by_type(self, type_id: UUID) -> List[GatewaySchema]:
        return _device.list_gateway_by_type(self, type_id)

    def list_gateway_by_name(self, name: str) -> List[GatewaySchema]:
        return _device.list_gateway_by_name(self, name)

    def create_gateway(self, id: UUID, type_id: UUID, serial_number: str, name: str, description: str) -> UUID:
        return _device.create_gateway(self, id, type_id, serial_number, name, description)

    def update_gateway(self, id: UUID, type_id: Optional[UUID], serial_number: Optional[str], name: Optional[str], description: Optional[str]):
        return _device.update_gateway(self, id, type_id, serial_number, name, description)

    def delete_gateway(self, id: UUID):
        return _device.delete_gateway(self, id)

    def read_device_config(self, id: int) -> DeviceConfigSchema:
        return _device.read_device_config(self, id)

    def list_device_config_by_device(self, device_id: UUID) -> List[DeviceConfigSchema]:
        return _device.list_device_config_by_device(self, device_id)

    def create_device_config(self, device_id: UUID, name: str, value: Union[int, float, str, None], category: str) -> int:
        return _device.create_device_config(self, device_id, name, value, category)

    def update_device_config(self, id: int, name: Optional[str], value: Union[int, float, str, None], category: Optional[str]):
        return _device.update_device_config(self, id, name, value, category)

    def delete_device_config(self, id: int):
        return _device.delete_device_config(self, id)

    def read_gateway_config(self, id: int) -> GatewayConfigSchema:
        return _device.read_gateway_config(self, id)

    def list_gateway_config_by_gateway(self, gateway_id: UUID) -> List[GatewayConfigSchema]:
        return _device.list_gateway_config_by_gateway(self, gateway_id)

    def create_gateway_config(self, gateway_id: UUID, name: str, value: Union[int, float, str, None], category: str) -> int:
        return _device.create_gateway_config(self, gateway_id, name, value, category)

    def update_gateway_config(self, id: int, name: Optional[str], value: Union[int, float, str, None], category: Optional[str]):
        return _device.update_gateway_config(self, id, name, value, category)

    def delete_gateway_config(self, id: int):
        return _device.delete_gateway_config(self, id)

    def read_type(self, id: UUID) -> TypeSchema:
        return _types.read_type(self, id)

    def list_type_by_name(self, name: str) -> List[TypeSchema]:
        return _types.list_type_by_name(self, name)

    def create_type(self, id: UUID, name: str, description: str) -> UUID:
        return _types.create_type(self, id, name, description)

    def update_type(self, id: UUID, name: Optional[str], description: Optional[str]):
        return _types.update_type(self, id, name, description)

    def delete_type(self, id: UUID):
        return _types.delete_type(self, id)

    def add_type_model(self, id: UUID, model_id: UUID):
        return _types.add_type_model(self, id, model_id)

    def remove_type_model(self, id: UUID, model_id: UUID):
        return _types.remove_type_model(self, id, model_id)

    def read_group_model(self, id: UUID) -> GroupModelSchema:
        return _group.read_group_model(self, id)

    def list_group_model_by_name(self, name: str) -> List[GroupModelSchema]:
        return _group.list_group_model_by_name(self, name)

    def list_group_model_by_category(self, category: str) -> List[GroupModelSchema]:
        return _group.list_group_model_by_category(self, category)

    def list_group_model_by_name_category(self, name: str, category: str) -> List[GroupModelSchema]:
        return _group.list_group_model_by_name_category(self, name, category)

    def create_group_model(self, id: UUID, name: str, category: str, description: str) -> UUID:
        return _group.create_group_model(self, id, name, category, description)

    def update_group_model(self, id: UUID, name: Optional[str], category: Optional[str], description: Optional[str]):
        return _group.update_group_model(self, id, name, category, description)

    def delete_group_model(self, id: UUID):
        return _group.delete_group_model(self, id)

    def add_group_model_member(self, id: UUID, model_id: UUID):
        return _group.add_group_model_member(self, id, model_id)

    def remove_group_model_member(self, id: UUID, model_id: UUID):
        return _group.remove_group_model_member(self, id, model_id)

    def read_group_device(self, id: UUID) -> GroupDeviceSchema:
        return _group.read_group_device(self, id)

    def list_group_device_by_name(self, name: str) -> List[GroupDeviceSchema]:
        return _group.list_group_device_by_name(self, name)

    def list_group_device_by_category(self, category: str) -> List[GroupDeviceSchema]:
        return _group.list_group_device_by_category(self, category)

    def list_group_device_by_name_category(self, name: str, category: str) -> List[GroupDeviceSchema]:
        return _group.list_group_device_by_name_category(self, name, category)

    def create_group_device(self, id: UUID, name: str, category: str, description: str) -> UUID:
        return _group.create_group_device(self, id, name, category, description)

    def update_group_device(self, id: UUID, name: Optional[str], category: Optional[str], description: Optional[str]):
        return _group.update_group_device(self, id, name, category, description)

    def delete_group_device(self, id: UUID):
        return _group.delete_group_device(self, id)

    def add_group_device_member(self, id: UUID, device_id: UUID):
        return _group.add_group_device_member(self, id, device_id)

    def remove_group_device_member(self, id: UUID, device_id: UUID):
        return _group.remove_group_device_member(self, id, device_id)

    def read_group_gateway(self, id: UUID) -> GroupGatewaySchema:
        return _group.read_group_gateway(self, id)

    def list_group_gateway_by_name(self, name: str) -> List[GroupGatewaySchema]:
        return _group.list_group_gateway_by_name(self, name)

    def list_group_gateway_by_category(self, category: str) -> List[GroupGatewaySchema]:
        return _group.list_group_gateway_by_category(self, category)

    def list_group_gateway_by_name_category(self, name: str, category: str) -> List[GroupGatewaySchema]:
        return _group.list_group_gateway_by_name_category(self, name, category)

    def create_group_gateway(self, id: UUID, name: str, category: str, description: str) -> UUID:
        return _group.create_group_gateway(self, id, name, category, description)

    def update_group_gateway(self, id: UUID, name: Optional[str], category: Optional[str], description: Optional[str]):
        return _group.update_group_gateway(self, id, name, category, description)

    def delete_group_gateway(self, id: UUID):
        return _group.delete_group_gateway(self, id)

    def add_group_gateway_member(self, id: UUID, gateway_id: UUID):
        return _group.add_group_gateway_member(self, id, gateway_id)

    def remove_group_gateway_member(self, id: UUID, gateway_id: UUID):
        return _group.remove_group_gateway_member(self, id, gateway_id)

    def read_data(self, device_id: UUID, model_id: UUID, timestamp: datetime, index: int = 0) -> DataSchema:
        return _data.read_data(self, device_id, model_id, timestamp, index)

    def list_data_by_time(self, device_id: UUID, model_id: UUID, timestamp: datetime) -> List[DataSchema]:
        return _data.list_data_by_time(self, device_id, model_id, timestamp)

    def list_data_by_last_time(self, device_id: UUID, model_id: UUID, last: datetime) -> List[DataSchema]:
        return _data.list_data_by_last_time(self, device_id, model_id, last)

    def list_data_by_range_time(self, device_id: UUID, model_id: UUID, begin: datetime, end: datetime) -> List[DataSchema]:
        return _data.list_data_by_range_time(self, device_id, model_id, begin, end)

    def list_data_by_number_before(self, device_id: UUID, model_id: UUID, before: datetime, number: int) -> List[DataSchema]:
        return _data.list_data_by_number_before(self, device_id, model_id, before, number)

    def list_data_by_number_after(self, device_id: UUID, model_id: UUID, after: datetime, number: int) -> List[DataSchema]:
        return _data.list_data_by_number_after(self, device_id, model_id, after, number)

    def get_data_model(self, model_id: UUID):
        return _data.get_data_model(self, model_id)

    def read_data_with_model(self, model: DataModel, device_id: UUID, timestamp: datetime, index: int = 0) -> DataSchema:
        return _data.read_data_with_model(self, model, device_id, timestamp, index)

    def list_data_with_model_by_time(self, model: DataModel, device_id: UUID, timestamp: datetime) -> List[DataSchema]:
        return _data.list_data_with_model_by_time(self, model, device_id, timestamp)

    def list_data_with_model_by_last_time(self, model: DataModel, device_id: UUID, last: datetime) -> List[DataSchema]:
        return _data.list_data_with_model_by_last_time(self, model, device_id, last)

    def list_data_with_model_by_range_time(self, model: DataModel, device_id: UUID, begin: datetime, end: datetime) -> List[DataSchema]:
        return _data.list_data_with_model_by_range_time(self, model, device_id, begin, end)

    def list_data_with_model_by_number_before(self, model: DataModel, device_id: UUID, before: datetime, number: int) -> List[DataSchema]:
        return _data.list_data_with_model_by_number_before(self, model, device_id, before, number)

    def list_data_with_model_by_number_after(self, model: DataModel, device_id: UUID, after: datetime, number: int) -> List[DataSchema]:
        return _data.list_data_with_model_by_number_after(self, model, device_id, after, number)

    def create_data(self, device_id: UUID, model_id: UUID, timestamp: datetime, index: int, data: List[Union[int, float, str, bool, None]]):
        return _data.create_data(self, device_id, model_id, timestamp, index, data)

    def create_data_with_model(self, model: DataModel, device_id: UUID, timestamp: datetime, index: int, data: List[Union[int, float, str, bool, None]]):
        return _data.create_data_with_model(self, model, device_id, timestamp, index, data)

    def delete_data(self, device_id: UUID, model_id: UUID, timestamp: datetime, index: int = 0):
        return _data.delete_data(self, device_id, model_id, timestamp, index)

    def delete_data_with_model(self, model: DataModel, device_id: UUID, timestamp: datetime, index: int = 0):
        return _data.delete_data_with_model(self, model, device_id, timestamp, index)

    def read_buffer(self, id: int) -> BufferSchema:
        return _buffer.read_buffer(self, id)

    def read_buffer_first(self, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None) -> BufferSchema:
        return _buffer.read_buffer_first(self, device_id, model_id, status)

    def read_buffer_last(self, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None) -> BufferSchema:
        return _buffer.read_buffer_last(self, device_id, model_id, status)

    def list_buffer_first(self, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None) -> List[BufferSchema]:
        return _buffer.list_buffer_first(self, number, device_id, model_id, status)

    def list_buffer_last(self, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[str]=None) -> List[BufferSchema]:
        return _buffer.list_buffer_last(self, number, device_id, model_id, status)

    def create_buffer(self, device_id: UUID, model_id: UUID, timestamp: datetime, index: int, data: List[Union[int, float, str, bool, None]], status: str) -> int:
        return _buffer.create_buffer(self, device_id, model_id, timestamp, index, data, status)

    def update_buffer(self, id: int, data: Optional[List[Union[int, float, str, bool, None]]], status: Optional[str]):
        return _buffer.update_buffer(self, id, data, status)

    def delete_buffer(self, id: int):
        return _buffer.delete_buffer(self, id)

    def read_slice(self, id: int) -> SliceSchema:
        return _slice.read_slice(self, id)

    def list_slice_by_name(self, name: str) -> List[SliceSchema]:
        return _slice.list_slice_by_name(self, name)

    def list_slice_by_device(self, device_id: UUID) -> List[SliceSchema]:
        return _slice.list_slice_by_device(self, device_id)

    def list_slice_by_model(self, model_id: UUID) -> List[SliceSchema]:
        return _slice.list_slice_by_model(self, model_id)

    def list_slice_by_device_model(self, device_id: UUID, model_id: UUID) -> List[SliceSchema]:
        return _slice.list_slice_by_device_model(self, device_id, model_id)

    def create_slice(self, device_id: UUID, model_id: UUID, timestamp_begin: datetime, timestamp_end: datetime, index_begin: int, index_end: int, name: str, description: str) -> int:
        return _slice.create_slice(self, device_id, model_id, timestamp_begin, timestamp_end, index_begin, index_end, name, description)

    def update_slice(self, id: int, timestamp_begin: Optional[datetime], timestamp_end: Optional[datetime], index_begin: Optional[int], index_end: Optional[int], name: Optional[str], description: Optional[str]):
        return _slice.update_slice(self, id, timestamp_begin, timestamp_end, index_begin, index_end, name, description)

    def delete_slice(self, id: int):
        return _slice.delete_slice(self, id)

    def read_log(self, timestamp: datetime, device_id: UUID) -> LogSchema:
        return _log.read_log(self, timestamp, device_id)

    def list_log_by_time(self, timestamp: datetime, device_id: Optional[UUID]=None, status: Optional[str]=None) -> List[LogSchema]:
        return _log.list_log_by_time(self, timestamp, device_id, status)

    def list_log_by_last_time(self, last: datetime, device_id: Optional[UUID]=None, status: Optional[str]=None) -> List[LogSchema]:
        return _log.list_log_by_last_time(self, last, device_id, status)

    def list_log_by_range_time(self, begin: datetime, end: datetime, device_id: Optional[UUID]=None, status: Optional[str]=None) -> List[LogSchema]:
        return _log.list_log_by_range_time(self, begin, end, device_id, status)

    def create_log(self, timestamp: datetime, device_id: UUID, status: str, value: List[Union[int, float, str, bool, None]]):
        return _log.create_log(self, timestamp, device_id, status, value)

    def update_log(self, timestamp: datetime, device_id: UUID, status: Optional[str], value: List[Union[int, float, str, bool, None]]):
        return _log.update_log(self, timestamp, device_id, status, value)

    def delete_log(self, timestamp: datetime, device_id: UUID):
        return _log.delete_log(self, timestamp, device_id)
