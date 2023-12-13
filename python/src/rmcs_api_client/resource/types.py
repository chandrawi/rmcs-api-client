from rmcs_resource_api import device_pb2, device_pb2_grpc
from typing import Optional, List
from dataclasses import dataclass
from uuid import UUID
import grpc


@dataclass
class TypeSchema:
    id: UUID
    name: str
    description: str
    models: List[UUID]

    def from_response(r):
        models = []
        for model in r.models: models.append(UUID(bytes=model))
        return TypeSchema(UUID(bytes=r.id), r.name, r.description, models)


def read_type(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeId(id=id.bytes)
        response = stub.ReadType(request=request, metadata=resource.metadata)
        return TypeSchema.from_response(response.result)

def list_type_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeName(name=name)
        response = stub.ListTypeByName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(TypeSchema.from_response(result))
        return ls

def create_type(resource, id: UUID, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeSchema(
            id=id.bytes,
            name=name,
            description=description
        )
        response = stub.CreateType(request=request, metadata=resource.metadata)
        return UUID(bytes=response.id)

def update_type(resource, id: UUID, name: Optional[str], description: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeUpdate(
            id=id.bytes,
            name=name,
            description=description
        )
        stub.UpdateType(request=request, metadata=resource.metadata)

def delete_type(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeId(id=id.bytes)
        stub.DeleteType(request=request, metadata=resource.metadata)

def add_type_model(resource, id: UUID, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeModel(id=id.bytes, model_id=model_id.bytes)
        stub.AddTypeModel(request=request, metadata=resource.metadata)

def remove_type_model(resource, id: UUID, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = device_pb2_grpc.DeviceServiceStub(channel)
        request = device_pb2.TypeModel(id=id.bytes, model_id=model_id.bytes)
        stub.RemoveTypeModel(request=request, metadata=resource.metadata)
