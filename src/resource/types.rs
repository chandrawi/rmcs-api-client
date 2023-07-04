use tonic::{Request, Status};
use rmcs_resource_api::device::device_service_client::DeviceServiceClient;
use rmcs_resource_api::device::{
    TypeSchema, TypeId, TypeName, TypeUpdate, TypeModel
};
use crate::resource::Resource;
use crate::utility::TokenInterceptor;

const TYPE_NOT_FOUND: &str = "requested type not found";

pub(crate) async fn read_type(resource: &Resource, id: u32)
    -> Result<TypeSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeId {
        id
    });
    let response = client.read_type(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(TYPE_NOT_FOUND))?)
}

pub(crate) async fn list_type_by_name(resource: &Resource, name: &str)
    -> Result<Vec<TypeSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeName {
        name: name.to_owned()
    });
    let response = client.list_type_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_type(resource: &Resource, name: &str, description: Option<&str>)
    -> Result<u32, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeSchema {
        id: 0,
        name: name.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        models: Vec::new()
    });
    let response = client.create_type(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_type(resource: &Resource, id: u32, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeUpdate {
        id,
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_type(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_type(resource: &Resource, id: u32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeId {
        id
    });
    client.delete_type(request)
        .await?;
    Ok(())
}

pub(crate) async fn add_type_model(resource: &Resource, id: u32, model_id: u32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeModel {
        id,
        model_id
    });
    client.add_type_model(request)
        .await?;
    Ok(())
}

pub(crate) async fn remove_type_model(resource: &Resource, id: u32, model_id: u32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeModel {
        id,
        model_id
    });
    client.remove_type_model(request)
        .await?;
    Ok(())
}
