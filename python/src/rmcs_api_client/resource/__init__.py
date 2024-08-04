from datetime import datetime
from uuid import UUID
from typing import Optional, Union, List
from . import model as _model, device as _device, types as _types, group as _group, set as _set
from . import data as _data, buffer as _buffer, slice as _slice, log as _log
from .common import DataType
from .model import ModelSchema, ModelConfigSchema
from .device import DeviceSchema, GatewaySchema, DeviceConfigSchema, GatewayConfigSchema
from .types import TypeSchema
from .group import GroupModelSchema, GroupDeviceSchema, GroupGatewaySchema
from .set import SetSchema, SetTemplateSchema
from .data import DataSchema, DataSetSchema
from .buffer import BufferSchema
from .slice import SliceSchema, SliceSetSchema
from .log import LogSchema

class Resource:

    def __init__(self, address: str, access_token: Optional[str] = None):
        self.address = address
        self.metadata = [] if access_token == None \
            else [("authorization", "Bearer " + access_token)]

    def read_model(self, id: UUID) -> ModelSchema:
        return _model.read_model(self, id)

    def list_model_by_ids(self, ids: list[UUID]) -> List[ModelSchema]:
        return _model.list_model_by_ids(self, ids)

    def list_model_by_name(self, name: str) -> List[ModelSchema]:
        return _model.list_model_by_name(self, name)

    def list_model_by_category(self, category: str) -> List[ModelSchema]:
        return _model.list_model_by_category(self, category)

    def list_model_by_name_category(self, name: str, category: str) -> List[ModelSchema]:
        return _model.list_model_by_name_category(self, name, category)

    def list_model_by_type(self, type_id: UUID) -> List[ModelSchema]:
        return _model.list_model_by_type(self, type_id)

    def create_model(self, id: UUID, data_type: List[DataType], category: str, name: str, description: str) -> UUID:
        return _model.create_model(self, id, data_type, category, name, description)

    def update_model(self, id: UUID, data_type: Optional[List[DataType]], category: Optional[str], name: Optional[str], description: Optional[str]):
        return _model.update_model(self, id, data_type, category, name, description)

    def delete_model(self, id: UUID):
        return _model.delete_model(self, id)

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

    def list_device_by_ids(self, ids: list[UUID]) -> List[DeviceSchema]:
        return _device.list_device_by_ids(self, ids)

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

    def list_gateway_by_ids(self, ids: list[UUID]) -> List[GatewaySchema]:
        return _device.list_gateway_by_ids(self, ids)

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

    def list_type_by_ids(self, ids: list[UUID]) -> List[TypeSchema]:
        return _types.list_type_by_ids(self, ids)

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

    def list_group_model_by_ids(self, ids: list[UUID]) -> List[GroupModelSchema]:
        return _group.list_group_model_by_ids(self, ids)

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

    def list_group_device_by_ids(self, ids: list[UUID]) -> List[GroupDeviceSchema]:
        return _group.list_group_device_by_ids(self, ids)

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

    def list_group_gateway_by_ids(self, ids: list[UUID]) -> List[GroupGatewaySchema]:
        return _group.list_group_gateway_by_ids(self, ids)

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

    def read_set(self, id: UUID) -> SetSchema:
        return _set.read_set(self, id)

    def list_set_by_ids(self, ids: List[UUID]) -> List[SetSchema]:
        return _set.list_set_by_ids(self, ids)

    def list_set_by_template(self, template_id: UUID) -> List[SetSchema]:
        return _set.list_set_by_template(self, template_id)

    def list_set_by_name(self, name: str) -> List[SetSchema]:
        return _set.list_set_by_name(self, name)

    def create_set(self, id: UUID, template_id: UUID, name: str, description: str) -> UUID:
        return _set.create_set(self, id, template_id, name, description)

    def update_set(self, id: UUID, template_id: Optional[UUID], name: Optional[str], description: Optional[str]):
        return _set.update_set(self, id, template_id, name, description)

    def delete_set(self, id: UUID):
        return _set.delete_set(self, id)

    def add_set_member(self, id: UUID, device_id: UUID, model_id: UUID, data_index: List[int]):
        return _set.add_set_member(self, id, device_id, model_id, data_index)

    def remove_set_member(self, id: UUID, device_id: UUID, model_id: UUID):
        return _set.remove_set_member(self, id, device_id, model_id)

    def swap_set_member(self, id: UUID, device_id_1: UUID, model_id_1: UUID, device_id_2: UUID, model_id_2: UUID):
        return _set.swap_set_member(self, id, device_id_1, model_id_1, device_id_2, model_id_2)

    def read_set_template(self, id: UUID) -> SetTemplateSchema:
        return _set.read_set_template(self, id)

    def list_set_template_by_ids(self, ids: List[UUID]) -> List[SetTemplateSchema]:
        return _set.list_set_template_by_ids(self, ids)

    def list_set_template_by_name(self, name: str) -> List[SetTemplateSchema]:
        return _set.list_set_template_by_name(self, name)

    def create_set_template(self, id: UUID, name: str, description: str) -> UUID:
        return _set.create_set_template(self, id, name, description)

    def update_set_template(self, id: UUID, name: Optional[str], description: Optional[str]):
        return _set.update_set_template(self, id, name, description)

    def delete_set_template(self, id: UUID):
        return _set.delete_set_template(self, id)

    def add_set_template_member(self, id: UUID, type_id: UUID, model_id: UUID, data_index: List[int]):
        return _set.add_set_template_member(self, id, type_id, model_id, data_index)

    def remove_set_template_member(self, id: UUID, index: int):
        return _set.remove_set_template_member(self, id, index)

    def swap_set_template_member(self, id: UUID, index_1: int, index_2: int):
        return _set.swap_set_template_member(self, id, index_1, index_2)

    def read_data(self, device_id: UUID, model_id: UUID, timestamp: datetime) -> DataSchema:
        return _data.read_data(self, device_id, model_id, timestamp)

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

    def create_data(self, device_id: UUID, model_id: UUID, timestamp: datetime, data: List[Union[int, float, str, bool, None]]):
        return _data.create_data(self, device_id, model_id, timestamp, data)

    def delete_data(self, device_id: UUID, model_id: UUID, timestamp: datetime):
        return _data.delete_data(self, device_id, model_id, timestamp)

    def list_data_by_set_time(self, set_id: UUID, timestamp: datetime) -> List[DataSchema]:
        return _data.list_data_by_set_time(self, set_id, timestamp)

    def list_data_by_set_last_time(self, set_id: UUID, last: datetime) -> List[DataSchema]:
        return _data.list_data_by_set_last_time(self, set_id, last)

    def list_data_by_set_range_time(self, set_id: UUID, begin: datetime, end: datetime) -> List[DataSchema]:
        return _data.list_data_by_set_range_time(self, set_id, begin, end)

    def list_data_by_set_number_before(self, set_id: UUID, before: datetime, number: int) -> List[DataSchema]:
        return _data.list_data_by_set_number_before(self, set_id, before, number)

    def list_data_by_set_number_after(self, set_id: UUID, after: datetime, number: int) -> List[DataSchema]:
        return _data.list_data_by_set_number_after(self, set_id, after, number)

    def read_data_set(self, set_id: UUID, timestamp: datetime) -> DataSetSchema:
        return _data.read_data_set(self, set_id, timestamp)

    def list_data_set_by_time(self, set_id: UUID, timestamp: datetime) -> List[DataSetSchema]:
        return _data.list_data_set_by_time(self, set_id, timestamp)

    def list_data_set_by_last_time(self, set_id: UUID, last: datetime) -> List[DataSetSchema]:
        return _data.list_data_set_by_last_time(self, set_id, last)

    def list_data_set_by_range_time(self, set_id: UUID, begin: datetime, end: datetime) -> List[DataSetSchema]:
        return _data.list_data_set_by_range_time(self, set_id, begin, end)

    def list_data_set_by_number_before(self, set_id: UUID, before: datetime, number: int) -> List[DataSetSchema]:
        return _data.list_data_set_by_number_before(self, set_id, before, number)

    def list_data_set_by_number_after(self, set_id: UUID, after: datetime, number: int) -> List[DataSetSchema]:
        return _data.list_data_set_by_number_after(self, set_id, after, number)

    def read_buffer(self, id: int) -> BufferSchema:
        return _buffer.read_buffer(self, id)

    def read_buffer_by_time(self, device_id: UUID, model_id: UUID, timestamp: datetime, status: Optional[Union[str, int]]=None) -> BufferSchema:
        return _buffer.read_buffer_by_time(self, device_id, model_id, timestamp, status)

    def read_buffer_first(self, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> BufferSchema:
        return _buffer.read_buffer_first(self, device_id, model_id, status)

    def read_buffer_last(self, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> BufferSchema:
        return _buffer.read_buffer_last(self, device_id, model_id, status)

    def list_buffer_first(self, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> List[BufferSchema]:
        return _buffer.list_buffer_first(self, number, device_id, model_id, status)

    def list_buffer_first_offset(self, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> List[BufferSchema]:
        return _buffer.list_buffer_first_offset(self, number, offset, device_id, model_id, status)

    def list_buffer_last(self, number: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> List[BufferSchema]:
        return _buffer.list_buffer_last(self, number, device_id, model_id, status)

    def list_buffer_last_offset(self, number: int, offset: int, device_id: Optional[UUID]=None, model_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> List[BufferSchema]:
        return _buffer.list_buffer_last_offset(self, number, offset, device_id, model_id, status)

    def create_buffer(self, device_id: UUID, model_id: UUID, timestamp: datetime, data: List[Union[int, float, str, bool, None]], status: Union[str, int]) -> int:
        return _buffer.create_buffer(self, device_id, model_id, timestamp, data, status)

    def update_buffer(self, id: int, data: Optional[List[Union[int, float, str, bool, None]]], status: Optional[Union[str, int]]):
        return _buffer.update_buffer(self, id, data, status)

    def delete_buffer(self, id: int):
        return _buffer.delete_buffer(self, id)

    def read_slice(self, id: int) -> SliceSchema:
        return _slice.read_slice(self, id)

    def list_slice_by_time(self, device_id: UUID, model_id: UUID, timestamp: datetime) -> List[SliceSchema]:
        return _slice.list_slice_by_time(self, device_id, model_id, timestamp)

    def list_slice_by_range_time(self, device_id: UUID, model_id: UUID, begin: datetime, end: datetime) -> List[SliceSchema]:
        return _slice.list_slice_by_range_time(self, device_id, model_id, begin, end)

    def list_slice_by_name_time(self, name: str, timestamp: datetime) -> List[SliceSchema]:
        return _slice.list_slice_by_name_time(self, name, timestamp)

    def list_slice_by_name_range_time(self, name: str, begin: datetime, end: datetime) -> List[SliceSchema]:
        return _slice.list_slice_by_name_range_time(self, name, begin, end)

    def list_slice_option(self, device_id: Optional[UUID], model_id: Optional[UUID], name: Optional[str], begin_or_timestamp: Optional[datetime], end: Optional[datetime]) -> List[SliceSchema]:
        return _slice.list_slice_option(self, device_id, model_id, name, begin_or_timestamp, end)

    def create_slice(self, device_id: UUID, model_id: UUID, timestamp_begin: datetime, timestamp_end: datetime, name: str, description: str) -> int:
        return _slice.create_slice(self, device_id, model_id, timestamp_begin, timestamp_end, name, description)

    def update_slice(self, id: int, timestamp_begin: Optional[datetime], timestamp_end: Optional[datetime], name: Optional[str], description: Optional[str]):
        return _slice.update_slice(self, id, timestamp_begin, timestamp_end, name, description)

    def delete_slice(self, id: int):
        return _slice.delete_slice(self, id)

    def read_slice_set(self, id: int) -> SliceSetSchema:
        return _slice.read_slice_set(self, id)

    def list_slice_set_by_time(self, set_id: UUID, timestamp: datetime) -> List[SliceSetSchema]:
        return _slice.list_slice_set_by_time(self, set_id, timestamp)

    def list_slice_set_by_range_time(self, set_id: UUID, begin: datetime, end: datetime) -> List[SliceSetSchema]:
        return _slice.list_slice_set_by_range_time(self, set_id, begin, end)

    def list_slice_set_by_name_time(self, name: str, timestamp: datetime) -> List[SliceSetSchema]:
        return _slice.list_slice_set_by_name_time(self, name, timestamp)

    def list_slice_set_by_name_range_time(self, name: str, begin: datetime, end: datetime) -> List[SliceSetSchema]:
        return _slice.list_slice_set_by_name_range_time(self, name, begin, end)

    def list_slice_set_option(self, set_id: Optional[UUID], name: Optional[str], begin_or_timestamp: Optional[datetime], end: Optional[datetime]) -> List[SliceSetSchema]:
        return _slice.list_slice_set_option(self, set_id, name, begin_or_timestamp, end)

    def create_slice_set(self, set_id: UUID, timestamp_begin: datetime, timestamp_end: datetime, name: str, description: str) -> int:
        return _slice.create_slice_set(self, set_id, timestamp_begin, timestamp_end, name, description)

    def update_slice_set(self, id: int, timestamp_begin: Optional[datetime], timestamp_end: Optional[datetime], name: Optional[str], description: Optional[str]):
        return _slice.update_slice_set(self, id, timestamp_begin, timestamp_end, name, description)

    def delete_slice_set(self, id: int):
        return _slice.delete_slice_set(self, id)

    def read_log(self, timestamp: datetime, device_id: UUID) -> LogSchema:
        return _log.read_log(self, timestamp, device_id)

    def list_log_by_time(self, timestamp: datetime, device_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> List[LogSchema]:
        return _log.list_log_by_time(self, timestamp, device_id, status)

    def list_log_by_last_time(self, last: datetime, device_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> List[LogSchema]:
        return _log.list_log_by_last_time(self, last, device_id, status)

    def list_log_by_range_time(self, begin: datetime, end: datetime, device_id: Optional[UUID]=None, status: Optional[Union[str, int]]=None) -> List[LogSchema]:
        return _log.list_log_by_range_time(self, begin, end, device_id, status)

    def create_log(self, timestamp: datetime, device_id: UUID, status: Union[str, int], value: List[Union[int, float, str, bool, None]]):
        return _log.create_log(self, timestamp, device_id, status, value)

    def update_log(self, timestamp: datetime, device_id: UUID, status: Optional[Union[str, int]], value: List[Union[int, float, str, bool, None]]):
        return _log.update_log(self, timestamp, device_id, status, value)

    def delete_log(self, timestamp: datetime, device_id: UUID):
        return _log.delete_log(self, timestamp, device_id)
