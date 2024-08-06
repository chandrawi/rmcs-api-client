from rmcs_resource_api import set_pb2, set_pb2_grpc
from typing import Optional, List
from dataclasses import dataclass
from uuid import UUID
import grpc


@dataclass
class SetMember:
    device_id: UUID
    model_id: UUID
    data_index: List[int]

    def from_response(r):
        return SetMember(UUID(bytes=r.device_id), UUID(bytes=r.model_id), list(r.data_index))

@dataclass
class SetSchema:
    id: UUID
    template_id: UUID
    name: str
    description: str
    members: List[SetMember]

    def from_response(r):
        members = []
        for member in r.members: members.append(SetMember.from_response(member))
        return SetSchema(UUID(bytes=r.id), UUID(bytes=r.template_id), r.name, r.description, members)

@dataclass
class SetTemplateMember:
    type_id: UUID
    model_id: UUID
    data_index: List[int]

    def from_response(r):
        return SetTemplateMember(UUID(bytes=r.type_id), UUID(bytes=r.model_id), list(r.data_index))

@dataclass
class SetTemplateSchema:
    id: UUID
    name: str
    description: str
    members: List[SetTemplateMember]

    def from_response(r):
        members = []
        for member in r.members: members.append(SetTemplateMember.from_response(member))
        return SetTemplateSchema(UUID(bytes=r.id), r.name, r.description, members)


def read_set(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetId(id=id.bytes)
        response = stub.ReadSet(request=request, metadata=resource.metadata)
        return SetSchema.from_response(response.result)

def list_set_by_ids(resource, ids: list[UUID]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetIds(ids=list(map(lambda x: x.bytes, ids)))
        response = stub.ListSetByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SetSchema.from_response(result))
        return ls

def list_set_by_template(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateId(id=id.bytes)
        response = stub.ListSetByTemplate(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SetSchema.from_response(result))
        return ls

def list_set_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetName(name=name)
        response = stub.ListSetByName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SetSchema.from_response(result))
        return ls

def list_set_option(resource, template_id: Optional[UUID], name: Optional[UUID]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        template_bytes = None
        if template_id != None: template_bytes = template_id.bytes
        request = set_pb2.SetOption(
            template_id=template_bytes,
            name=name
        )
        response = stub.ListSetOption(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SetSchema.from_response(result))
        return ls

def create_set(resource, id: UUID, template_id: UUID, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetSchema(
            id=id.bytes,
            template_id=template_id.bytes,
            name=name,
            description=description
        )
        response = stub.CreateSet(request=request, metadata=resource.metadata)
        return UUID(bytes=response.id)

def update_set(resource, id: UUID, template_id: Optional[UUID], name: Optional[str], description: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        template_bytes = None
        if template_id != None: template_bytes = template_id.bytes
        request = set_pb2.SetUpdate(
            id=id.bytes,
            template_id=template_bytes,
            name=name,
            description=description
        )
        stub.UpdateSet(request=request, metadata=resource.metadata)

def delete_set(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetId(id=id.bytes)
        stub.DeleteSet(request=request, metadata=resource.metadata)

def add_set_member(resource, id: UUID, device_id: UUID, model_id: UUID, data_index: list[int]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetMemberRequest(
            set_id=id,
            device_id=device_id,
            model_id=model_id,
            data_index=bytes(data_index)
        )
        stub.AddSetMember(request=request, metadata=resource.metadata)

def remove_set_member(resource, id: UUID, device_id: UUID, model_id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetMemberRequest(
            set_id=id,
            device_id=device_id,
            model_id=model_id
        )
        stub.RemoveSetMember(request=request, metadata=resource.metadata)

def swap_set_member(resource, id: UUID, device_id_1: UUID, model_id_1: UUID, device_id_2: UUID, model_id_2: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetMemberSwap(
            set_id=id,
            device_id_1=device_id_1,
            model_id_1=model_id_1,
            device_id_2=device_id_2,
            model_id_2=model_id_2
        )
        stub.SwapSetMember(request=request, metadata=resource.metadata)

def read_set_template(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateId(id=id.bytes)
        response = stub.ReadSetTemplate(request=request, metadata=resource.metadata)
        return SetTemplateSchema.from_response(response.result)

def list_set_template_by_ids(resource, ids: list[UUID]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateIds(ids=list(map(lambda x: x.bytes, ids)))
        response = stub.ListSetTemplateByIds(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SetTemplateSchema.from_response(result))
        return ls

def list_set_template_by_name(resource, name: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateName(name=name)
        response = stub.ListSetTemplateByName(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SetTemplateSchema.from_response(result))
        return ls

def list_set_template_option(resource, name: Optional[UUID]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetOption(
            name=name
        )
        response = stub.ListSetTemplateOption(request=request, metadata=resource.metadata)
        ls = []
        for result in response.results: ls.append(SetSchema.from_response(result))
        return ls

def create_set_template(resource, id: UUID, name: str, description: str):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateSchema(
            id=id.bytes,
            name=name,
            description=description
        )
        response = stub.CreateSetTemplate(request=request, metadata=resource.metadata)
        return UUID(bytes=response.id)

def update_set_template(resource, id: UUID, name: Optional[str], description: Optional[str]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateUpdate(
            id=id.bytes,
            name=name,
            description=description
        )
        stub.UpdateSetTemplate(request=request, metadata=resource.metadata)

def delete_set_template(resource, id: UUID):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateId(id=id.bytes)
        stub.DeleteSetTemplate(request=request, metadata=resource.metadata)

def add_set_template_member(resource, id: UUID, type_id: UUID, model_id: UUID, data_index: list[int]):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateMemberRequest(
            set_id=id,
            type_id=type_id,
            model_id=model_id,
            data_index=bytes(data_index)
        )
        stub.AddSetTemplateMember(request=request, metadata=resource.metadata)

def remove_set_template_member(resource, id: UUID, index: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateMemberRequest(
            set_id=id,
            template_index=index
        )
        stub.RemoveSetTemplateMember(request=request, metadata=resource.metadata)

def swap_set_template_member(resource, id: UUID, index_1: int, index_2: int):
    with grpc.insecure_channel(resource.address) as channel:
        stub = set_pb2_grpc.SetServiceStub(channel)
        request = set_pb2.SetTemplateMemberSwap(
            set_id=id,
            template_index_1=index_1,
            template_index_2=index_2
        )
        stub.SwapSetTemplateMember(request=request, metadata=resource.metadata)
