from rmcs_resource_api import group_pb2, group_pb2_grpc
from typing import Optional, List
from dataclasses import dataclass
from uuid import UUID
import grpc


@dataclass
class GroupModelSchema:
    id: UUID
    name: str
    category: str
    description: str
    models: List[UUID]

    def from_response(r):
        models = []
        for model in r.models: models.append(UUID(bytes=model))
        return GroupModelSchema(UUID(bytes=r.id), r.name, r.category, r.description, models)


@dataclass
class GroupDeviceSchema:
    id: UUID
    name: str
    category: str
    description: str
    devices: List[UUID]

    def from_response(r):
        devices = []
        for device in r.devices: devices.append(UUID(bytes=device))
        return GroupDeviceSchema(UUID(bytes=r.id), r.name, r.category, r.description, devices)


@dataclass
class GroupGatewaySchema:
    id: UUID
    name: str
    category: str
    description: str
    gateways: List[UUID]

    def from_response(r):
        gateways = []
        for gateway in r.gateways: gateways.append(UUID(bytes=gateway))
        return GroupGatewaySchema(UUID(bytes=r.id), r.name, r.category, r.description, gateways)

def read_group_model(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupId(id=id.bytes)
        response = stub.ReadGroupModel(request)
        return GroupModelSchema.from_response(response.result)

def list_group_model_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupName(name=name)
        response = stub.ListGroupModelByName(request)
        ls = []
        for result in response.results: ls.append(GroupModelSchema.from_response(result))
        return ls

def list_group_model_by_category(resource, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupCategory(category=category)
        response = stub.ListGroupModelByCategory(request)
        ls = []
        for result in response.results: ls.append(GroupModelSchema.from_response(result))
        return ls

def list_group_model_by_name_category(resource, name: str, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupNameCategory(name=name, category=category)
        response = stub.ListGroupModelByNameCategory(request)
        ls = []
        for result in response.results: ls.append(GroupModelSchema.from_response(result))
        return ls

def create_group_model(resource, name: str, category: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupModelSchema(
            name=name,
            category=category,
            description=description
        )
        response = stub.CreateGroupModel(request)
        return UUID(bytes=response.id)

def update_group_model(resource, id: UUID, name: Optional[str], category: Optional[str], description: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupUpdate(
            id=id.bytes,
            name=name,
            category=category,
            description=description
        )
        stub.UpdateGroupModel(request)

def delete_group_model(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupId(id=id.bytes)
        stub.DeleteGroupModel(request)

def add_group_model_member(resource, id: UUID, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupModel(id=id.bytes, model_id=model_id.bytes)
        stub.AddGroupModelMember(request)

def remove_group_model_member(resource, id: UUID, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupModel(id=id.bytes, model_id=model_id.bytes)
        stub.RemoveGroupModelMember(request)

def read_group_device(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupId(id=id.bytes)
        response = stub.ReadGroupDevice(request)
        return GroupDeviceSchema.from_response(response.result)

def list_group_device_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupName(name=name)
        response = stub.ListGroupDeviceByName(request)
        ls = []
        for result in response.results: ls.append(GroupDeviceSchema.from_response(result))
        return ls

def list_group_device_by_category(resource, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupCategory(category=category)
        response = stub.ListGroupDeviceByCategory(request)
        ls = []
        for result in response.results: ls.append(GroupDeviceSchema.from_response(result))
        return ls

def list_group_device_by_name_category(resource, name: str, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupNameCategory(name=name, category=category)
        response = stub.ListGroupDeviceByNameCategory(request)
        ls = []
        for result in response.results: ls.append(GroupDeviceSchema.from_response(result))
        return ls

def create_group_device(resource, name: str, category: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupDeviceSchema(
            name=name,
            category=category,
            description=description
        )
        response = stub.CreateGroupDevice(request)
        return UUID(bytes=response.id)

def update_group_device(resource, id: UUID, name: Optional[str], category: Optional[str], description: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupUpdate(
            id=id.bytes,
            name=name,
            category=category,
            description=description
        )
        stub.UpdateGroupDevice(request)

def delete_group_device(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupId(id=id.bytes)
        stub.DeleteGroupDevice(request)

def add_group_device_member(resource, id: UUID, device_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupDevice(id=id.bytes, device_id=device_id.bytes)
        stub.AddGroupDeviceMember(request)

def remove_group_device_member(resource, id: UUID, device_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupDevice(id=id.bytes, device_id=device_id.bytes)
        stub.RemoveGroupDeviceMember(request)

def read_group_gateway(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupId(id=id.bytes)
        response = stub.ReadGroupGateway(request)
        return GroupGatewaySchema.from_response(response.result)

def list_group_gateway_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupName(name=name)
        response = stub.ListGroupGatewayByName(request)
        ls = []
        for result in response.results: ls.append(GroupGatewaySchema.from_response(result))
        return ls

def list_group_gateway_by_category(resource, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupCategory(category=category)
        response = stub.ListGroupGatewayByCategory(request)
        ls = []
        for result in response.results: ls.append(GroupGatewaySchema.from_response(result))
        return ls

def list_group_gateway_by_name_category(resource, name: str, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupNameCategory(name=name, category=category)
        response = stub.ListGroupGatewayByNameCategory(request)
        ls = []
        for result in response.results: ls.append(GroupGatewaySchema.from_response(result))
        return ls

def create_group_gateway(resource, name: str, category: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupDeviceSchema(
            name=name,
            category=category,
            description=description
        )
        response = stub.CreateGroupGateway(request)
        return UUID(bytes=response.id)

def update_group_gateway(resource, id: UUID, name: Optional[str], category: Optional[str], description: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupUpdate(
            id=id.bytes,
            name=name,
            category=category,
            description=description
        )
        stub.UpdateGroupGateway(request)

def delete_group_gateway(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupId(id=id.bytes)
        stub.DeleteGroupGateway(request)

def add_group_gateway_member(resource, id: UUID, gateway_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupDevice(id=id.bytes, device_id=gateway_id.bytes)
        stub.AddGroupGatewayMember(request)

def remove_group_gateway_member(resource, id: UUID, gateway_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = group_pb2_grpc.GroupServiceStub(channel)
        request = group_pb2.GroupDevice(id=id.bytes, device_id=gateway_id.bytes)
        stub.RemoveGroupGatewayMember(request)
