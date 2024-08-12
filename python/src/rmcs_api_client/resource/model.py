from rmcs_resource_api import model_pb2, model_pb2_grpc
from typing import Optional, Union, List
from dataclasses import dataclass
from uuid import UUID
import grpc
from .common import DataType, pack_data, unpack_data


@dataclass
class ModelConfigSchema:
    id: int
    model_id: UUID
    index: int
    name: str
    value: Union[int, float, str, None]
    category: str

    def from_response(r):
        value = unpack_data(r.config_bytes, DataType(r.config_type))
        return ModelConfigSchema(r.id, UUID(bytes=r.model_id), r.index, r.name, value, r.category)


@dataclass
class ModelSchema:
    id: UUID
    category: str
    name: str
    description: str
    data_type: List[DataType]
    configs: List[List[ModelConfigSchema]]

    def from_response(r):
        types = []
        for ty in r.data_type:
            types.append(DataType(ty))
        configs = []
        for conf_vec in r.configs:
            confs = []
            for conf in conf_vec.configs: confs.append(ModelConfigSchema.from_response(conf))
            configs.append(confs)
        return ModelSchema(UUID(bytes=r.id), r.category, r.name, r.description, types, configs)


def read_model(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelId(id=id.bytes)
        response = stub.ReadModel(request=request, metadata=resource.metadata)
        return ModelSchema.from_response(response.result)

def list_model_by_ids(resource, ids: list[UUID]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelIds(ids=list(map(lambda x: x.bytes, ids)))
        response = stub.ListModelByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def list_model_by_type(resource, type_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.TypeId(id=type_id)
        response = stub.ListModelByType(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def list_model_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelName(name=name)
        response = stub.ListModelByName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def list_model_by_category(resource, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelCategory(category=category)
        response = stub.ListModelByCategory(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def list_model_option(resource, type_id: Optional[UUID], name: Optional[str], category: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        type_bytes = None
        if type_id != None: type_bytes = type_id.bytes
        request = model_pb2.ModelOption(
            type_id=type_bytes,
            name=name,
            category=category
        )
        response = stub.ListModelOption(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def create_model(resource, id: UUID, data_type: List[DataType], category: str, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        types = []
        for ty in data_type: types.append(ty.value)
        request = model_pb2.ModelSchema(
            id=id.bytes,
            category=category,
            name=name,
            description=description,
            data_type=types
        )
        response = stub.CreateModel(request=request, metadata=resource.metadata)
        return UUID(bytes=response.id)

def update_model(resource, id: UUID, data_type: Optional[List[DataType]]=None, category: Optional[str]=None, name: Optional[str]=None, description: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        type_flag = False
        types = []
        if (data_type is not None):
            type_flag = True
            for ty in data_type: types.append(ty.value)
        request = model_pb2.ModelUpdate(
            id=id.bytes,
            category=category,
            name=name,
            description=description,
            data_type=types,
            data_type_flag=type_flag
        )
        stub.UpdateModel(request=request, metadata=resource.metadata)

def delete_model(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelId(id=id.bytes)
        stub.DeleteModel(request=request, metadata=resource.metadata)

def read_model_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ConfigId(id=id)
        response = stub.ReadModelConfig(request=request, metadata=resource.metadata)
        return ModelConfigSchema.from_response(response.result)

def list_model_config_by_model(resource, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelId(id=model_id.bytes)
        response = stub.ListModelConfig(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(ModelConfigSchema.from_response(result))
        return ls

def create_model_config(resource, model_id: UUID, index: int, name: str, value: Union[int, float, str, None], category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ConfigSchema(
            model_id=model_id.bytes,
            index=index,
            name=name,
            config_bytes=pack_data(value),
            config_type=DataType.from_value(value).value,
            category=category
        )
        response = stub.CreateModelConfig(request=request, metadata=resource.metadata)
        return response.id

def update_model_config(resource, id: int, name: Optional[str]=None, value: Union[int, float, str, None]=None, category: Optional[str]=None):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ConfigUpdate(
            id=id,
            name=name,
            config_bytes=pack_data(value),
            config_type=DataType.from_value(value).value,
            category=category
        )
        stub.UpdateModelConfig(request=request, metadata=resource.metadata)

def delete_model_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ConfigId(id=id)
        stub.DeleteModelConfig(request=request, metadata=resource.metadata)
