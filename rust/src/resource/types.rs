use tonic::{Request, Status};
use uuid::Uuid;
use rmcs_resource_api::device::device_service_client::DeviceServiceClient;
use rmcs_resource_api::device::{
    TypeSchema, TypeId, TypeName, TypeUpdate, TypeModel
};
use crate::resource::Resource;
use rmcs_api_server::utility::interceptor::TokenInterceptor;

const TYPE_NOT_FOUND: &str = "requested type not found";

pub(crate) async fn read_type(resource: &Resource, id: Uuid)
    -> Result<TypeSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeId {
        id: id.as_bytes().to_vec()
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
    -> Result<Uuid, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeSchema {
        id: Uuid::nil().as_bytes().to_vec(),
        name: name.to_owned(),
        description: description.unwrap_or_default().to_owned(),
        models: Vec::new()
    });
    let response = client.create_type(request)
        .await?
        .into_inner();
    Ok(Uuid::from_slice(&response.id).unwrap_or_default())
}

pub(crate) async fn update_type(resource: &Resource, id: Uuid, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeUpdate {
        id: id.as_bytes().to_vec(),
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_type(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_type(resource: &Resource, id: Uuid)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeId {
        id: id.as_bytes().to_vec()
    });
    client.delete_type(request)
        .await?;
    Ok(())
}

pub(crate) async fn add_type_model(resource: &Resource, id: Uuid, model_id: Uuid)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeModel {
        id: id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec()
    });
    client.add_type_model(request)
        .await?;
    Ok(())
}

pub(crate) async fn remove_type_model(resource: &Resource, id: Uuid, model_id: Uuid)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        DeviceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(TypeModel {
        id: id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec()
    });
    client.remove_type_model(request)
        .await?;
    Ok(())
}
