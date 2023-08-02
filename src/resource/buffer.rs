use tonic::{Request, Status};
use chrono::NaiveDateTime;
use uuid::Uuid;
use rmcs_resource_db::schema::value::{DataValue, ArrayDataValue};
use rmcs_resource_api::common;
use rmcs_resource_api::buffer::buffer_service_client::BufferServiceClient;
use rmcs_resource_api::buffer::{
    BufferSchema, BufferId, BufferSelector, BuffersSelector, BufferUpdate, BufferStatus
};
use crate::resource::Resource;
use crate::utility::TokenInterceptor;

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

pub(crate) async fn read_buffer_first(resource: &Resource, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
    -> Result<BufferSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        }
    });
    let response = client.read_buffer_first(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn read_buffer_last(resource: &Resource, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
    -> Result<BufferSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BufferSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        }
    });
    let response = client.read_buffer_last(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(BUFFER_NOT_FOUND))?)
}

pub(crate) async fn list_buffer_first(resource: &Resource, number: u32, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
    -> Result<Vec<BufferSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BuffersSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        },
        number
    });
    let response = client.list_buffer_first(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_buffer_last(resource: &Resource, number: u32, device_id: Option<Uuid>, model_id: Option<Uuid>, status: Option<&str>)
    -> Result<Vec<BufferSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        BufferServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(BuffersSelector {
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        status: match status {
            Some(value) => match BufferStatus::from_str_name(value) {
                Some(v) => Some(v.into()),
                None => None
            },
            None => None
        },
        number
    });
    let response = client.list_buffer_last(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_buffer(resource: &Resource, device_id: Uuid, model_id: Uuid, timestamp: NaiveDateTime, index: Option<i32>, data: Vec<DataValue>, status: &str)
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
        index: index.unwrap_or(0) as i32,
        data_bytes: ArrayDataValue::from_vec(&data).to_bytes(),
        data_type: ArrayDataValue::from_vec(&data).get_types().into_iter().map(|el| {
            Into::<common::DataType>::into(el).into()
        }).collect(),
        status: BufferStatus::from_str_name(status).unwrap_or_default().into()
    });
    let response = client.create_buffer(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_buffer(resource: &Resource, id: i32, data: Option<Vec<DataValue>>, status: Option<&str>)
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
        status: status.map(|s| BufferStatus::from_str_name(s).unwrap_or_default().into())
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
