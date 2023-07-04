use tonic::{Request, Status};
use rmcs_resource_api::group::group_service_client::GroupServiceClient;
use rmcs_resource_api::group::{
    GroupModelSchema, GroupDeviceSchema, GroupId, GroupName, GroupNameCategory, GroupCategory, GroupUpdate,
    GroupModel, GroupDevice
};
use crate::resource::Resource;

const GROUP_NOT_FOUND: &str = "requested group not found";

pub(crate) async fn read_group_model(resource: &Resource, id: u32)
    -> Result<GroupModelSchema, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupId {
        id
    });
    let response = client.read_group_model(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(GROUP_NOT_FOUND))?)
}

pub(crate) async fn list_group_model_by_name(resource: &Resource, name: &str)
    -> Result<Vec<GroupModelSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupName {
        name: name.to_owned()
    });
    let response = client.list_group_model_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_group_model_by_category(resource: &Resource, category: &str)
    -> Result<Vec<GroupModelSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupCategory {
        category: category.to_owned()
    });
    let response = client.list_group_model_by_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_group_model_by_name_category(resource: &Resource, name: &str, category: &str)
    -> Result<Vec<GroupModelSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupNameCategory {
        name: name.to_owned(),
        category: category.to_owned()
    });
    let response = client.list_group_model_by_name_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_group_model(resource: &Resource, name: &str, category: &str, description: Option<&str>)
    -> Result<u32, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupModelSchema {
        id: 0,
        name: name.to_owned(),
        category: category.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        models: Vec::new()
    });
    let response = client.create_group_model(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_group_model(resource: &Resource, id: u32, name: Option<&str>, category: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        category: category.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_group_model(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_group_model(resource: &Resource, id: u32)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupId {
        id
    });
    client.delete_group_model(request)
        .await?;
    Ok(())
}

pub(crate) async fn add_group_model_member(resource: &Resource, id: u32, model_id: u32)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupModel {
        id,
        model_id
    });
    client.add_group_model_member(request)
        .await?;
    Ok(())
}

pub(crate) async fn remove_group_model_member(resource: &Resource, id: u32, model_id: u32)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupModel {
        id,
        model_id
    });
    client.remove_group_model_member(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_group_device(resource: &Resource, id: u32)
    -> Result<GroupDeviceSchema, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupId {
        id
    });
    let response = client.read_group_device(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(GROUP_NOT_FOUND))?)
}

pub(crate) async fn list_group_device_by_name(resource: &Resource, name: &str)
    -> Result<Vec<GroupDeviceSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupName {
        name: name.to_owned()
    });
    let response = client.list_group_device_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_group_device_by_category(resource: &Resource, category: &str)
    -> Result<Vec<GroupDeviceSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupCategory {
        category: category.to_owned()
    });
    let response = client.list_group_device_by_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_group_device_by_name_category(resource: &Resource, name: &str, category: &str)
    -> Result<Vec<GroupDeviceSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupNameCategory {
        name: name.to_owned(),
        category: category.to_owned()
    });
    let response = client.list_group_device_by_name_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_group_device(resource: &Resource, name: &str, category: &str, description: Option<&str>)
    -> Result<u32, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupDeviceSchema {
        id: 0,
        name: name.to_owned(),
        category: category.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        devices: Vec::new()
    });
    let response = client.create_group_device(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_group_device(resource: &Resource, id: u32, name: Option<&str>, category: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        category: category.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_group_device(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_group_device(resource: &Resource, id: u32)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupId {
        id
    });
    client.delete_group_device(request)
        .await?;
    Ok(())
}

pub(crate) async fn add_group_device_member(resource: &Resource, id: u32, device_id: u64)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupDevice {
        id,
        device_id
    });
    client.add_group_device_member(request)
        .await?;
    Ok(())
}

pub(crate) async fn remove_group_device_member(resource: &Resource, id: u32, device_id: u64)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupDevice {
        id,
        device_id
    });
    client.remove_group_device_member(request)
        .await?;
    Ok(())
}

pub(crate) async fn read_group_gateway(resource: &Resource, id: u32)
    -> Result<GroupDeviceSchema, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupId {
        id
    });
    let response = client.read_group_gateway(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(GROUP_NOT_FOUND))?)
}

pub(crate) async fn list_group_gateway_by_name(resource: &Resource, name: &str)
    -> Result<Vec<GroupDeviceSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupName {
        name: name.to_owned()
    });
    let response = client.list_group_gateway_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_group_gateway_by_category(resource: &Resource, category: &str)
    -> Result<Vec<GroupDeviceSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupCategory {
        category: category.to_owned()
    });
    let response = client.list_group_gateway_by_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_group_gateway_by_name_category(resource: &Resource, name: &str, category: &str)
    -> Result<Vec<GroupDeviceSchema>, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupNameCategory {
        name: name.to_owned(),
        category: category.to_owned()
    });
    let response = client.list_group_gateway_by_name_category(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_group_gateway(resource: &Resource, name: &str, category: &str, description: Option<&str>)
    -> Result<u32, Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupDeviceSchema {
        id: 0,
        name: name.to_owned(),
        category: category.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        devices: Vec::new()
    });
    let response = client.create_group_gateway(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_group_gateway(resource: &Resource, id: u32, name: Option<&str>, category: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        category: category.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_group_gateway(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_group_gateway(resource: &Resource, id: u32)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupId {
        id
    });
    client.delete_group_gateway(request)
        .await?;
    Ok(())
}

pub(crate) async fn add_group_gateway_member(resource: &Resource, id: u32, gateway_id: u64)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupDevice {
        id,
        device_id: gateway_id
    });
    client.add_group_gateway_member(request)
        .await?;
    Ok(())
}

pub(crate) async fn remove_group_gateway_member(resource: &Resource, id: u32, gateway_id: u64)
    -> Result<(), Status>
{
    let mut client = GroupServiceClient::new(resource.channel.to_owned());
    let request = Request::new(GroupDevice {
        id,
        device_id: gateway_id
    });
    client.remove_group_gateway_member(request)
        .await?;
    Ok(())
}
