use tonic::{Request, Status};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use rmcs_resource_db::schema::value::{DataValue, ArrayDataValue};
use rmcs_resource_api::common;
use rmcs_resource_api::buffer::buffer_service_client::BufferServiceClient;
use rmcs_resource_api::buffer::{
    BufferSchema, BufferId, BufferTime, BufferSelector, BuffersSelector, BufferUpdate
};
use crate::resource::Resource;
use rmcs_api_server::utility::interceptor::TokenInterceptor;

const BUFFER_NOT_FOUND: &str = "requested buffer not found";

pub(crate) async fn read_buffer(resource: &Resource, id: i32)
    -> Result<BufferSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferId {
        id
    });
    let response = client.read_buffer(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn read_buffer_by_time(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, status: Option<i16>)
    -> Result<BufferSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferTime {
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        status: status.map(|i| i as i32)
    });
    let response = client.read_buffer_by_time(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn read_buffer_first(resource: &Resource, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<i16>)
    -> Result<BufferSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: status.map(|i| i as i32)
    });
    let response = client.read_buffer_first(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn read_buffer_last(resource: &Resource, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<i16>)
    -> Result<BufferSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: status.map(|i| i as i32)
    });
    let response = client.read_buffer_last(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn list_buffer_first(resource: &Resource, number: u32, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<i16>)
    -> Result<Vec<BufferSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BuffersSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: status.map(|i| i as i32),
        number
    });
    let response = client.list_buffer_first(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_buffer_last(resource: &Resource, number: u32, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<i16>)
    -> Result<Vec<BufferSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BuffersSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: status.map(|i| i as i32),
        number
    });
    let response = client.list_buffer_last(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_buffer(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: DateTime<Utc>, data: Vec<DataValue>, status: i16)
    -> Result<i32, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferSchema {
        id: 0,
        device_id: device_id.as_bytes().to_vec(),
        model_id: model_id.as_bytes().to_vec(),
        timestamp: timestamp.timestamp_micros(),
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect(),
        status: status as i32
    });
    let response = client.create_buffer(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_buffer(resource: &Resource, id: i32, data: Option<Vec<DataValue>>, status: Option<i16>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferUpdate {
        id,
        data_bytes: data.as_deref().map(|v| ArrayDataValue::from_vec(v).to_bytes()),
        data_type: ArrayDataValue::from_vec(&data.unwrap_or_default()).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect(),
        status: status.map(|i| i as i32)
    });
    client.update_buffer(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_buffer(resource: &Resource, id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferId {
        id
    });
    client.delete_buffer(request)
        .await?;
    Ok(())
}
