use tonic::{Request, Status};
use chrono::{DateTime, Utc};
use rmcs_resource_api::slice::slice_service_client::SliceServiceClient;
use rmcs_resource_api::slice::{
    SliceSchema, SliceId, SliceName, SliceDevice, SliceModel, SliceDeviceModel, SliceUpdate
};
use crate::resource::Resource;
use crate::utility::TokenInterceptor;

const SLICE_NOT_FOUND: &str = "requested slice not found";

pub(crate) async fn read_slice(resource: &Resource, id: u32)
    -> Result<SliceSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceId {
        id
    });
    let response = client.read_slice(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(SLICE_NOT_FOUND))?)
}

pub(crate) async fn list_slice_by_name(resource: &Resource, name: &str)
    -> Result<Vec<SliceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceName {
        name: name.to_owned()
    });
    let response = client.list_slice_by_name(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_slice_by_device(resource: &Resource, device_id: u64)
    -> Result<Vec<SliceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceDevice {
        device_id
    });
    let response = client.list_slice_by_device(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_slice_by_model(resource: &Resource, model_id: u32)
    -> Result<Vec<SliceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceModel {
        model_id
    });
    let response = client.list_slice_by_model(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_slice_by_device_model(resource: &Resource, device_id: u64, model_id: u32)
    -> Result<Vec<SliceSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceDeviceModel {
        device_id,
        model_id
    });
    let response = client.list_slice_by_device_model(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_slice(resource: &Resource, device_id: u64, model_id: u32, timestamp_begin: DateTime<Utc>, timestamp_end: DateTime<Utc>, index_begin: Option<u16>, index_end: Option<u16>, name: &str, description: Option<&str>)
    -> Result<u32, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceSchema {
        id: 0,
        device_id,
        model_id,
        timestamp_begin: timestamp_begin.timestamp_nanos(),
        timestamp_end: timestamp_end.timestamp_nanos(),
        index_begin: index_begin.unwrap_or_default() as u32,
        index_end: index_end.unwrap_or_default() as u32,
        name: name.to_owned(),
        description: description.unwrap_or_default().to_owned()
    });
    let response = client.create_slice(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_slice(resource: &Resource, id: u32, timestamp_begin: Option<DateTime<Utc>>, timestamp_end: Option<DateTime<Utc>>, index_begin: Option<u16>, index_end: Option<u16>, name: Option<&str>, description: Option<&str>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceUpdate {
        id,
        timestamp_begin: timestamp_begin.map(|t| t.timestamp_nanos()),
        timestamp_end: timestamp_end.map(|t| t.timestamp_nanos()),
        index_begin: index_begin.map(|i| i as u32),
        index_end: index_end.map(|i| i as u32),
        name: name.map(|s| s.to_owned()),
        description: description.map(|s| s.to_owned())
    });
    client.update_slice(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_slice(resource: &Resource, id: u32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        SliceServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(SliceId {
        id
    });
    client.delete_slice(request)
        .await?;
    Ok(())
}
