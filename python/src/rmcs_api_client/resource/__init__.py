from datetime import datetime
from uuid import UUID
from typing import Optional, Union, List
from . import model as _model, device as _device, types as _types, group as _group
from .common import DataIndexing, DataType
from .model import ModelSchema, ModelConfigSchema
from .device import DeviceSchema, GatewaySchema, DeviceConfigSchema, GatewayConfigSchema
from .types import TypeSchema
from .group import GroupModelSchema, GroupDeviceSchema, GroupGatewaySchema

class Resource:

    def __init__(self, address: str, access_token: str = None, refresh_token: str = None):
        self.address = address
        self.access_token = access_token
        self.refresh_token = refresh_token

    def read_model(self, id: UUID) -> ModelSchema:
        return _model.read_model(self, id)

    def list_model_by_name(self, name: str) -> List[ModelSchema]:
        return _model.list_model_by_name(self, name)

    def list_model_by_category(self, category: str) -> List[ModelSchema]:
        return _model.list_model_by_category(self, category)

    def list_model_by_name_category(self, name: str, category: str) -> List[ModelSchema]:
        return _model.list_model_by_name_category(self, name, category)

    def create_model(self, indexing: DataIndexing, category: str, name: str, description: str) -> UUID:
        return _model.create_model(self, indexing, category, name, description)

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

    def create_type(self, name: str, description: str) -> UUID:
        return _types.create_type(self, name, description)

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

    def create_group_model(self, name: str, category: str, description: str) -> UUID:
        return _group.create_group_model(self, name, category, description)

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

    def create_group_device(self, name: str, category: str, description: str) -> UUID:
        return _group.create_group_device(self, name, category, description)

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

    def create_group_gateway(self, name: str, category: str, description: str) -> UUID:
        return _group.create_group_gateway(self, name, category, description)

    def update_group_gateway(self, id: UUID, name: Optional[str], category: Optional[str], description: Optional[str]):
        return _group.update_group_gateway(self, id, name, category, description)

    def delete_group_gateway(self, id: UUID):
        return _group.delete_group_gateway(self, id)

    def add_group_gateway_member(self, id: UUID, gateway_id: UUID):
        return _group.add_group_gateway_member(self, id, gateway_id)

    def remove_group_gateway_member(self, id: UUID, gateway_id: UUID):
        return _group.remove_group_gateway_member(self, id, gateway_id)
