use tonic::{Request, Status};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use rmcs_resource_db::schema::value::DataValue;
use rmcs_resource_db::tag as Tag;
use rmcs_resource_api::log::log_service_client::LogServiceClient;
use rmcs_resource_api::log::{
    LogId, LogIds, LogRange, LogSchema, LogTime, LogUpdate, LogUpdateTime
};
use crate::resource::Resource;
use rmcs_api_server::utility::interceptor::TokenInterceptor;

const LOG_NOT_FOUND: &str = "requested log not found";

pub(crate) async fn read_log(resource: &Resource, id: i32)
    -> Result<LogSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogId { id });
    let response = client.read_log(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(LOG_NOT_FOUND))?)
}

pub(crate) async fn read_log_by_time(resource: &Resource, timestamp: DateTime<Utc>, device_id: Option<Uuid>, model_id: Option<Uuid>, tag: Option<i16>)
    -> Result<LogSchema, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogTime {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        tag: tag.map(|i| i as i32)
    });
    let response = client.read_log_by_time(request)
        .await?
        .into_inner();
    Ok(response.result.ok_or(Status::not_found(LOG_NOT_FOUND))?)
}

pub(crate) async fn list_log_by_ids(resource: &Resource, ids: &[i32])
    -> Result<Vec<LogSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogIds {
        ids: ids.to_vec()
    });
    let response = client.list_log_by_ids(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_log_by_time(resource: &Resource, timestamp: DateTime<Utc>, device_id: Option<Uuid>, model_id: Option<Uuid>, tag: Option<i16>)
    -> Result<Vec<LogSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogTime {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        tag: tag.map(|i| i as i32)
    });
    let response = client.list_log_by_time(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_log_by_latest(resource: &Resource, last: DateTime<Utc>, device_id: Option<Uuid>, model_id: Option<Uuid>, tag: Option<i16>)
    -> Result<Vec<LogSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogTime {
        timestamp: last.timestamp_micros(),
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        tag: tag.map(|i| i as i32)
    });
    let response = client.list_log_by_latest(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn list_log_by_range(resource: &Resource, begin: DateTime<Utc>, end: DateTime<Utc>, device_id: Option<Uuid>, model_id: Option<Uuid>, tag: Option<i16>)
    -> Result<Vec<LogSchema>, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogRange {
        begin: begin.timestamp_micros(),
        end: end.timestamp_micros(),
        device_id: device_id.map(|x| x.as_bytes().to_vec()),
        model_id: model_id.map(|x| x.as_bytes().to_vec()),
        tag: tag.map(|i| i as i32)
    });
    let response = client.list_log_by_range(request)
        .await?
        .into_inner();
    Ok(response.results)
}

pub(crate) async fn create_log(resource: &Resource, timestamp: DateTime<Utc>, device_id: Option<Uuid>, model_id: Option<Uuid>, value: DataValue, tag: Option<i16>)
    -> Result<i32, Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogSchema {
        id: 0,
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.map(|id| id.as_bytes().to_vec()),
        model_id: model_id.map(|id| id.as_bytes().to_vec()),
        log_bytes: value.to_bytes(),
        log_type: value.get_type().into(),
        tag: tag.unwrap_or(Tag::DEFAULT) as i32
    });
    let response = client.create_log(request)
        .await?
        .into_inner();
    Ok(response.id)
}

pub(crate) async fn update_log(resource: &Resource, id: i32, value: Option<DataValue>, tag: Option<i16>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogUpdate {
        id: id,
        log_bytes: value.clone().map(|s| s.to_bytes()),
        log_type: value.map(|s| s.get_type().into()),
        tag: tag.map(|i| i as i32)
    });
    client.update_log(request)
        .await?;
    Ok(())
}

pub(crate) async fn update_log_by_time(resource: &Resource, timestamp: DateTime<Utc>, device_id: Option<Uuid>, model_id: Option<Uuid>, value: Option<DataValue>, tag: Option<i16>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogUpdateTime {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.map(|id| id.as_bytes().to_vec()),
        model_id: model_id.map(|id| id.as_bytes().to_vec()),
        log_bytes: value.clone().map(|s| s.to_bytes()),
        log_type: value.map(|s| s.get_type().into()),
        tag: tag.map(|i| i as i32)
    });
    client.update_log_by_time(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_log(resource: &Resource, id: i32)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogId { id });
    client.delete_log(request)
        .await?;
    Ok(())
}

pub(crate) async fn delete_log_by_time(resource: &Resource, timestamp: DateTime<Utc>, device_id: Option<Uuid>, model_id: Option<Uuid>, tag: Option<i16>)
    -> Result<(), Status>
{
    let interceptor = TokenInterceptor(resource.access_token.clone());
    let mut client = 
        LogServiceClient::with_interceptor(resource.channel.to_owned(), interceptor);
    let request = Request::new(LogTime {
        timestamp: timestamp.timestamp_micros(),
        device_id: device_id.map(|id| id.as_bytes().to_vec()),
        model_id: model_id.map(|id| id.as_bytes().to_vec()),
        tag: tag.map(|i| i as i32)
    });
    client.delete_log_by_time(request)
        .await?;
    Ok(())
}
