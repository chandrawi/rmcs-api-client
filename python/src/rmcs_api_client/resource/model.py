from rmcs_resource_api import model_pb2, model_pb2_grpc
from typing import Optional, Union, List
from dataclasses import dataclass
from uuid import UUID
import grpc
from .common import DataIndexing, ConfigType, DataType, pack_config, unpack_config


@dataclass
class ModelConfigSchema:
    id: int
    model_id: UUID
    index: int
    name: str
    value: Union[int, float, str, None]
    category: str

    def from_response(r):
        value = unpack_config(r.config_bytes, ConfigType.from_int(r.config_type))
        return ModelConfigSchema(r.id, UUID(bytes=r.model_id), r.index, r.name, value, r.category)


@dataclass
class ModelSchema:
    id: UUID
    indexing: DataIndexing
    category: str
    name: str
    description: str
    types: List[DataType]
    configs: List[List[ModelConfigSchema]]

    def from_response(r):
        indexing = DataIndexing.from_int(r.indexing)
        types = []
        for ty in r.types:
            types.append(DataType.from_int(ty))
        configs = []
        for conf_vec in r.configs:
            confs = []
            for conf in conf_vec.configs: confs.append(ModelConfigSchema.from_response(conf))
            configs.append(confs)
        return ModelSchema(UUID(bytes=r.id), indexing, r.category, r.name, r.description, types, configs)


def read_model(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelId(id=id.bytes)
        response = stub.ReadModel(request)
        return ModelSchema.from_response(response.result)

def list_model_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelName(name=name)
        response = stub.ListModelByName(request)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def list_model_by_category(resource, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelCategory(category=category)
        response = stub.ListModelByCategory(request)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def list_model_by_name_category(resource, name: str, category: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelNameCategory(name=name, category=category)
        response = stub.ListModelByCategory(request)
        ls = []
        for result in response.results: ls.append(ModelSchema.from_response(result))
        return ls

def create_model(resource, indexing: DataIndexing, category: str, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelSchema(
            indexing=indexing.value,
            category=category,
            name=name,
            description=description,
        )
        response = stub.CreateModel(request)
        return UUID(bytes=response.id)

def update_model(resource, id: UUID, indexing: Optional[DataIndexing], category: Optional[str], name: Optional[str], description: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        model_indexing = None
        if indexing != None: model_indexing = indexing.value
        request = model_pb2.ModelUpdate(
            id=id.bytes,
            indexing=model_indexing,
            category=category,
            name=name,
            description=description
        )
        stub.UpdateModel(request)

def delete_model(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelId(id=id.bytes)
        stub.DeleteModel(request)

def add_model_type(resource, id: UUID, types: List[DataType]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        data_types = []
        for ty in types: data_types.append(ty.value)
        request = model_pb2.ModelTypes(id=id.bytes, types=data_types)
        stub.AddModelType(request)

def remove_model_type(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelTypes(id=id.bytes)
        stub.RemoveModelType(request)

def read_model_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ConfigId(id=id)
        response = stub.ReadModelConfig(request)
        return ModelConfigSchema.from_response(response.result)

def list_model_config_by_model(resource, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ModelId(id=model_id.bytes)
        response = stub.ListModelConfig(request)
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
            config_bytes=pack_config(value),
            config_type=ConfigType.from_value(value).value,
            category=category
        )
        response = stub.CreateModelConfig(request)
        return response.id

def update_model_config(resource, id: int, name: Optional[str], value: Union[int, float, str, None], category: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ConfigUpdate(
            id=id,
            name=name,
            config_bytes=pack_config(value),
            config_type=ConfigType.from_value(value).value,
            category=category
        )
        stub.UpdateModelConfig(request)

def delete_model_config(resource, id: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = model_pb2_grpc.ModelServiceStub(channel)
        request = model_pb2.ConfigId(id=id)
        stub.DeleteModelConfig(request)
