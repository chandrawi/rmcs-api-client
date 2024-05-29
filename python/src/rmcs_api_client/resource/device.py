from rmcs_resource_api import device_pb2, device_pb2_grpc
from typing import Optional, Union, List
from dataclasses import dataclass
from uuid import UUID
import grpc
from .common import ConfigType, pack_config, unpack_config
from .types import TypeSchema


@dataclass
class DeviceConfigSchema:
    id: int
    device_id: UUID
    name: str
    value: Union[int, float, str]
    category: str

    def from_response(r):
        value = unpack_config(r.config_bytes, ConfigType(r.config_type))
        return DeviceConfigSchema(r.id, UUID(bytes=r.device_id), r.name, value, r.category)


@dataclass
class GatewayConfigSchema:
    id: int
    gateway_id: UUID
    name: str
    value: Union[int, float, str]
    category: str

    def from_response(r):
        value = unpack_config(r.config_bytes, ConfigType(r.config_type))
        return GatewayConfigSchema(r.id, UUID(bytes=r.gateway_id), r.name, value, r.category)


@dataclass
class DeviceSchema:
    id: UUID
    gateway_id: UUID
    serial_number: str
    name: str
    description: str
    type: TypeSchema
    configs: List[DeviceConfigSchema]

    def from_response(r):
        configs = []
        for conf in r.configs: configs.append(DeviceConfigSchema.from_response(conf))
        type_schema = TypeSchema.from_response(r.device_type)
        return DeviceSchema(UUID(bytes=r.id), UUID(bytes=r.gateway_id), r.serial_number, r.name, r.description, type_schema, configs)


@dataclass
class GatewaySchema:
    id: UUID
    serial_number: str
    name: str
    description: str
    type: TypeSchema
    configs: List[GatewayConfigSchema]

    def from_response(r):
        configs = []
        for conf in r.configs: configs.append(GatewayConfigSchema.from_response(conf))
        type_schema = TypeSchema.from_response(r.device_type)
        return GatewaySchema(UUID(bytes=r.id), r.serial_number, r.name, r.description, type_schema, configs)


def read_device(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.DeviceId(id=id.bytes)
        response = stub.ReadDevice(request=request, metadata=resource.metadata)
        return DeviceSchema.from_response(response.result)

def read_device_by_sn(resource, serial_number: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.SerialNumber(serial_number=serial_number)
        response = stub.ReadDeviceBySn(request=request, metadata=resource.metadata)
        return DeviceSchema.from_response(response.result)

def list_device_by_gateway(resource, gateway_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.GatewayId(id=gateway_id.bytes)
        response = stub.ListDeviceByGateway(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DeviceSchema.from_response(result))
        return ls

def list_device_by_type(resource, type_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeId(id=type_id.bytes)
        response = stub.ListDeviceByType(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DeviceSchema.from_response(result))
        return ls

def list_device_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.DeviceName(name=name)
        response = stub.ListDeviceByName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DeviceSchema.from_response(result))
        return ls

def list_device_by_gateway_type(resource, gateway_id: UUID, type_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.DeviceGatewayType(gateway_id=gateway_id.bytes, type_id=type_id.bytes)
        response = stub.ListDeviceByGatewayType(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DeviceSchema.from_response(result))
        return ls

def list_device_by_gateway_name(resource, gateway_id: UUID, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.DeviceGatewayName(gateway_id=gateway_id.bytes, name=name)
        response = stub.ListDeviceByGatewayName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DeviceSchema.from_response(result))
        return ls

def create_device(resource, id: UUID, gateway_id: UUID, type_id: UUID, serial_number: str, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        type_schema = device_pb2.TypeSchema(id=type_id.bytes)
        request = device_pb2.DeviceSchema(
            id=id.bytes,
            gateway_id=gateway_id.bytes,
            serial_number=serial_number,
            name=name,
            description=description,
            device_type=type_schema
        )
        response = stub.CreateDevice(request=request, metadata=resource.metadata)
        return UUID(bytes=response.id)

def update_device(resource, id: UUID, gateway_id: Optional[UUID]=None, type_id: Optional[UUID]=None, serial_number: Optional[str]=None, name: Optional[str]=None, description: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        gateway_bytes = None
        if gateway_id != None: gateway_bytes = gateway_id.bytes
        type_bytes = None
        if type_id != None: type_bytes = type_id.bytes
        request = device_pb2.DeviceUpdate(
            id=id.bytes,
            gateway_id=gateway_bytes,
            serial_number=serial_number,
            name=name,
            description=description,
            type_id=type_bytes
        )
        stub.UpdateDevice(request=request, metadata=resource.metadata)

def delete_device(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.DeviceId(id=id.bytes)
        stub.DeleteDevice(request=request, metadata=resource.metadata)

def read_gateway(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.GatewayId(id=id.bytes)
        response = stub.ReadGateway(request=request, metadata=resource.metadata)
        return GatewaySchema.from_response(response.result)

def read_gateway_by_sn(resource, serial_number: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.SerialNumber(serial_number=serial_number)
        response = stub.ReadGatewayBySn(request=request, metadata=resource.metadata)
        return GatewaySchema.from_response(response.result)

def list_gateway_by_type(resource, type_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeId(id=type_id.bytes)
        response = stub.ListGatewayByType(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(GatewaySchema.from_response(result))
        return ls

def list_gateway_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.GatewayName(name=name)
        response = stub.ListGatewayByName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(GatewaySchema.from_response(result))
        return ls

def create_gateway(resource, id: UUID, type_id: UUID, serial_number: str, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        type_schema = device_pb2.TypeSchema(id=type_id.bytes)
        request = device_pb2.GatewaySchema(
            id=id.bytes,
            serial_number=serial_number,
            name=name,
            description=description,
            gateway_type=type_schema
        )
        response = stub.CreateGateway(request=request, metadata=resource.metadata)
        return UUID(bytes=response.id)

def update_gateway(resource, id: UUID, type_id: Optional[UUID]=None, serial_number: Optional[str]=None, name: Optional[str]=None, description: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.GatewayUpdate(
            id=id.bytes,
            serial_number=serial_number,
            name=name,
            description=description,
            type_id=type_id.bytes
        )
        stub.UpdateGateway(request=request, metadata=resource.metadata)

def delete_gateway(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.GatewayId(id=id.bytes)
        stub.DeleteGateway(request=request, metadata=resource.metadata)

def read_device_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigId(id=id)
        response = stub.ReadDeviceConfig(request=request, metadata=resource.metadata)
        return DeviceConfigSchema.from_response(response.result)

def list_device_config_by_device(resource, device_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.DeviceId(id=device_id.bytes)
        response = stub.ListDeviceConfig(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(DeviceConfigSchema.from_response(result))
        return ls

def create_device_config(resource, device_id: UUID, name: str, value: Union[int, float, str, None], category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigSchema(
            device_id=device_id.bytes,
            name=name,
            config_bytes=pack_config(value),
            config_type=ConfigType.from_value(value).value,
            category=category
        )
        response = stub.CreateDeviceConfig(request=request, metadata=resource.metadata)
        return response.id

def update_device_config(resource, id: int, name: Optional[str]=None, value: Union[int, float, str, None]=None, category: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigUpdate(
            id=id,
            name=name,
            config_bytes=pack_config(value),
            config_type=ConfigType.from_value(value).value,
            category=category
        )
        stub.UpdateDeviceConfig(request=request, metadata=resource.metadata)

def delete_device_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigId(id=id)
        stub.DeleteDeviceConfig(request=request, metadata=resource.metadata)

def read_gateway_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigId(id=id)
        response = stub.ReadGatewayConfig(request=request, metadata=resource.metadata)
        return GatewayConfigSchema.from_response(response.result)

def list_gateway_config_by_gateway(resource, gateway_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.GatewayId(id=gateway_id.bytes)
        response = stub.ListGatewayConfig(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(GatewayConfigSchema.from_response(result))
        return ls

def create_gateway_config(resource, gateway_id: UUID, name: str, value: Union[int, float, str, None], category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigSchema(
            device_id=gateway_id.bytes,
            name=name,
            config_bytes=pack_config(value),
            config_type=ConfigType.from_value(value).value,
            category=category
        )
        response = stub.CreateGatewayConfig(request=request, metadata=resource.metadata)
        return response.id

def update_gateway_config(resource, id: int, name: Optional[str]=None, value: Union[int, float, str, None]=None, category: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigUpdate(
            id=id,
            name=name,
            config_bytes=pack_config(value),
            config_type=ConfigType.from_value(value).value,
            category=category
        )
        stub.UpdateGatewayConfig(request=request, metadata=resource.metadata)

def delete_gateway_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.ConfigId(id=id)
        stub.DeleteGatewayConfig(request=request, metadata=resource.metadata)
